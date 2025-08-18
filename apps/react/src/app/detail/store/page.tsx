import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const searchSchema = z.object({
  storeId: z.number().optional(),
})

export const Route = createFileRoute('/detail/store/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
})

function RouteComponent() {
  const search = Route.useSearch()
  return (
    <div>
      <div></div>
    </div>
  )
}
