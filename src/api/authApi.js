const BACKEND = 'http://localhost:3001'

export async function loginUser(username) {
  const res = await fetch(`${BACKEND}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return res.json()
}
