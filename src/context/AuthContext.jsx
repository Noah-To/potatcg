import { createContext, useMemo, useState } from 'react'
import { getUser, setUser, clearUser, getDisplayName, setDisplayName } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser())
  const [displayName, setDisplayNameState] = useState(() => {
    const stored = getDisplayName()
    // fallback for legacy sessions that have no display name stored
    return stored || getUser()
  })

  const login = (username, name) => {
    setUser(username)
    setUserState(username)
    const display = name || username
    setDisplayName(display)
    setDisplayNameState(display)
  }

  const logout = () => {
    clearUser()
    setUserState(null)
    setDisplayNameState(null)
  }

  const updateDisplayName = (name) => {
    setDisplayName(name)
    setDisplayNameState(name)
  }

  const value = useMemo(
    () => ({ user, displayName, login, logout, updateDisplayName }),
    [user, displayName]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}