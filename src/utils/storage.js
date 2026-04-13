const KEY = 'potatcg_user'

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
  } catch {

  }
}