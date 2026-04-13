from fastapi import APIRouter, HTTPException
from app.models.schemas import LoginRequest
from app.services import collection_service

router = APIRouter()


@router.post("/login")
async def login(data: LoginRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    collection_service.init_user(username)
    return {"username": username}
