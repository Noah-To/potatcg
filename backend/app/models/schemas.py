from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str


class Card(BaseModel):
    id: str
    name: str
    image: str
    set_name: str
