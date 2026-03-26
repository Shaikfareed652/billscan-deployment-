from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.auth.utils import hash_password, verify_password, create_token, get_current_user
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: RegisterRequest):
    db = get_db()
    if db["users"].find_one({"email": data.email.lower()}):
        raise HTTPException(status_code=409, detail="Email already registered")
    db["users"].insert_one({
        "email": data.email.lower(),
        "hashed_password": hash_password(data.password),
        "bills_analyzed": 0
    })
    return TokenResponse(access_token=create_token(data.email), user_email=data.email)

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    db = get_db()
    user = db["users"].find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=create_token(data.email), user_email=data.email)

@router.get("/me")
def get_me(current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db["users"].find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": user["email"], "bills_analyzed": user.get("bills_analyzed", 0)}

@router.post("/google", response_model=TokenResponse)
def google_login(payload: dict):
    from google.oauth2 import id_token
    from google.auth.transport import requests as grequests
    GOOGLE_CLIENT_ID = "137346476008-9cb4dd70c9j5c3gld2cpn3sqvp7pb9d7.apps.googleusercontent.com"
    try:
        info = id_token.verify_oauth2_token(payload["credential"], grequests.Request(), GOOGLE_CLIENT_ID)
        email = info["email"]
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {e}")
    db = get_db()
    if not db["users"].find_one({"email": email.lower()}):
        db["users"].insert_one({"email": email.lower(), "hashed_password": "", "google_user": True, "bills_analyzed": 0})
    return TokenResponse(access_token=create_token(email), user_email=email)
