const { VITE_API_URL } = import.meta.env

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { isWebView } from '@/shared/utils/webview'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import { useAuth } from '@/features/auth'

import MainLogoImage from '@/assets/images/logo.png'
import KakaoLogoIcon from '@/assets/icons/kakao-logo.svg'
import AppleLogoIcon from '@/assets/icons/apple-logo.svg'
import Button from '@/shared/ui/button'

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
    <div className="flex w-full flex-1 flex-col bg-white px-6 pt-[170px] pb-6">
      <div className="flex flex-1 flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-body-1">
            가장 가까운 <span className="text-primary-1">무료주차 혜택</span>,
            <br />
            지금 찾아볼까요?
          </h1>
        </div>

        <div className="mb-16">
          <img src={MainLogoImage} alt="메인 로고 3D 이미지" className="h-[200px] w-[200px] object-contain" />
        </div>
      </div>

      <div className="mb-3 flex w-full flex-col gap-2">
        <Button onClick={handleKakaoLogin} className="bg-[#FFE600]">
          <KakaoLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
          <p className="text-gray-1">카카오로 시작하기</p>
        </Button>

        {isWebView() && (
          <Button onClick={handleAppleLogin} className="bg-gray-1">
            <AppleLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
            애플로 시작하기
          </Button>
        )}
      </div>

      <Button
        onClick={() => navigate({ to: '/map', replace: true })}
        className="bg-transparent underline decoration-gray-3 underline-offset-4"
      >
        <p className="text-caption-2 text-gray-2">로그인 없이 시작하기</p>
      </Button>
    </div>
  )
}
