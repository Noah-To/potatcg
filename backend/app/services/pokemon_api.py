import httpx
from urllib.parse import quote
from app.core.config import TCG_API_KEY, TCG_API_BASE

async def fetch_cards(q: str = "", page_size: int = 20, set_id: str | None = None) -> dict:
    cleaned_q = q.strip()
    url = f"{TCG_API_BASE}/cards?pageSize={page_size}"

    query_parts = []

    if set_id:
        query_parts.append(f'set.id:"{set_id}"')

    if cleaned_q:
        query_parts.append(
            f'(name:"{cleaned_q}*" OR set.name:"{cleaned_q}*" OR number:"{cleaned_q}" OR id:"{cleaned_q}*")'
        )

    if query_parts:
        full_query = " AND ".join(query_parts)
        url += f"&q={quote(full_query)}"

    headers = {"X-Api-Key": TCG_API_KEY} if TCG_API_KEY else {}

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()