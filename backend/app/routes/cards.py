from fastapi import APIRouter
from app.services.pokemon_api import fetch_cards, fetch_sets

router = APIRouter()


@router.get("/cards")
async def search_cards(q: str = "", pageSize: int = 20, page: int = 1, setId: str | None = None):
    return await fetch_cards(q, pageSize, page, setId)


@router.get("/sets")
async def search_sets(q: str = "", pageSize: int = 20, page: int = 1):
    return await fetch_sets(q, pageSize, page)

