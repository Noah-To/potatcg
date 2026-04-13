import { createContext, useMemo, useState } from 'react'
import { getUser, setUser, clearUser } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser())

  const login = (username) => {
    setUser(username)
    setUserState(username)
  }

  const logout = () => {
    clearUser()
    setUserState(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}