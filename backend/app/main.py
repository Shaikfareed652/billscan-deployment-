from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as bill_router
from app.auth.routes import router as auth_router
import os

app = FastAPI(title="BillScan AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://billscanai.tech",
        "https://www.billscanai.tech",
        "https://shaikfareed22.github.io",
        "http://localhost:5173",
        "http://localhost:3000",
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
    return {"status": "BillScan AI Running"}

@app.get("/health")
def health():
    return {"status": "ok"}
