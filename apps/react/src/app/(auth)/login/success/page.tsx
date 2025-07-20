import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { saveTokens } from '@/shared/libs/token'
import { authClient, useAuth } from '@/features/auth'

const searchSchema = z.object({
  role: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/login/success/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ deps }) => {
    const { accessToken, refreshToken } = deps.search
    return { accessToken, refreshToken }
  },
})

function RouteComponent() {
  const { accessToken, refreshToken } = Route.useLoaderData()
  const navigate = useNavigate()
  const authClient = useAuth()

  useEffect(() => {
    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken)
      authClient.setAuthenticated(true)

      navigate({ to: '/', replace: true })
    } else {
      navigate({ to: '/login', replace: true })
    }
  }, [accessToken, refreshToken, navigate, authClient])

  return <div>정보를 처리중입니다...</div>
}
