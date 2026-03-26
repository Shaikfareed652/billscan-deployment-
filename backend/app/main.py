from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import router as bill_router
from backend.app.auth.routes import router as auth_router

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

@app.get("/health")
def health():
    return {"status": "ok", "message": "BillScan AI is running"}
