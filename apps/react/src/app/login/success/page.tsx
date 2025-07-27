import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { useEffect } from 'react'
import { saveTokens } from '@/shared/libs/token'
import { useAuth } from '@/features/auth'
import { UserInfoResponseRoleEnum } from '@data/user-api-axios/api'

const searchSchema = z.object({
  role: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
})

export const Route = createFileRoute('/login/success/')({
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

        const user = await auth.refetchUser()

        if (user?.role === UserInfoResponseRoleEnum.Guest) {
          navigate({ to: '/onboarding/terms', replace: true })
        } else {
          navigate({ to: '/map', replace: true })
        }
      } else {
        navigate({ to: '/login', replace: true })
      }
    }
    doLogin()
  }, [accessToken, refreshToken, navigate, auth])

  return <div>정보를 처리중입니다...</div>
}
