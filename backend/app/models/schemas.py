from pydantic import BaseModel


class RegisterRequest(BaseModel):
    username: str
    password: str
    display_name: str


class LoginRequest(BaseModel):
    username: str
    password: str


class ChangeDisplayNameRequest(BaseModel):
    username: str
    new_display_name: str


class ChangePasswordRequest(BaseModel):
    username: str
    current_password: str
    new_password: str


class DeleteAccountRequest(BaseModel):
    username: str
    password: str


class Card(BaseModel):
    id: str
    name: str
    image: str
    set_name: str
