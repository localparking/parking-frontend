import { useMemo } from 'react'
import { ParkingBenefits } from '@/features/store/detail'
import storeService from '@/shared/services/store.service'
import { DetailHeaderBar } from '@/shared/ui/detail-header-bar'
import { formatPrice } from '@/shared/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import z from 'zod'
import Button from '@/shared/ui/button'
import { ParkingBenefitDto } from '@data/user-api-axios/api'
import { useCart } from '@/features/store/context/cart-context'
import { useOrderModal } from '@/features/store/hook/use-order-hook'
import { ProductItem } from '@/features/store/order/ui/components/product-item'
import { ShoppingCart } from 'lucide-react'

// --- 라우트 및 데이터 로딩 (변경 없음) ---
const searchSchema = z.object({
  storeId: z.number().optional(),
})

export const Route = createFileRoute('/detail/store/order/')({
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
  const navigate = Route.useNavigate()
  const { cart } = useCart()

  if (!data) return null

  const cartProducts = useMemo<((typeof data.products)[number] & { quantity: number })[]>(() => {
    const productsById = new Map(data.products.map((p) => [p.productId, p]))
    return cart.flatMap((item) => {
      const product = productsById.get(item.productId)
      return product ? [{ ...product, quantity: item.quantity }] : []
    })
  }, [cart, data])

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <ShoppingCart className="h-18 w-18 text-gray-3" />
        <p>선택한 가게 상품이 없습니다</p>
        <div className="fixed bottom-safe-bottom w-full p-6">
          <Button onClick={() => navigate({ to: '/detail/store', search: { storeId: data.storeId } })}>돌아가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-[130px]">
      <DetailHeaderBar
        title={data.storeName}
        onBackClick={() => {
          navigate({ to: '/detail/store', search: { storeId: data.storeId } })
        }}
      />

      <section className="mt-[50px] space-y-3 p-6">
        <div className="rounded-[15px] bg-gray-4 py-3 pr-5 pl-6"> 가게 정보 </div>

        <h3 className="text-body-4">방문 정보</h3>
        <div></div>

        {cartProducts.map((product) => (
          <ProductItem product={product} />
        ))}

        <h3 className="text-body-4">받은 혜택보기</h3>
        <div className="rounded-[15px] bg-gray-4 py-3 pr-5 pl-6"> 주차장 정보 </div>

        <h3 className="text-body-4">결제 금액</h3>
        <div className="space-y-2 text-caption-1 text-gray-2">
          <div className="flex justify-between">
            <p>주문 금액</p>
            <p>{formatPrice(cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0))}</p>
          </div>

          <div className="flex justify-between">
            <p>무료 주차 할인 금액</p>
            <p>{}</p>
          </div>

          <div className="flex justify-between">
            <p>할인 금액</p>
            <p>{formatPrice(0)}</p>
          </div>

          <div className="flex justify-between text-body-4 text-primary-1">
            <p>총 결제 금액</p>
            <p>{}</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-safe-bottom w-full p-6">
        <Button onClick={() => navigate({ to: '/map' })}>결제하기</Button>
      </div>
    </div>
  )
}
