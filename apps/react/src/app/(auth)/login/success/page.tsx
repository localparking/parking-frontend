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
  const auth = useAuth()

  useEffect(() => {
    const doLogin = async () => {
      if (accessToken && refreshToken) {
        saveTokens(accessToken, refreshToken)
        console.log(
          '[login/success] 토큰 저장 후 쿠키:',
          Cookies.get('town-accessToken'),
          Cookies.get('town-refreshToken')
        )
        await auth.refetchUser()
        console.log(
          '[login/success] refetchUser 후 쿠키:',
          Cookies.get('town-accessToken'),
          Cookies.get('town-refreshToken')
        )
        if (auth.user) {
          navigate({ to: '/', replace: true })
        } else {
          navigate({ to: '/login', replace: true })
        }
      } else {
        navigate({ to: '/login', replace: true })
      }
    }
    doLogin()
  }, [accessToken, refreshToken, navigate, auth])

  return <div>정보를 처리중입니다...</div>
}
