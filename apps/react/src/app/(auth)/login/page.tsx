const { VITE_API_URL } = import.meta.env

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { isWebView } from '@/shared/utils/webview'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import { useAuth } from '@/features/auth'
import { LoginScreen } from '@/features/onboarding/components/steps/login-screen'
import { useNativeMessageHandler } from '@/shared/hooks'

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { open } = useAlertDialog()
  const { handleWebViewMessage } = useNativeMessageHandler()

  const handleLoginSuccess = async () => {
    localStorage.setItem('hasCompletedLanding', 'true')
    const user = await auth.refetchUser()
    if (user?.role === 'GUEST') {
      navigate({ to: '/onboarding/terms', replace: true })
    } else {
      navigate({ to: '/', replace: true })
    }
  }

  const handleAppleLogin = async () => {
    try {
      const result = await auth.socialLogin('apple')

      if (result.success) {
        await handleLoginSuccess()
      }
    } catch (error: any) {
      open({
        title: '애플 로그인 실패',
        description: error?.message || '애플 로그인에 실패했습니다.',
      })
    }
  }

  const handleKakaoLogin = async () => {
    try {
      if (isWebView()) {
        // 네이티브 브릿지를 통한 카카오 로그인
        const result = await auth.socialLogin('kakao')

        if (result.success) {
          await handleLoginSuccess()
        }
      } else {
        window.location.href = `${VITE_API_URL}/oauth2/authorization/kakao`
      }
    } catch (error: any) {
      open({
        title: '카카오 로그인 실패',
        description: error?.message || '카카오 로그인에 실패했습니다.',
      })
    }
  }

  const handleGuestStart = () => {
    // 게스트 시작 시에도 hasCompletedLanding 설정
    localStorage.setItem('hasCompletedLanding', 'true')
    navigate({ to: '/', replace: true })
  }

  return (
    <LoginScreen
      onNext={() => navigate({ to: '/', replace: true })}
      onKakaoLogin={handleKakaoLogin}
      onAppleLogin={handleAppleLogin}
      onGuestStart={handleGuestStart}
    />
  )
}
