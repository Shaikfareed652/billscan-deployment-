from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from pathlib import Path
from datetime import datetime
import uuid

router = APIRouter()
UPLOADS_DIR = Path(__file__).resolve().parents[3] / "backend" / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
security = HTTPBearer(auto_error=False)

def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    if not credentials:
        return None
    token = credentials.credentials
    if token == 'guest':
        return None
    try:
        from app.auth.utils import decode_token
        return decode_token(token)
    except Exception:
        return None

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/upload-bill")
async def upload_bill(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    content = await file.read()
    file_id = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOADS_DIR / file_id
    dest.write_bytes(content)
    return {"success": True, "file_id": file_id}

@router.post("/analyze/{file_id}")
def analyze_file(
    file_id: str,
    current_user: Optional[str] = Depends(get_optional_user)
):
    from app.core.ocr import extract_text
    from app.core.parser import parse_rows
    from app.core.analyzer import analyze_items
    from app.db import get_db

    dest = UPLOADS_DIR / file_id
    if not dest.exists():
        raise HTTPException(status_code=404, detail="File not found")

    try:
        lines = extract_text(str(dest))
        items = parse_rows(lines)
        result = analyze_items(items)

        # ML Fraud Detection
        try:
            from app.ml.predictor import predict_fraud
            fraud = predict_fraud(result["items"], result["summary"]["total_billed"])
            result["fraud_detection"] = fraud
        except Exception as e:
            result["fraud_detection"] = {"fraud_risk": "UNKNOWN", "explanation": str(e)}

        # Save bill history to MongoDB
        if current_user:
            db = get_db()
            db["users"].update_one(
                {"email": current_user},
                {"$inc": {"bills_analyzed": 1}}
            )
            db["bills"].insert_one({
                "email": current_user,
                "file_id": file_id,
                "analyzed_at": datetime.utcnow().isoformat(),
                "summary": result["summary"],
                "fraud_detection": result.get("fraud_detection", {}),
                "items": result["items"],
            })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bills/history")
def get_bill_history(
    current_user: Optional[str] = Depends(get_optional_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required to view history")
    from app.db import get_db
    db = get_db()
    bills = list(db["bills"].find(
        {"email": current_user},
        {"_id": 0}
    ).sort("analyzed_at", -1).limit(20))
    return {"bills": bills}
