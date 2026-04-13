# Module-level in-memory store — resets on server restart (prototype only)
_collections: dict[str, list] = {}


def get(username: str) -> list:
    return _collections.get(username, [])


def init_user(username: str):
    if username not in _collections:
        _collections[username] = []


def add(username: str, card: dict) -> list:
    init_user(username)
    if not any(c["id"] == card["id"] for c in _collections[username]):
        _collections[username].append(card)
    return _collections[username]


def remove(username: str, card_id: str) -> list:
    if username in _collections:
        _collections[username] = [
            c for c in _collections[username] if c["id"] != card_id
        ]
    return _collections.get(username, [])
