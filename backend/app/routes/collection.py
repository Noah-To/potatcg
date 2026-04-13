from fastapi import APIRouter
from app.models.schemas import Card
from app.services import collection_service

router = APIRouter()


@router.get("/collection/{username}")
async def get_collection(username: str):
    return collection_service.get(username)


@router.post("/collection/{username}")
async def add_card(username: str, card: Card):
    return collection_service.add(username, card.model_dump())


@router.delete("/collection/{username}/{card_id}")
async def remove_card(username: str, card_id: str):
    return collection_service.remove(username, card_id)
