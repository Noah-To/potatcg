from fastapi import APIRouter
from app.services.pokemon_api import fetch_cards

router = APIRouter()


@router.get("/cards")
async def search_cards(q: str = "", pageSize: int = 20):
    return await fetch_cards(q, pageSize)
