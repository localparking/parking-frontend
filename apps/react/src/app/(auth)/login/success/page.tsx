import { AuthApi } from '@data/user-api-axios/api'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
import z from 'zod'

const searchSchema = z.object({
  role: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
})

const authApi = new AuthApi()

export const Route = createFileRoute('/(auth)/login/success/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    // You can use the search parameters here
    const { search } = deps
    // Perform any necessary data fetching or processing
    return {
      data: search,
    }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()

  // const handleCheckAuth = async () => {
  //   try {
  //     const response = await authApi.refreshAccessToken({
  //       headers: { Authorization: `Bearer ${data.accessToken}` },
  //     })
  //     console.log('Auth Check Response:', response)
  //   } catch (error) {
  //     console.error('Error checking auth:', error)
  //   }
  // }

  console.log('Login Success Data:', data)
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center whitespace-pre-wrap">
      <p>{data.role}</p>
      <p>{data.accessToken}</p>
      <p>{data.refreshToken}</p>
      {/* 
      <Button onClick={handleCheckAuth} className="mt-4">
        인증 확인
      </Button> */}
    </div>
  )
}
