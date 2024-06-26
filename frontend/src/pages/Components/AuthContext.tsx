import React, { createContext, useState, ReactNode, useContext } from 'react'
import { LoginRequest } from '../../interfaces'

interface AuthContextType {
  isAuthenticated: boolean
  user: LoginRequest | null
  login: (user: LoginRequest) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<LoginRequest | null>(null)

  const login = (user: LoginRequest) => {
    setIsAuthenticated(true)
    setUser(user)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
