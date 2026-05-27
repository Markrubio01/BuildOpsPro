'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, getSession, logoutUser } from './auth'

type AuthContextType = {
  session: Session | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get session on mount
    const currentSession = getSession()
    setSession(currentSession)
    setIsLoading(false)
  }, [])

  const logout = () => {
    logoutUser()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
