const KEY = 'potatcg_user'
const DISPLAY_KEY = 'potatcg_display'

export function getUser() {
  try {
    const value = localStorage.getItem(KEY)
    return value ? value : null
  } catch {
    return null
  }
}

export function setUser(username) {
  try {
    localStorage.setItem(KEY, username)
  } catch {

  }
}

export function clearUser() {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(DISPLAY_KEY)
  } catch {

  }
}

export function getDisplayName() {
  try {
    return localStorage.getItem(DISPLAY_KEY) || null
  } catch {
    return null
  }
}

export function setDisplayName(name) {
  try {
    localStorage.setItem(DISPLAY_KEY, name)
  } catch {

  }
}