from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from pathlib import Path
from datetime import datetime
import uuid

router = APIRouter()

# Correct uploads path
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

security = HTTPBearer(auto_error=False)

ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:

    if not credentials:
        return None

    token = credentials.credentials

    if token == "guest":
        return None

    try:
        from app.auth.utils import decode_token
        return decode_token(token)
    except Exception:
        return None


@router.get("/health")
def health():
    return {
        "status": "BillScan Backend Running"
    }


@router.post("/upload-bill")
async def upload_bill(file: UploadFile = File(...)):

    ext = Path(file.filename).suffix.lower()

    # File validation
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and PDF files are allowed"
        )

    content = await file.read()

    # 10MB limit
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large"
        )

    file_id = f"{uuid.uuid4().hex}{ext}"

    dest = UPLOADS_DIR / file_id

    dest.write_bytes(content)

    return {
        "success": True,
        "file_id": file_id
    }


@router.post("/analyze/{file_id}")
def analyze_file(
    file_id: str,
    current_user: Optional[str] = Depends(get_optional_user)
):

    from app.core.ocr import extract_text
    from app.core.parser import parse_rows
    from app.core.analyzer import analyze_items

    dest = UPLOADS_DIR / file_id

    if not dest.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    try:

        # OCR
        lines = extract_text(str(dest))

        if not lines:
            raise HTTPException(
                status_code=400,
                detail="No text extracted from bill"
            )

        # Parse bill rows
        items = parse_rows(lines)

        if not items:
            raise HTTPException(
                status_code=400,
                detail="No bill items detected"
            )

        # Compare with reference prices
        result = analyze_items(items)

        # ML Fraud Detection
        try:
            from app.ml.predictor import predict_fraud

            total_billed = sum(
                item.get("bill_amount", 0)
                for item in result["items"]
            )

            fraud = predict_fraud(
                result["items"],
                total_billed
            )

            result["fraud_detection"] = fraud

        except Exception as e:

            result["fraud_detection"] = {
                "fraud_risk": "UNKNOWN",
                "explanation": str(e)
            }

        # Optional MongoDB save
        if current_user:

            from app.db import get_db

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
                "items": result["items"]
            })

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/bills/history")
def get_bill_history(
    current_user: Optional[str] = Depends(get_optional_user)
):

    if not current_user:
        raise HTTPException(
            status_code=401,
            detail="Login required"
        )

    from app.db import get_db

    db = get_db()

    bills = list(
        db["bills"]
        .find({"email": current_user}, {"_id": 0})
        .sort("analyzed_at", -1)
        .limit(20)
    )

    return {
        "bills": bills
    }