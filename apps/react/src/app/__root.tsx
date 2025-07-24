import React from 'react'
import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { cn } from '@ui/common/lib/utils'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = [
  '/',
  '/login',
  '/login/success',
  '/onboarding/landing',
  '/onboarding/terms',
  '/onboarding/final-onboarding',
]

function isPublicRoute(pathname: string) {
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
        // 온보딩 미완료 && 약관동의 완료(유저) && 현재 온보딩 페이지가 아닌 경우만 리다이렉트
        if (user.role === 'USER' && pathname !== '/onboarding/final-onboarding') {
          throw redirect({ to: '/onboarding/final-onboarding' })
        }
      }
      // 온보딩 완료
      // (홈 리다이렉트는 온보딩 플로우 내부에서만 처리)
    }
    // 2. 미인증 사용자 (로그아웃 상태)
    else if (!authenticated) {
      // 2-1. 접근하려는 페이지가 public route가 아니라면 홈으로 리다이렉트
      if (!isOnPublicRoute) {
        throw redirect({ to: '/' })
      }
      // 2-2. (설치 후 첫 방문자) 랜딩 페이지로 보내는 로직
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
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const isOnboarding = pathname.startsWith('/onboarding')

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-09">
      <main className={cn('mx-auto flex h-full w-full flex-1 bg-white', !isOnboarding && 'max-w-[600px] pb-[86px]')}>
        <Outlet />
      </main>
    </div>
  )
}
