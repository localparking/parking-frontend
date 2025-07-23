import { Skeleton } from '@ui/common/components/skeleton'
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import AuthClient from '../lib/auth-client'
import { SocialLoginType } from '@bridge/types'
import userService from '@/shared/services/user.service'
import { isWebView } from '@/shared/utils/webview'

export interface User {
  id: string
  name: string
  onboardingStatus: 'before' | 'completed'
  role: string
  isOnboarding: boolean
}

export interface AuthContext {
  authenticated: boolean
  user: User | null
  setAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  loading: boolean
  socialLogin: (type: SocialLoginType) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<{ success: boolean; message?: string }>
  refetchUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const clearAuth = () => {
    setAuthenticated(false)
    setUser(null)
  }

  const refetchUser = useCallback(async () => {
    try {
      const userInfo = await userService.me()
      const data = userInfo?.data
      if (!data) throw new Error('No user data')
      const user: User = {
        id: data.email,
        name: data.nickname,
        onboardingStatus: data.isOnboarding ? 'completed' : 'before',
        role: data.role,
        isOnboarding: data.isOnboarding,
      }
      setUser(user)
      setAuthenticated(true)
      return user
    } catch (error: any) {
      if (error?.message?.includes('Access token not found') || error?.response?.status === 401) {
        clearAuth()
        if (isWebView()) {
          try {
            await AuthClient.logout()
          } catch {}
        }
      } else {
        clearAuth()
      }
      return null
    }
  }, [])

  const socialLogin = useCallback(
    async (type: SocialLoginType) => {
      try {
        const result = await AuthClient.socialLogin(type)
        if (result.success) {
          await refetchUser()
        }
        return result
      } catch (e: any) {
        throw e
      }
    },
    [refetchUser]
  )

  const logout = useCallback(async () => {
    try {
      await AuthClient.logout()
      clearAuth()
      return { success: true }
    } catch (e: any) {
      throw e
    }
  }, [])

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await AuthClient.getAuth()
        if (result?.authenticated) {
          await refetchUser()
        } else {
          clearAuth()
        }
      } catch (error: any) {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }
    checkAuthStatus()
  }, [refetchUser])

  if (loading) return <Skeleton />

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        loading,
        socialLogin,
        logout,
        refetchUser,
        setAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
