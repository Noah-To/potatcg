# Module-level in-memory store — resets on server restart (prototype only)
_collections: dict[str, list] = {}


def get(username: str) -> list:
    return _collections.get(username, [])


def init_user(username: str):
    if username not in _collections:
        _collections[username] = []


def add(username: str, card: dict) -> list:
    init_user(username)

    existing = next((c for c in _collections[username] if c["id"] == card["id"]), None)

    if existing:
        existing["quantity"] += 1
    else:
        card["quantity"] = 1
        _collections[username].append(card)

    return _collections[username]


def remove(username: str, card_id: str) -> list:
    if username in _collections:
        for card in _collections[username]:
            if card["id"] == card_id:
                if card.get("quantity", 1) > 1:
                    card["quantity"] -= 1
                else:
                    _collections[username] = [
                        c for c in _collections[username] if c["id"] != card_id
                    ]
                break

    return _collections.get(username, [])