import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as Location from 'expo-location'
import { z } from 'zod'
import { BridgeStore, BridgeActions, SocialLoginType, SocialLoginResult, LocationData } from '@bridge/types'
import { kakaoLogin } from '../features/auth/social/kakao-login'
import { appleLogin } from '../features/auth/social/apple-login'
import { AuthStorage } from '../features/auth/lib/auth-storage'

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ set }) => {
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
    async getCurrentLocation() {
      try {
        // 권한 확인
        const { status } = await Location.getForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.warn('위치 권한이 없습니다.')
          return null
        }

        // 현재 위치 가져오기
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 0,
        })

        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
        }

        // 브릿지 상태에 저장
        set({ currentLocation: locationData })

        console.log('네이티브에서 위치 정보 획득:', locationData)
        return locationData
      } catch (error) {
        console.error('네이티브 위치 정보 가져오기 실패:', error)
        return null
      }
    },
    async requestLocationPermission() {
      try {
        let { status } = await Location.getForegroundPermissionsAsync()

        if (status !== 'granted') {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
          status = newStatus
        }

        return status === 'granted'
      } catch (error) {
        console.error('위치 권한 요청 실패:', error)
        return false
      }
    },
  }

  return {
    isLoggedIn: false,
    currentLocation: null,
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
