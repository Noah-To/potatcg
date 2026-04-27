import { BACKEND } from './config'

export async function registerUser(username, password) {
  const res = await fetch(`${BACKEND}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Registration failed: ${res.status}`)
  }
  return res.json()
}

export async function loginUser(username, password) {
  const res = await fetch(`${BACKEND}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Login failed: ${res.status}`)
  }
  return res.json()
}
