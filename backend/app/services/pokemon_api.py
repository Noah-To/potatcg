import httpx
from urllib.parse import quote
from app.core.config import TCG_API_KEY, TCG_API_BASE


async def fetch_cards(q: str = "", page_size: int = 20) -> dict:
    cleaned_q = q.strip()
    url = f"{TCG_API_BASE}/cards?pageSize={page_size}"

    if cleaned_q:
        search_query = (
            f'(name:"{cleaned_q}*" OR '
            f'set.name:"{cleaned_q}*" OR '
            f'number:"{cleaned_q}" OR '
            f'id:"{cleaned_q}*")'
        )
        url += f"&q={quote(search_query)}"

    headers = {"X-Api-Key": TCG_API_KEY} if TCG_API_KEY else {}

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()