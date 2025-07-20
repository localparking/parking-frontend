import { useCallback } from 'react'
import { useNativeStorage } from './use-native-storage'
import { WebViewMessage } from '../bridge/types'
import { useAuth } from '@/features/auth'

export const useNativeMessageHandler = () => {
  const { setHasCompletedLanding, setHasAgreedToTerms, setHasCompletedOnboarding } = useNativeStorage()
  const { setAuthenticated } = useAuth()

  const handleWebViewMessage = useCallback(
    async (message: WebViewMessage) => {
      const { type, data } = message

      switch (type) {
        case 'onLandingComplete':
          setHasCompletedLanding(true)

          setTimeout(() => {
            window.location.href = '/login'
          }, 100)
          break

        case 'onLoginSuccess':
          setAuthenticated(true)

          setTimeout(() => {
            window.location.href = '/onboarding/terms'
          }, 100)
          break

        case 'onTermsAgreed':
          setHasAgreedToTerms(true)

          setTimeout(() => {
            window.location.href = '/onboarding/final-onboarding'
          }, 100)
          break

        case 'onOnboardingComplete':
          setHasCompletedOnboarding(true)

          setTimeout(() => {
            window.location.href = '/'
          }, 100)
          break

        case 'navigate':
          // WebView를 지정된 경로로 이동
          if (data?.route) {
            window.location.href = data.route
          }
          break

        default:
          console.warn('알 수 없는 메시지 타입:', type)
      }
    },
    [setHasCompletedLanding, setHasAgreedToTerms, setHasCompletedOnboarding, setAuthenticated]
  )

  return {
    handleWebViewMessage,
  }
}
