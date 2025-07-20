import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { cn } from '@ui/common/lib/utils'

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const publicRoutes = ['/login', '/login/success', '/onboarding']

function matchRoute(routes: string[], path: string) {
  return routes.some((route) => match(route, { end: true })(path))
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const authenticated = context.auth.authenticated
    const pathname = location.pathname

    // 인증되지 않은 사용자는 퍼블릭 경로만 접근 가능
    if (!authenticated && !matchRoute(publicRoutes, pathname)) {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-09">
      <main className={cn('mx-auto flex h-full w-full max-w-[600px] flex-1 bg-white')}>
        <Outlet />
      </main>
    </div>
  )
}
