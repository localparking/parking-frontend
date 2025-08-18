import { useState } from 'react'
import { ParkingBenefits } from '@/features/store/detail'
import storeService from '@/shared/services/store.service'
import { DetailHeaderBar } from '@/shared/ui/detail-header-bar'
import { formatPrice } from '@/shared/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import z from 'zod'

interface CartItem {
  productId: number
  quantity: number
}

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

// --- 메인 컴포넌트 ---
function RouteComponent() {
  const data = Route.useLoaderData()
  const [cart, setCart] = useState<CartItem[]>([])

  if (!data) return null

  // 장바구니에서 상품 찾기
  const findItemInCart = (productId: number) => cart.find((item) => item.productId === productId)

  // 장바구니 업데이트 로직
  const handleUpdateCart = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId))
    } else {
      const existingItem = findItemInCart(productId)
      if (existingItem) {
        setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item)))
      } else {
        setCart([...cart, { productId, quantity: newQuantity }])
      }
    }
  }

  return (
    <div className="">
      <DetailHeaderBar title={data.storeName} />
      <section className="mt-[50px] space-y-3 p-6">
        <div className="rounded-[15px] bg-gray-4 px-6 py-3">
          <ParkingBenefits benefits={data.benefits} title={`${data.storeName}의 주차 혜택`} className="text-body-4" />
        </div>

        {data.products.map((product) => {
          const cartItem = findItemInCart(product.productId)
          const quantity = cartItem?.quantity ?? 0

          return (
            <div className="flex items-center gap-2.5 py-1" key={product.productId}>
              <div className="flex-1 space-y-2.5 py-3">
                <h2 className="text-body-4">{product.name}</h2>
                <p className="text-caption-2 break-keep text-gray-2">{product.description}</p>
                <p className="text-caption-1">{formatPrice(product.price)}</p>
              </div>

              <div className="w-24 space-y-2">
                <div className="relative flex h-20 w-24 items-center justify-center rounded-[5px]">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-[5px] object-cover" />

                  {!cartItem && (
                    <button
                      onClick={() => handleUpdateCart(product.productId, 1)}
                      className="absolute right-0 -bottom-4 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]"
                      aria-label={`${product.name} 장바구니에 추가`}
                    >
                      <Plus className="h-4.5 w-4.5 text-gray-2" />
                    </button>
                  )}

                  {cartItem && (
                    <div className="absolute -bottom-6 flex w-full items-center justify-between rounded-[5px] bg-white px-1.5 py-1 shadow-[0_0_4px_rgba(0,0,0,0.25)]">
                      <button
                        onClick={() => handleUpdateCart(product.productId, quantity - 1)}
                        className="flex items-center justify-center text-gray-2"
                        aria-label={`${product.name} 수량 감소 또는 제거`}
                      >
                        {quantity > 1 ? <Minus className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                      <p className="text-body-5 select-none">{quantity}</p>
                      <button
                        onClick={() => handleUpdateCart(product.productId, quantity + 1)}
                        className="flex items-center justify-center text-gray-2"
                        aria-label={`${product.name} 수량 증가`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
