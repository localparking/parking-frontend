import { OnboardingNavigationButtons } from '@/features/onboarding/components'
import registerService from '@/shared/services/register.service'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  termId: z.string(),
})

export const Route = createFileRoute('/onboarding/terms/detail/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    const termsResponse = await registerService.findTerms()
    const term = termsResponse.data?.terms.find((term) => term.termId.toString() === deps.search.termId)

    return { term }
  },
})

function RouteComponent() {
  const { term } = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="relative h-full py-[130px]">
      <h1 className="mb-8 text-body-3 text-gray-1">{term?.title}</h1>
      <p className="text-caption-2 text-gray-01">{term?.content}</p>

      <div className="absolute bottom-0 mt-auto w-full pt-8">
        <OnboardingNavigationButtons onNext={() => router.history.back()} nextButtonText="뒤로가기" hideSkipButton />
      </div>
    </div>
  )
}
