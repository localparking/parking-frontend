import { AuthContext } from '@/features/auth/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { match } from 'path-to-regexp'
import { cn } from '@/lib/utils'

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

    if (!authenticated && !matchRoute(publicRoutes, pathname)) {
      return redirect({ to: '/login' })
    }

    if (authenticated && pathname === '/login') {
      return redirect({ to: '/' })
    }
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
