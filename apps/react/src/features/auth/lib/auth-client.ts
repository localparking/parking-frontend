import bridge from '@/shared/bridge'
import userService from '@/shared/services/user.service'
import { isWebView } from '@/shared/utils/webview'
import { SocialLoginType } from '@bridge/types'
import Cookies from 'js-cookie'

// 인증 관련 기능을 제공하는 클라이언트
class AuthClient {
  // 현재 인증 상태를 확인
  async getAuth() {
    try {
      // 웹뷰 환경인지 확인
      if (isWebView()) {
        // 네이티브에서 인증 상태 가져오기
        const { isLoggedIn } = await bridge.getAuthStatus()

        if (isLoggedIn) {
          // 네이티브에서 토큰 가져오기
          const { accessToken } = await bridge.getAuthToken()
          return { authenticated: !!accessToken, accessToken }
        }
      } else {
        const accessToken = Cookies.get('town-accessToken')
        return { authenticated: !!accessToken, accessToken }
      }
    } catch {
      return { authenticated: false }
    }
  }

  async logout() {
    if (isWebView()) {
      try {
        const result = await bridge.logout()
        if (!result.success) {
          throw new Error(result.message || '로그아웃에 실패했습니다.')
        }
        return result
      } catch (error) {
        throw error
      }
    } else {
      Cookies.remove('town-accessToken', { path: '/' })
      // Cookies.remove('town-refreshToken', { path: '/' })
      return { success: true, message: '로그아웃 성공' }
    }
  }

  // 소셜 로그인 처리
  async socialLogin(type: SocialLoginType) {
    if (isWebView()) {
      try {
        // 네이티브 소셜 로그인 사용
        const result = await bridge.socialLogin(type)

        if (!result.success) {
          throw new Error(result.message || '소셜 로그인에 실패했습니다.')
        }

        return result
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('웹 환경에서는 소셜 로그인이 지원되지 않습니다.')
    }
  }
}

export default new AuthClient()
