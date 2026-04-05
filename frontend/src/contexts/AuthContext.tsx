import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, getToken, setToken, removeToken } from '@/lib/api'

interface User {
  id: string
  email: string
  username: string
  streak: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get<User>('/auth/me')
      .then(setUser)
      .catch(() => removeToken())
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (email: string, username: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/register', {
      email,
      username,
      password,
    })
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    removeToken()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
