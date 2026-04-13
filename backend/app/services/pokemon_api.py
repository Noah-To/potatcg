import httpx
from app.core.config import TCG_API_KEY, TCG_API_BASE


async def fetch_cards(q: str = "", page_size: int = 20) -> dict:
    url = f"{TCG_API_BASE}/cards?pageSize={page_size}"
    if q:
        url += f"&q=name:{q}*"
    headers = {"X-Api-Key": TCG_API_KEY} if TCG_API_KEY else {}
    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()
