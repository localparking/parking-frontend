import React from 'react'
import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { cn } from '@ui/common/lib/utils'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

// 이 배열이 모든 리다이렉트 로직의 기준이 됩니다.
const publicRoutes = [
  '/login',
  '/login/success',
  '/onboarding/landing',
  '/onboarding/terms',
  '/onboarding/final-onboarding',
]

// publicRoutes 배열에 현재 경로가 포함되는지 확인하는 헬퍼 함수
function isPublicRoute(pathname: string) {
  // 온보딩 경로는 하위 경로도 허용할 수 있으므로 startsWith를 사용하는 것이 더 안전할 수 있습니다.
  // 여기서는 정의된 그대로 매칭하기 위해 match 함수를 사용합니다.
  return publicRoutes.some((route) => match(route, { end: true })(pathname))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const { authenticated, user, loading } = context.auth
    const pathname = location.pathname

    // 0. 인증 정보 로딩 중에는 아무 작업도 하지 않음
    if (loading) {
      return
    }

    const isOnPublicRoute = isPublicRoute(pathname)

    // 1. 인증된 사용자 (로그인 완료)
    if (authenticated && user) {
      // 온보딩 미완료
      if (user.isOnboarding === false) {
        // 1-2. 약관동의 미완료(게스트) 유저는 온보딩 플로우로 강제
        if (user.role === 'GUEST' && pathname !== '/onboarding/terms') {
          throw redirect({ to: '/onboarding/terms' })
        }
        // 온보딩 미완료 && 약관동의 완료(유저) && 현재 파이널온보딩이 아닌 경우만 리다이렉트
        if (user.role === 'USER' && pathname !== '/onboarding/final-onboarding') {
          throw redirect({ to: '/onboarding/final-onboarding' })
        }
        // 만약 이미 올바른 온보딩 페이지에 있다면, 아무것도 하지 않고 통과 (무한루프 방지)
      }
      // 온보딩 완료
      else if (user.isOnboarding === true) {
        // 1-1. 약관동의/온보딩 완료 유저는 온보딩/약관/로그인 접근 시 홈으로
        if (isOnPublicRoute) {
          throw redirect({ to: '/' })
        }
      }
    }
    // 2. 미인증 사용자 (로그아웃 상태)
    else if (!authenticated) {
      // 2-1. 접근하려는 페이지가 public route가 아니라면 로그인 페이지로 리다이렉트
      if (!isOnPublicRoute) {
        throw redirect({ to: '/login' })
      }
      // 2-2. (선택) 첫 방문자를 무조건 랜딩 페이지로 보내는 로직
      // 이 로직이 필요하다면 여기에 위치시키는 것이 더 안전합니다.
      const hasCompletedLanding =
        typeof window !== 'undefined' ? localStorage.getItem('hasCompletedLanding') === 'true' : false
      if (!hasCompletedLanding && pathname !== '/onboarding/landing') {
        throw redirect({ to: '/onboarding/landing' })
      }
    }

    return
  },
})

function RootComponent() {
  // 화면만 렌더링
  const isOnboarding =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/onboarding/landing') ||
      window.location.pathname.startsWith('/onboarding/terms') ||
      window.location.pathname.startsWith('/onboarding/final-onboarding'))

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-09">
      <main className={cn('mx-auto flex h-full w-full flex-1 bg-white', !isOnboarding && 'max-w-[600px] pb-[86px]')}>
        <Outlet />
      </main>
    </div>
  )
}
