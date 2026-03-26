from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from pathlib import Path
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
        from backend.app.auth.utils import decode_token
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
    from backend.app.core.ocr import extract_text
    from backend.app.core.parser import parse_rows
    from backend.app.core.analyzer import analyze_items
    from backend.app.db import get_db

    dest = UPLOADS_DIR / file_id
    if not dest.exists():
        raise HTTPException(status_code=404, detail="File not found")

    try:
        lines = extract_text(str(dest))
        items = parse_rows(lines)
        result = analyze_items(items)

        # ML Fraud Detection
        try:
            from backend.app.ml.predictor import predict_fraud
            fraud = predict_fraud(result["items"], result["summary"]["total_billed"])
            result["fraud_detection"] = fraud
        except Exception as e:
            result["fraud_detection"] = {"fraud_risk": "UNKNOWN", "explanation": str(e)}

        if current_user:
            get_db()["users"].update_one(
                {"email": current_user},
                {"$inc": {"bills_analyzed": 1}}
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
