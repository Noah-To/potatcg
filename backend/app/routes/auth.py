from fastapi import APIRouter, HTTPException
from app.models.schemas import LoginRequest, RegisterRequest, ChangeDisplayNameRequest, ChangePasswordRequest, DeleteAccountRequest
from app.services import user_service

router = APIRouter()


@router.post("/register")
async def register(data: RegisterRequest):
    username = data.username.strip()
    display_name = data.display_name.strip() if data.display_name.strip() else username
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")
    if not user_service.register(username, data.password, display_name):
        raise HTTPException(status_code=409, detail="Username already taken")
    return {"username": username, "display_name": display_name}


@router.post("/login")
async def login(data: LoginRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not user_service.exists(username):
        raise HTTPException(status_code=401, detail="Username not found")
    if not user_service.verify(username, data.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    display_name = user_service.get_display_name(username)
    return {"username": username, "display_name": display_name}


@router.put("/account/display_name")
async def change_display_name(data: ChangeDisplayNameRequest):
    username = data.username.strip()
    new_display_name = data.new_display_name.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not new_display_name:
        raise HTTPException(status_code=400, detail="Display name cannot be empty")
    if not user_service.change_display_name(username, new_display_name):
        raise HTTPException(status_code=404, detail="User not found")
    return {"display_name": new_display_name}


@router.put("/account/password")
async def change_password(data: ChangePasswordRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not data.new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    if not user_service.change_password(username, data.current_password, data.new_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    return {"detail": "Password updated"}


@router.delete("/account")
async def delete_account(data: DeleteAccountRequest):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not user_service.delete_user(username, data.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"detail": "Account deleted"}
