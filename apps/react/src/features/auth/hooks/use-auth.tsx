import { Skeleton } from '@/shared/ui'
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import AuthClient from '../lib/auth-client'
import type { MyInfoUpdateRequestDto } from '@data/user-api-axios/api'
import { SocialLoginType } from '@bridge/types'
import userService from '@/shared/services/user.service'
import { MyInfoResponseDtoRoleEnum } from '@data/user-api-axios/api'

export interface User {
  email: string
  nickname: string
  role: MyInfoResponseDtoRoleEnum
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
  updateMyInfo: (payload: MyInfoUpdateRequestDto) => Promise<{ success: boolean; message?: string }>
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
        email: data.email,
        nickname: data.nickname,
        role: data.role,
        isOnboarding: data.isOnboarding,
      }
      setUser(user)
      setAuthenticated(true)

      return user
    } catch (error: any) {
      if (error?.message?.includes('Access token not found') || error?.response?.status === 401) {
        clearAuth()
        await AuthClient.logout()
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
    await AuthClient.logout()
    clearAuth()
    return { success: true }
  }, [])

  const updateMyInfo = useCallback(
    async (payload: MyInfoUpdateRequestDto) => {
      try {
        await userService.updateMyProfile(payload)
        await refetchUser()
        return { success: true }
      } catch (e: any) {
        return { success: false, message: e?.message || '프로필 업데이트에 실패했습니다.' }
      }
    },
    [refetchUser]
  )

  useEffect(() => {
    const checkAuthStatus = async () => {
      const result = await AuthClient.getAuth()
      if (result?.authenticated) await refetchUser()
      else clearAuth()

      setLoading(false)
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
        updateMyInfo,
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
