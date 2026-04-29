from app.services import user_service


def get(username: str) -> list:
    return user_service.get_collection(username)

# the function add and remove manipulates the user's collection, updating the card quantity with the use of buttons
def add(username: str, card: dict) -> list:
    collection = user_service.get_collection(username)

    card_In_Col = next((c for c in collection if c["id"] == card["id"]), None)

    if card_In_Col:
        card_In_Col["quantity"] += 1
    else:
        card["quantity"] = 1
        collection.append(card)

    user_service.save_collection(username, collection)
    return collection


def remove(username: str, card_id: str) -> list:
    collection = user_service.get_collection(username)

    for card in collection:
        if card["id"] == card_id:
            if card.get("quantity", 1) > 1:
                card["quantity"] -= 1
            else:
                collection = [c for c in collection if c["id"] != card_id]
            break

    user_service.save_collection(username, collection)
    return collection
