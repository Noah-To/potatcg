import json
import os
import hashlib
import secrets

# everytime the app reads or writes the user data, it loads and saves this file.
# simple and easy to manage in small scale, but hardly scalable
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'users.json')

# functions that can alter user data, (saving the collection, getting the data etc)
def load() -> dict:
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save(data: dict):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def hash(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 260000).hex()

def exists(username: str) -> bool:
    return username in load()

def register(username: str, password: str, display_name: str) -> bool:
    """Create a new user. Returns False if username already taken."""
    data = load()
    if username in data:
        return False
    salt = secrets.token_hex(16)
    data[username] = {
        'salt': salt,
        'password_hash': hash(password, salt),
        'display_name': display_name,
        'collection': [],
    }
    save(data)
    return True

def get_display_name(username: str) -> str:
    """Return display_name, falling back to username for legacy accounts."""
    data = load()
    return data.get(username, {}).get('display_name', username)

def verify(username: str, password: str) -> bool:
    """Return True if username exists and password is correct."""
    data = load()
    if username not in data:
        return False
    user = data[username]
    hashedPW = hash(password, user['salt'])
    return secrets.compare_digest(hashedPW, user['password_hash'])

def get_collection(username: str) -> list:
    return load().get(username, {}).get('collection', [])

def save_collection(username: str, collection: list):
    data = load()
    if username in data:
        data[username]['collection'] = collection
        save(data)

def change_display_name(username: str, new_display_name: str) -> bool:
    """Update the display name for an existing user."""
    data = load()
    if username not in data:
        return False
    data[username]['display_name'] = new_display_name
    save(data)
    return True

def change_password(username: str, current_password: str, new_password: str) -> bool:
    """Change a user's password. Returns False if username not found or current password wrong."""
    data = load()
    if username not in data:
        return False
    user = data[username]
    hashedPW = hash(current_password, user['salt'])
    if not secrets.compare_digest(hashedPW, user['password_hash']):
        return False
    salt = secrets.token_hex(16)
    data[username]['salt'] = salt
    data[username]['password_hash'] = hash(new_password, salt)
    save(data)
    return True

def delete_user(username: str, password: str) -> bool:
    """Delete a user account after verifying password. Returns False if verification fails."""
    data = load()
    if username not in data:
        return False
    user = data[username]
    hashedPW = hash(password, user['salt'])
    if not secrets.compare_digest(hashedPW, user['password_hash']):
        return False
    del data[username]
    save(data)
    return True
