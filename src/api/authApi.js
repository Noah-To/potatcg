import { BACKEND } from './config'

export async function registerUser(username, password, displayName) {
  const res = await fetch(`${BACKEND}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, display_name: displayName }),
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

export async function changeDisplayName(username, newDisplayName) {
  const res = await fetch(`${BACKEND}/account/display_name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, new_display_name: newDisplayName }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to change display name: ${res.status}`)
  }
  return res.json()
}

export async function changePassword(username, currentPassword, newPassword) {
  const res = await fetch(`${BACKEND}/account/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, current_password: currentPassword, new_password: newPassword }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to change password: ${res.status}`)
  }
  return res.json()
}

export async function deleteAccount(username, password) {
  const res = await fetch(`${BACKEND}/account`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to delete account: ${res.status}`)
  }
  return res.json()
}
