import { createFileRoute, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { useEffect } from 'react'
import { saveTokens } from '@/shared/libs/token'
import { useAuth } from '@/features/auth'
import { MyInfoResponseDtoRoleEnum } from '@data/user-api-axios/api'
import { Skeleton } from '@/shared/ui'

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

        if (user?.role === MyInfoResponseDtoRoleEnum.Guest) {
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

  return (
    <div className="flex h-full min-h-[calc(100dvh-60px)] flex-col items-center justify-center gap-8 bg-white px-6 py-10">
      <div className="flex flex-col items-center gap-4 text-center" role="status" aria-live="polite">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <p className="text-body-4 text-gray-2">로그인 정보를 확인하고 있어요...</p>
      </div>

      <div className="flex w-full max-w-[360px] flex-col gap-3" aria-hidden>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
