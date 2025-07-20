import React from 'react'
import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { cn } from '@ui/common/lib/utils'
import { useNativeStorage } from '@/shared/hooks'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = [
  '/login',
  '/login/success',
  '/onboarding/landing',
  '/onboarding/terms',
  '/onboarding/final-onboarding',
]

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route, { end: true })(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const authenticated = context.auth.authenticated
    const pathname = location.pathname

    // 최초 실행 사용자 체크 (상위 조건)
    const hasCompletedLanding = localStorage.getItem('hasCompletedLanding') === 'true'

    // 최초 실행 사용자는 랜딩 페이지로 리다이렉트
    if (!hasCompletedLanding && pathname !== '/onboarding/landing') {
      return redirect({ to: '/onboarding/landing' })
    }

    // 랜딩 완료 후 인증되지 않은 사용자는 퍼블릭 경로만 접근 가능
    if (hasCompletedLanding && !authenticated && !matchRoute(publicRoutes, pathname)) {
      return redirect({ to: '/login' })
    }

    // 인증된 사용자가 로그인 페이지로 접근하면 홈으로 리다이렉트
    if (authenticated && pathname === '/login') {
      return redirect({ to: '/' })
    }
  },
})

function RootComponent() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const { determineInitialRoute } = useNativeStorage()
  const isOnboarding =
    pathname.startsWith('/onboarding/landing') ||
    pathname.startsWith('/onboarding/terms') ||
    pathname.startsWith('/onboarding/final-onboarding')

  // 초기 경로 결정을 한 번만 실행하기 위한 ref
  const hasInitialized = React.useRef(false)

  // 온보딩 완료 후 메인 화면으로 이동 처리
  React.useEffect(() => {
    // 이미 초기화되었거나 온보딩 경로에 있는 경우 실행하지 않음
    if (hasInitialized.current || isOnboarding) {
      return
    }

    // 루트 경로에서만 초기 경로 결정 실행
    if (pathname === '/') {
      const initialRoute = determineInitialRoute()

      if (initialRoute && initialRoute !== '/') {
        hasInitialized.current = true
        window.location.href = initialRoute
      } else if (initialRoute === null) {
        hasInitialized.current = true
        // 온보딩이 완료된 경우 메인 화면 유지
      }
    }
  }, [pathname, determineInitialRoute, isOnboarding])

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-09">
      <main className={cn('mx-auto flex h-full w-full flex-1 bg-white', !isOnboarding && 'max-w-[600px] pb-[86px]')}>
        <Outlet />
      </main>
    </div>
  )
}
