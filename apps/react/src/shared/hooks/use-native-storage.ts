import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'

const STORAGE_KEYS = {
  HAS_COMPLETED_LANDING: 'hasCompletedLanding',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const

const NativeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Storage setItem error:', error)
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage removeItem error:', error)
    }
  },
}

export const useNativeStorage = () => {
  // 초기 경로 결정
  const determineInitialRoute = useCallback((): string | null => {
    const hasCompletedLanding = NativeStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_LANDING) === 'true'
    if (!hasCompletedLanding) {
      return '/onboarding/landing'
    }
    return null
  }, [])

  // 상태 업데이트 함수들
  const setHasCompletedLanding = useCallback((value: boolean) => {
    NativeStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_LANDING, value.toString())
  }, [])

  return {
    determineInitialRoute,
    setHasCompletedLanding,
  }
}
