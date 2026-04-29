import httpx
from urllib.parse import quote
from app.core.config import TCG_API_KEY, TCG_API_BASE

async def fetch_cards(q: str = "", page_size: int = 20, page: int = 1, set_id: str | None = None) -> dict:
    cleaned_q = q.strip()
    url = f"{TCG_API_BASE}/cards?pageSize={page_size}&page={page}"

    part_query = []

    if set_id:
        part_query.append(f'set.id:"{set_id}"')

    if cleaned_q:
        part_query.append(
            f'(name:"{cleaned_q}*" OR set.name:"{cleaned_q}*")'
        )

    if part_query:
        total_query = " AND ".join(part_query)
        url += f"&q={quote(total_query)}"

    headers = {"X-Api-Key": TCG_API_KEY} if TCG_API_KEY else {}

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()


async def fetch_sets(q: str = "", page_size: int = 20, page: int = 1) -> dict:
    url = f"{TCG_API_BASE}/sets?pageSize={page_size}&page={page}&orderBy=-releaseDate"

    if q.strip():
        url += f"&q={quote(f'name:\"{q.strip()}*\"')}"

    headers = {"X-Api-Key": TCG_API_KEY} if TCG_API_KEY else {}

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()