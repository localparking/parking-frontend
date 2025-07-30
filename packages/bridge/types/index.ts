// 소셜 로그인 타입
export type SocialLoginType = 'kakao' | 'apple'

// 소셜 로그인 결과 타입
export interface SocialLoginResult {
  success: boolean
  message?: string
}

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

export interface LocationResult {
  success: boolean
  data: LocationData | null
}

export interface EdgeInsets {
  top: number
  right: number
  bottom: number
  left: number
}

// 브릿지 스토어 타입 (상태)
export interface BridgeStore {
  isLoggedIn: boolean
  currentLocation: LocationData | null
  intent: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

// 브릿지 액션 타입 (함수)
export interface BridgeActions {
  socialLogin(type: SocialLoginType): Promise<SocialLoginResult>
  getAuthStatus(): Promise<{ isLoggedIn: boolean }>
  getAuthToken(): Promise<{ accessToken: string | null }>
  logout(): Promise<{ success: boolean; message?: string }>
  getCurrentLocation(): Promise<LocationResult>
  notifyTokenExpired(): Promise<{ accessToken: string | null }>
  setLandingStatus(): Promise<void>
  getLandingStatus(): Promise<boolean>
  setIntent(intent: EdgeInsets): Promise<void>
}
