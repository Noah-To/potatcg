# Comment Plan (temporary — delete when done)

---

## backend/app/services/user_service.py

| Location | What needs explaining | What it does |
|---|---|---|
| `_DATA_FILE = ...` | Why the path uses `../..` | Walks up two folders from the services folder to reach the project root, where `users.json` lives |
| `_load()` | What happens if the file doesn't exist yet | Returns an empty dictionary so the first registration works without crashing |
| `_hash(password, salt)` | What PBKDF2 is and why 260000 iterations | Converts a password into a scrambled string; the high iteration count makes brute-force guessing extremely slow |
| `verify()` — `secrets.compare_digest` | Why not just use `==` | Prevents timing attacks — `==` leaks information about how many characters matched; `compare_digest` always takes the same time |
| `get_collection` / `save_collection` | Reads and rewrites the whole file each call | No partial updates — the entire JSON file is read in, changed in memory, then written back out |

---

## backend/app/services/collection_service.py

| Location | What needs explaining | What it does |
|---|---|---|
| `add()` — the `existing` check | Duplicate card handling | If the card is already in the collection, it increases the quantity counter instead of adding a second copy |
| `remove()` — the quantity check | Partial removal logic | If the user has more than 1 copy, decreases the count by 1; only fully removes the card entry when the count reaches 0 |
| `init_user()` — `pass` | Why this function does nothing | Users are already fully set up during registration in `user_service.register`, so no extra setup is needed here |

---

## src/api/config.js

| Location | What needs explaining | What it does |
|---|---|---|
| `const cache = new Map()` | What the cache is for | Stores previous search results in memory so the same search doesn't re-fetch from the server every time |
| `AbortController` + `setTimeout(..., 10000)` | Why there is a timer | If the server takes more than 10 seconds to respond, the request is automatically cancelled |
| `AbortError` catch | Why this specific error is caught separately | Turns the browser's internal cancellation signal into a readable "Request timed out" error message |

---

## src/hooks/useCards.js

| Location | What needs explaining | What it does |
|---|---|---|
| `latestRequestRef` | What this counter tracks | Keeps track of which search request is the most recent one — prevents an old slow result from replacing the results of a newer faster search (called a race condition) |
| `requestId === latestRequestRef.current` (appears 3 times) | Why this check is everywhere | Each check asks: "is this still the search the user wanted, or has a newer one already started?" — if newer, the old result is ignored |

---

## src/pages/BrowsePage.jsx

| Location | What needs explaining | What it does |
|---|---|---|
| `isCompoundSearch` — `useRef` not `useState` | Why `useRef` is used instead of `useState` | Tracks whether the last search was a compound search (set + card name together). Uses `ref` because updating it should not cause the page to re-render |
| `handleSearch()` — the if/else chain | Three different search paths | (1) A set is already selected → search cards in that set only. (2) Words match a set name + card name → compound search. (3) Otherwise → normal global search across all sets and cards |
| `parseCompoundQuery()` — the for loop | How the word-splitting works | Tries splitting the typed words from the front and from the back to find a set name match — this is why the set name and pokemon name can be typed in any order |

---

## src/pages/SignUpPage.jsx

| Location | What needs explaining | What it does |
|---|---|---|
| `PASSWORD_REGEX` | What each part of the pattern means | `(?=.*[A-Z])` = must have uppercase; `(?=.*[0-9])` = must have a number; `(?=.*[^A-Za-z0-9\s])` = must have a symbol; `\S{12,}` = at least 12 characters, no spaces |
| `handleSubmit` — regex check before the server call | Why the password is checked here and not just on the server | Catches weak passwords on the user's device immediately, without needing to contact the server at all |
