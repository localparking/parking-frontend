import { createFileRoute } from '@tanstack/react-router'
import { useNativeStorage } from '@/shared/hooks'
import { useAuth } from '@/features/auth'
import bridge from '@/shared/bridge'
import { useState, useEffect } from 'react'
import { isWebView } from '@/shared/utils/webview'
import Cookies from 'js-cookie'

export const Route = createFileRoute('/debug/')({
  component: DebugPage,
})

function DebugPage() {
  const { clearAllStorage, determineInitialRoute } = useNativeStorage()
  const { setAuthenticated } = useAuth()
  const [tokenState, setTokenState] = useState<{
    accessToken: string | null
    refreshToken: string | null
    isLoading: boolean
  }>({
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  })

  // 토큰 상태 조회
  useEffect(() => {
    const fetchTokenState = async () => {
      try {
        console.log('🔍 디버그: 토큰 조회 시작')

        let accessToken: string | null = null
        let refreshToken: string | null = null

        if (isWebView()) {
          // WebView 환경: 네이티브 브릿지에서 조회
          console.log('🔍 디버그: WebView 환경에서 네이티브 브릿지 호출')
          const result = await bridge.getAuthToken()
          console.log('🔍 디버그: 브릿지 getAuthToken 결과:', result)
          accessToken = result.accessToken
          refreshToken = result.refreshToken
        } else {
          // 웹 환경: 쿠키에서 조회
          console.log('🔍 디버그: 웹 환경에서 쿠키 조회')
          accessToken = Cookies.get('town-accessToken') || null
          refreshToken = Cookies.get('town-refreshToken') || null
          console.log('🔍 디버그: 쿠키에서 조회한 토큰:', { accessToken: !!accessToken, refreshToken: !!refreshToken })
        }

        setTokenState({
          accessToken,
          refreshToken,
          isLoading: false,
        })

        console.log('🔍 디버그: 토큰 상태 설정 완료:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          accessTokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length,
        })
      } catch (error) {
        console.error('🔍 디버그: 토큰 조회 실패:', error)
        setTokenState({
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        })
      }
    }

    fetchTokenState()
  }, [])

  // 토큰 새로고침 함수
  const refreshTokenState = async () => {
    setTokenState((prev) => ({ ...prev, isLoading: true }))
    try {
      console.log('🔍 디버그: 토큰 새로고침 시작')

      let accessToken: string | null = null
      let refreshToken: string | null = null

      if (isWebView()) {
        // WebView 환경: 네이티브 브릿지에서 조회
        console.log('🔍 디버그: WebView 환경에서 네이티브 브릿지 새로고침')
        const result = await bridge.getAuthToken()
        console.log('🔍 디버그: 브릿지 getAuthToken 새로고침 결과:', result)
        accessToken = result.accessToken
        refreshToken = result.refreshToken
      } else {
        // 웹 환경: 쿠키에서 조회
        console.log('🔍 디버그: 웹 환경에서 쿠키 새로고침')
        accessToken = Cookies.get('town-accessToken') || null
        refreshToken = Cookies.get('town-refreshToken') || null
        console.log('🔍 디버그: 쿠키에서 새로고침한 토큰:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
        })
      }

      setTokenState({
        accessToken,
        refreshToken,
        isLoading: false,
      })

      console.log('🔍 디버그: 토큰 새로고침 완료:', {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length,
        refreshTokenLength: refreshToken?.length,
      })
    } catch (error) {
      console.error('🔍 디버그: 토큰 새로고침 실패:', error)
      setTokenState({
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      })
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">네이티브 상태 디버그</h1>

      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">현재 상태:</h2>
          <div className="rounded bg-gray-100 p-4">
            <pre className="text-sm">localStorage에서 직접 읽어서 표시 (storageState 제거됨)</pre>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">토큰 상태:</h2>
          <div className="rounded bg-yellow-100 p-4">
            {tokenState.isLoading ? (
              <div className="text-sm">토큰 조회 중...</div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Access Token:</strong>{' '}
                  {tokenState.accessToken ? (
                    <span className="text-green-600">✅ 있음 ({tokenState.accessToken.substring(0, 20)}...)</span>
                  ) : (
                    <span className="text-red-600">❌ 없음</span>
                  )}
                </div>
                <div className="text-sm">
                  <strong>Refresh Token:</strong>{' '}
                  {tokenState.refreshToken ? (
                    <span className="text-green-600">✅ 있음 ({tokenState.refreshToken.substring(0, 20)}...)</span>
                  ) : (
                    <span className="text-red-600">❌ 없음</span>
                  )}
                </div>
                <button
                  onClick={refreshTokenState}
                  className="mt-2 rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                >
                  토큰 상태 새로고침
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">초기 경로:</h2>
          <div className="rounded bg-blue-100 p-4">
            <div className="mb-2">
              <strong>현재 상태 기반:</strong>{' '}
              {(() => {
                const hasCompletedLanding = localStorage.getItem('hasCompletedLanding') === 'true'
                const hasAgreedToTerms = localStorage.getItem('hasAgreedToTerms') === 'true'
                const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true'

                if (!hasCompletedLanding) return '/onboarding/landing (최초 실행 사용자)'
                if (!hasAgreedToTerms) return '/onboarding/terms (약관 미동의)'
                if (!hasCompletedOnboarding) return '/onboarding/final-onboarding (온보딩 미완료)'
                return '메인 화면 (온보딩 완료)'
              })()}
            </div>
            <div>
              <strong>함수 결과:</strong> {determineInitialRoute() || '메인 화면 (온보딩 완료)'}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">테스트:</h2>
          <div className="space-y-2">
            <button
              onClick={async () => {
                try {
                  if (isWebView()) {
                    // WebView 환경: 네이티브 로그아웃 실행
                    await bridge.logout()
                    console.log('✅ 네이티브 로그아웃 완료')
                  } else {
                    // 웹 환경: 쿠키 삭제
                    Cookies.remove('town-accessToken')
                    Cookies.remove('town-refreshToken')
                    console.log('✅ 웹 환경 쿠키 삭제 완료')
                  }
                } catch (error) {
                  console.warn('⚠️ 로그아웃 실패:', error)
                }

                // WebView 인증 상태 초기화
                setAuthenticated(false)

                // 모든 상태 초기화
                clearAllStorage()

                // 토큰 상태 새로고침
                await refreshTokenState()

                console.log('✅ 모든 상태 초기화 완료')
                alert('모든 상태가 초기화되었습니다.')
              }}
              className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              모든 상태 초기화 + 로그아웃 (최초 실행 상태로)
            </button>
            <button
              onClick={async () => {
                try {
                  if (isWebView()) {
                    // WebView 환경: 네이티브 로그아웃 실행
                    await bridge.logout()
                    console.log('✅ 네이티브 로그아웃 완료')
                  } else {
                    // 웹 환경: 쿠키 삭제
                    Cookies.remove('town-accessToken')
                    Cookies.remove('town-refreshToken')
                    console.log('✅ 웹 환경 쿠키 삭제 완료')
                  }
                } catch (error) {
                  console.warn('⚠️ 로그아웃 실패:', error)
                }

                // WebView 인증 상태 초기화
                setAuthenticated(false)

                localStorage.setItem('hasCompletedLanding', 'true')

                // 토큰 상태 새로고침
                await refreshTokenState()

                window.location.reload()
              }}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              랜딩 완료 상태로 설정 + 로그아웃
            </button>
            <button
              onClick={async () => {
                try {
                  if (isWebView()) {
                    // WebView 환경: 네이티브 로그아웃 실행
                    await bridge.logout()
                    console.log('✅ 네이티브 로그아웃 완료')
                  } else {
                    // 웹 환경: 쿠키 삭제
                    Cookies.remove('town-accessToken')
                    Cookies.remove('town-refreshToken')
                    console.log('✅ 웹 환경 쿠키 삭제 완료')
                  }
                } catch (error) {
                  console.warn('⚠️ 로그아웃 실패:', error)
                }

                // WebView 인증 상태 초기화
                setAuthenticated(false)

                localStorage.setItem('hasCompletedLanding', 'true')
                localStorage.setItem('hasAgreedToTerms', 'true')

                // 토큰 상태 새로고침
                await refreshTokenState()

                window.location.reload()
              }}
              className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              약관 동의 완료 상태로 설정 + 로그아웃
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">플로우 테스트:</h2>
          <div className="space-y-2">
            <a
              href="/onboarding/landing"
              className="block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
            >
              랜딩 페이지 테스트
            </a>
            <a href="/login" className="block rounded bg-green-500 px-4 py-2 text-center text-white hover:bg-green-600">
              로그인 페이지 테스트
            </a>
            <a
              href="/onboarding/terms"
              className="block rounded bg-yellow-500 px-4 py-2 text-center text-white hover:bg-yellow-600"
            >
              약관 동의 페이지 테스트
            </a>
            <a
              href="/onboarding/final-onboarding"
              className="block rounded bg-purple-500 px-4 py-2 text-center text-white hover:bg-purple-600"
            >
              최종 온보딩 페이지 테스트
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
