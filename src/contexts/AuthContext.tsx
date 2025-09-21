import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentAuthUser, isAuthenticated, logout as authLogout, AuthUser } from '../lib/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const authenticated = await isAuthenticated()
      if (authenticated) {
        const currentUser = await getCurrentAuthUser()
        setUser(currentUser)
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (user: AuthUser) => {
    setUser(user)
    setIsLoggedIn(true)
  }

  const logout = async () => {
    try {
      await authLogout()
      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
