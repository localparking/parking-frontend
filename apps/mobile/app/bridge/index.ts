import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as Location from 'expo-location'
import { z } from 'zod'
import { BridgeStore, BridgeActions, SocialLoginType, SocialLoginResult, LocationResult } from '@bridge/types'
import { kakaoLogin } from '../features/auth/social/kakao-login'
import { appleLogin } from '../features/auth/social/apple-login'
import { refreshToken } from '../features/auth/token/refresh-token'
import { AuthStorage } from '../features/auth/lib/auth-storage'
import { EdgeInsets } from 'react-native-safe-area-context'

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ get, set }) => {
  const actions: BridgeActions = {
    async socialLogin(type: SocialLoginType): Promise<SocialLoginResult> {
      try {
        let result: SocialLoginResult

        if (type === 'kakao') {
          result = await kakaoLogin()
        } else if (type === 'apple') {
          result = await appleLogin()
        } else {
          return {
            success: false,
            message: '지원하지 않는 소셜 로그인 유형입니다.',
          }
        }

        // 로그인 성공 시 상태 업데이트
        if (result.success) {
          console.log('로그인 성공, 상태 업데이트')
          set({ isLoggedIn: true })
        } else {
          console.log('로그인 실패, 상태 유지')
        }

        console.log('브릿지 socialLogin 액션 결과 반환:', result)
        return result
      } catch (error) {
        console.error('소셜 로그인 오류:', error)
        return {
          success: false,
          message: `소셜 로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    },
    async logout(): Promise<{ success: boolean; message?: string }> {
      try {
        await AuthStorage.clearAuth()
        set({ isLoggedIn: false })
        return { success: true, message: '로그아웃 성공' }
      } catch (error) {
        console.error('로그아웃 오류:', error)
        return {
          success: false,
          message: `로그아웃 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    },

    async getAuthStatus(): Promise<{ isLoggedIn: boolean }> {
      const isLoggedIn = await AuthStorage.isAuthenticated()
      return { isLoggedIn }
    },

    async getAuthToken(): Promise<{ accessToken: string | null }> {
      const accessToken = await AuthStorage.getAccessToken()
      return { accessToken }
    },
    async getCurrentLocation(): Promise<LocationResult> {
      try {
        // 1. 권한 확인 (기존과 동일)
        let { status } = await Location.getForegroundPermissionsAsync()

        if (status !== 'granted') {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
          if (newStatus !== 'granted') {
            // 2. 실패 시, 웹뷰에 '이유'를 알려주며 실패 반환
            console.log('PERMISSION_DENIED')
            return { success: false, data: null }
          }
        }

        // 3. 기기 GPS 활성화 확인 (에러 방지)
        if (!(await Location.hasServicesEnabledAsync())) {
          console.log('SERVICE_DISABLED')
          return { success: false, data: null }
        }

        // 4. 성공 로직
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
        const locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
        }
        return { success: true, data: locationData }
      } catch (error) {
        // 5. 그 외 모든 에러 처리
        console.error('위치 정보 가져오기 실패:', error)
        return { success: false, data: null }
      }
    },

    async notifyTokenExpired(): Promise<{ accessToken: string | null }> {
      const { accessToken } = await refreshToken()
      return { accessToken }
    },
    async setLandingStatus(): Promise<void> {
      await AuthStorage.setLandingStatus()
    },
    async getLandingStatus(): Promise<boolean> {
      const hasCompletedLanding = await AuthStorage.getLandingStatus()
      return hasCompletedLanding
    },
    async setIntent(intent: EdgeInsets): Promise<void> {
      set({ intent })
    },
  }

  return {
    isLoggedIn: false,
    currentLocation: null,
    intent: { top: 0, right: 0, bottom: 0, left: 0 },
    ...actions,
  }
})

export const appSchema = postMessageSchema({
  // 소셜 로그인 스키마
  socialLogin: {
    validate: (value) => {
      console.log('소셜 로그인 스키마 검증:', value)
      return z
        .object({
          type: z.enum(['kakao', 'apple']),
        })
        .parse(value)
    },
  },
  // 인증 상태 스키마
  getAuthStatus: {
    validate: () => {
      return {}
    },
  },
  // 인증 토큰 스키마
  getAuthToken: {
    validate: () => {
      return {}
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
