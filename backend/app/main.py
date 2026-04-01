from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as bill_router
from app.auth.routes import router as auth_router
import os

app = FastAPI(title="BillScan AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bill_router)
app.include_router(auth_router)

@app.on_event("startup")
async def startup_event():
    print("[STARTUP] Pre-loading OCR model...")
    try:
        from app.core.ocr import get_reader
        get_reader()
        print("[STARTUP] OCR model ready!")
    except Exception as e:
        print(f"[STARTUP] OCR preload failed: {e}")

@app.get("/")
def root():
    return {"status": "BillScan AI Running"}

@app.get("/health")
def health():
    return {"status": "ok"}
