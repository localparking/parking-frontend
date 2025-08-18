import { ParkingBenefits } from '@/features/store/detail'
import storeService from '@/shared/services/store.service'
import { DetailHeaderBar } from '@/shared/ui/detail-header-bar'
import { formatPrice } from '@/shared/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Minus, Plus, TrashIcon } from 'lucide-react'
import z from 'zod'

const searchSchema = z.object({
  storeId: z.number().optional(),
})

export const Route = createFileRoute('/detail/store/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ deps }) => {
    const { storeId } = deps.search
    if (!storeId) throw redirect({ to: '/map' })

    const storeResponse = (await storeService.getStoreProducts({ storeId })).data.data

    return storeResponse
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  if (!data) return null

  return (
    <div>
      <DetailHeaderBar title={data.storeName} />
      <section className="space-y-3 p-6">
        <div className="rounded-[15px] bg-gray-4 px-6 py-3">
          <ParkingBenefits benefits={data.benefits} title={`${data.storeName}의 주차 혜택`} className="text-body-4" />
        </div>

        {data.products.map((product) => (
          <div className="flex items-center gap-8 py-1" key={product.productId}>
            <div className="flex-1 space-y-[5px]">
              <h2 className="text-body-4">{product.name}</h2>
              <p className="text-caption-2 break-keep text-gray-2">{product.description}</p>
              <p className="text-caption-1">{formatPrice(product.price)}</p>
            </div>

            <div className="w-[76px] space-y-0.5">
              <div className="relative flex h-15 items-center justify-center rounded-[5px]">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute -right-2 -bottom-2 h-[25px] w-[25px] rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]">
                  <Plus className="h-[25px] w-[25px]" />
                </div>
              </div>
              <div className="flex w-full items-center justify-between rounded-[5px] border border-gray-3 px-1">
                <div className="bg-gray-4">
                  <Minus className="h-4 w-4" />
                  <TrashIcon className="h-4 w-4" />
                </div>
                <p>1</p>
                <div className="bg-gray-4">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
