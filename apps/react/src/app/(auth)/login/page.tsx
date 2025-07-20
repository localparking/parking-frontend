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

  const handleAppleLogin = async () => {
    try {
      const result = await auth.socialLogin('apple')

      if (result.success) {
        // 로그인 성공 후 다음 단계로 이동하기 위한 브릿지 메시지
        const message = {
          type: 'onLoginSuccess' as const,
          data: {
            isLoggedIn: true,
          },
        }
        handleWebViewMessage(message)
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
          // 로그인 성공 후 다음 단계로 이동하기 위한 브릿지 메시지
          const message = {
            type: 'onLoginSuccess' as const,
            data: {
              isLoggedIn: true,
            },
          }
          handleWebViewMessage(message)
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

  return (
    <LoginScreen
      onNext={() => navigate({ to: '/', replace: true })}
      onKakaoLogin={handleKakaoLogin}
      onAppleLogin={handleAppleLogin}
      onGuestStart={() => navigate({ to: '/', replace: true })}
      showAppleLogin={isWebView()}
    />
  )
}
