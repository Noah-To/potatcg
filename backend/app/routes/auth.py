from fastapi import APIRouter, HTTPException
from app.models.schemas import LoginRequest, RegisterRequest
from app.services import user_service

router = APIRouter()


@router.post("/register")
async def register(data: RegisterRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")
    if not user_service.register(username, data.password):
        raise HTTPException(status_code=409, detail="Username already taken")
    return {"username": username}


@router.post("/login")
async def login(data: LoginRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not user_service.exists(username):
        raise HTTPException(status_code=401, detail="Username not found")
    if not user_service.verify(username, data.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"username": username}
