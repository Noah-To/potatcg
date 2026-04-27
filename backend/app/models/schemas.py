from pydantic import BaseModel


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class Card(BaseModel):
    id: str
    name: str
    image: str
    set_name: str
