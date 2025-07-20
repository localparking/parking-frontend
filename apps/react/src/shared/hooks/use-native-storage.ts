import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'

const STORAGE_KEYS = {
  HAS_COMPLETED_LANDING: 'hasCompletedLanding',
  HAS_AGREED_TO_TERMS: 'hasAgreedToTerms',
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
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
    // localStorage에서 직접 읽어서 최신 상태 확인
    const hasCompletedLanding = NativeStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_LANDING) === 'true'
    const hasAgreedToTerms = NativeStorage.getItem(STORAGE_KEYS.HAS_AGREED_TO_TERMS) === 'true'
    const hasCompletedOnboarding = NativeStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING) === 'true'

    if (!hasCompletedLanding) {
      return '/onboarding/landing'
    } else if (!hasAgreedToTerms) {
      return '/onboarding/terms'
    } else if (!hasCompletedOnboarding) {
      return '/onboarding/final-onboarding'
    } else {
      // 온보딩이 완료된 경우 로그인 상태와 관계없이 메인 화면으로
      return null // 메인 화면 (로그인 여부와 관계없이)
    }
  }, []) // storageState 의존성 제거

  // 상태 업데이트 함수들
  const setHasCompletedLanding = useCallback((value: boolean) => {
    NativeStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_LANDING, value.toString())
  }, [])

  const setHasAgreedToTerms = useCallback((value: boolean) => {
    NativeStorage.setItem(STORAGE_KEYS.HAS_AGREED_TO_TERMS, value.toString())
  }, [])

  const setHasCompletedOnboarding = useCallback((value: boolean) => {
    NativeStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, value.toString())
  }, [])

  // 모든 상태 초기화 (테스트용)
  const clearAllStorage = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      NativeStorage.removeItem(key)
    })
  }, [])

  return {
    determineInitialRoute,
    setHasCompletedLanding,
    setHasAgreedToTerms,
    setHasCompletedOnboarding,
    clearAllStorage,
  }
}
