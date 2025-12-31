import os
import sys
import shutil
import uuid
from pathlib import Path

# Ensure parent folder is on sys.path so absolute imports like `backend.xxx` work
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.ocr import extract_text
from backend.parser import parse_bill
from backend.model_ml import analyze_bill
from backend.db import save_report
BASE_DIR = Path(__file__).resolve().parent
UPLOADS = BASE_DIR / "uploads"
UPLOADS.mkdir(exist_ok=True)

app = FastAPI(title="Bill OCR + ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = UPLOADS / filename
    try:
        # save uploaded file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Ensure Google credentials env
        gcp = os.getenv("GCP_CREDENTIALS_PATH")
        if gcp and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = gcp

        # OCR
        try:
            text = extract_text(str(file_path))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OCR failed: {e}")

        # Parse
        try:
            items = parse_bill(text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Parsing failed: {e}")

        # ML
        try:
            report = analyze_bill(items)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ML failed: {e}")

        # Save to DB
        doc = {
            "filename": file.filename,
            "items": report.get("items", []),
            "report": report,
        }
        try:
            # `save_report` persists the document. It intentionally returns None.
            save_report(doc)
            doc_id = None
        except Exception:
            doc_id = None

        result = {
            "id": doc_id,
            "report": report,
            "message": "Processed",
        }

        return JSONResponse(status_code=200, content=result)
    finally:
        # cleanup
        try:
            if file_path.exists():
                file_path.unlink()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 5000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
