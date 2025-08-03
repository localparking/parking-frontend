const { VITE_API_URL } = import.meta.env

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { isWebView } from '@/shared/utils/webview'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import { useAuth } from '@/features/auth'

import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'
import KakaoLogoIcon from '@ui/common/assets/icons/kakao-logo.svg'
import AppleLogoIcon from '@ui/common/assets/icons/apple-logo.svg'
import { Button } from '@ui/common/components/button'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { open } = useAlertDialog()

  const handleAppleLogin = async () => {
    try {
      const result = await auth.socialLogin('apple')

      if (result.success) {
        const user = await auth.refetchUser()
        if (user?.role === 'GUEST') {
          navigate({ to: '/onboarding/terms', replace: true })
        } else {
          navigate({ to: '/map', replace: true })
        }
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
        const result = await auth.socialLogin('kakao')

        if (result.success) {
          const user = await auth.refetchUser()
          if (user?.role === 'GUEST') {
            navigate({ to: '/onboarding/terms', replace: true })
          } else {
            navigate({ to: '/map', replace: true })
          }
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
    <div className="flex w-full flex-1 flex-col bg-white px-[34px]">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-body-1 text-gray-1">
            가장 가까운 <span className="text-primary">무료주차 혜택</span>,
            <br />
            지금 찾아볼까요?
          </h1>
        </div>

        <div className="mb-16">
          <img src={MainLogoImage} alt="메인 로고 3D 이미지" className="h-[200px] w-[200px] object-contain" />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 pb-8">
        <Button
          onClick={handleKakaoLogin}
          className="relative flex h-[39px] w-full items-center justify-center gap-2 rounded-[10px] bg-kakao text-caption-1 text-gray-1 transition-all duration-150 active:scale-[0.98] active:bg-[#FFE600]"
        >
          <KakaoLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
          카카오로 시작하기
        </Button>

        {isWebView() && (
          <Button
            onClick={handleAppleLogin}
            className="relative flex h-[39px] w-full items-center justify-center gap-2 rounded-[10px] bg-gray-1 text-caption-1 text-white transition-all duration-150 active:scale-[0.98] active:bg-[#111111]"
          >
            <AppleLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
            애플로 시작하기
          </Button>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate({ to: '/map', replace: true })}
            className="text-caption-2 text-gray-2 underline decoration-gray-3 decoration-[0.7px] underline-offset-2"
          >
            로그인 없이 시작하기
          </button>
        </div>
      </div>
    </div>
  )
}
