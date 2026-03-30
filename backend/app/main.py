from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as bill_router
from app.auth.routes import router as auth_router
import os

app = FastAPI(title="BillScan AI", version="1.0.0")

# Get frontend URL from environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.github.io",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bill_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "BillScan AI Running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
