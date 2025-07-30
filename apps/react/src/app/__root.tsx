import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { isWebView } from '@/shared/utils/webview'
import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const restrictRoute = ['/onboarding/terms', '/onboarding/final-onboarding']

function isRestrictedRoute(pathname: string) {
  return restrictRoute.some((route) => match(route, { end: true })(pathname))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const { authenticated, user, loading } = context.auth
    const pathname = location.pathname

    if (loading) {
      return
    }

    const onRestricted = isRestrictedRoute(pathname)

    // 1. 인증된 사용자 (로그인 완료)
    if (authenticated && user) {
      // 1-2. 약관동의 미완료(게스트) 유저는 온보딩 플로우로 강제
      if (user.role === 'GUEST' && !pathname.startsWith('/onboarding/terms')) {
        throw redirect({ to: '/onboarding/terms' })
      }
      // 온보딩 미완료 && 약관동의 완료(유저) && 현재 온보딩 페이지가 아닌 경우만 리다이렉트
      if (user.role === 'USER' && !user.isOnboarding && pathname !== '/onboarding/final-onboarding') {
        throw redirect({ to: '/onboarding/final-onboarding' })
      }
    }

    // 2. 미인증 사용자 (로그아웃 상태)
    else if (!authenticated || !user) {
      // 2-1. 접근하려는 페이지가 접근 불가능한 페이지인 경우 리다이렉트
      if (onRestricted) throw redirect({ to: '/map' })

      // 2-2. (설치 후 첫 방문자) 랜딩 페이지로 보내는 로직
      const hasCompletedLanding = isWebView()
        ? await bridge.getLandingStatus()
        : localStorage.getItem('hasCompletedLanding')

      if (!hasCompletedLanding && pathname !== '/onboarding/landing') throw redirect({ to: '/onboarding/landing' })
    }

    return
  },
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isMapPage = pathname === '/map'

  const insets = useBridge(bridge.store, (state) => state.intent)

  const mainStyle = isMapPage
    ? {}
    : {
        paddingTop: `${insets?.top ?? 0}px`,
        paddingBottom: `${insets?.bottom ?? 0}px`,
      }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="mx-auto flex h-full w-full max-w-[600px] flex-1 bg-white" style={mainStyle}>
        <Outlet />
      </main>
    </div>
  )
}
