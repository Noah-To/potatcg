import json
import os
import hashlib
import secrets

# everytime the app reads or writes the user data, it loads and saves this file.
# simple and easy to manage in small scale, but hardly scalable
_DATA_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'users.json')

# functions that can alter user data, (saving the collection, getting the data etc)
def _load() -> dict:
    if not os.path.exists(_DATA_FILE):
        return {}
    with open(_DATA_FILE, 'r') as f:
        return json.load(f)

def _save(data: dict):
    with open(_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def _hash(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 260000).hex()

def exists(username: str) -> bool:
    return username in _load()

def register(username: str, password: str, display_name: str) -> bool:
    """Create a new user. Returns False if username already taken."""
    data = _load()
    if username in data:
        return False
    salt = secrets.token_hex(16)
    data[username] = {
        'salt': salt,
        'password_hash': _hash(password, salt),
        'display_name': display_name,
        'collection': [],
    }
    _save(data)
    return True

def get_display_name(username: str) -> str:
    """Return display_name, falling back to username for legacy accounts."""
    data = _load()
    return data.get(username, {}).get('display_name', username)

def verify(username: str, password: str) -> bool:
    """Return True if username exists and password is correct."""
    data = _load()
    if username not in data:
        return False
    user = data[username]
    expected = _hash(password, user['salt'])
    return secrets.compare_digest(expected, user['password_hash'])

def get_collection(username: str) -> list:
    return _load().get(username, {}).get('collection', [])

def save_collection(username: str, collection: list):
    data = _load()
    if username in data:
        data[username]['collection'] = collection
        _save(data)

def change_display_name(username: str, new_display_name: str) -> bool:
    """Update the display name for an existing user."""
    data = _load()
    if username not in data:
        return False
    data[username]['display_name'] = new_display_name
    _save(data)
    return True

def change_password(username: str, current_password: str, new_password: str) -> bool:
    """Change a user's password. Returns False if username not found or current password wrong."""
    data = _load()
    if username not in data:
        return False
    user = data[username]
    expected = _hash(current_password, user['salt'])
    if not secrets.compare_digest(expected, user['password_hash']):
        return False
    salt = secrets.token_hex(16)
    data[username]['salt'] = salt
    data[username]['password_hash'] = _hash(new_password, salt)
    _save(data)
    return True

def delete_user(username: str, password: str) -> bool:
    """Delete a user account after verifying password. Returns False if verification fails."""
    data = _load()
    if username not in data:
        return False
    user = data[username]
    expected = _hash(password, user['salt'])
    if not secrets.compare_digest(expected, user['password_hash']):
        return False
    del data[username]
    _save(data)
    return True
