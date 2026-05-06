from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.auth.utils import hash_password, verify_password, create_token, get_current_user
from app.db import get_db
import os
import logging

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
    # Retrieve Google Client ID from environment variables
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    if not GOOGLE_CLIENT_ID:
        logging.error("GOOGLE_CLIENT_ID environment variable is not set")
        raise HTTPException(status_code=500, detail="Server configuration error")
    
    # Check if credential is provided in the request body
    if "credential" not in payload:
        logging.warning("Missing 'credential' in request payload")
        raise HTTPException(status_code=400, detail="Missing credential")
    
    try:
        # Import Google auth libraries
        from google.oauth2 import id_token
        from google.auth.transport import requests as grequests
        
        # Verify the Google ID token
        info = id_token.verify_oauth2_token(payload["credential"], grequests.Request(), GOOGLE_CLIENT_ID)
        
        # Extract user profile information
        email = info.get("email")
        name = info.get("name")
        picture = info.get("picture")
        
        if not email:
            logging.error("Google token does not contain email")
            raise HTTPException(status_code=401, detail="Invalid Google token: no email")
        
        logging.info(f"Successfully verified Google token for user: {email}")
        
    except Exception as e:
        logging.error(f"Google token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Google token")
    
    # Database operations
    db = get_db()
    user = db["users"].find_one({"email": email.lower()})
    
    if not user:
        # Create new user with Google profile
        db["users"].insert_one({
            "email": email.lower(),
            "hashed_password": "",
            "google_user": True,
            "name": name,
            "picture": picture,
            "bills_analyzed": 0
        })
        logging.info(f"Created new Google user: {email}")
    else:
        # Update existing user with profile info if missing
        update_data = {}
        if not user.get("name") and name:
            update_data["name"] = name
        if not user.get("picture") and picture:
            update_data["picture"] = picture
        if update_data:
            db["users"].update_one({"email": email.lower()}, {"$set": update_data})
            logging.info(f"Updated profile for existing user: {email}")
    
    # Return authentication response with user profile
    user_profile = {
        "email": email,
        "name": name,
        "picture": picture
    }
    
    return TokenResponse(
        access_token=create_token(email),
        user_email=email,
        user_profile=user_profile
    )
