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
import { CheckCircle2, ChevronDown, MapPin, ShoppingCart } from 'lucide-react'
import { StoreCategoryIcon } from '@/shared/ui'
import StatusBadge from '@/shared/ui/status-badge'

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
    const storeDetail = (await storeService.getStoreDetail({ storeId })).data.data
    const parkingLot = storeDetail?.associatedParkingLots?.[0]
    return { storeResponse, storeDetail, parkingLot }
  },
})

// --- 메인 컴포넌트 ---
function RouteComponent() {
  const { storeResponse, storeDetail, parkingLot } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { cart } = useCart()

  if (!storeResponse || !storeDetail) return null

  const cartProducts = useMemo<((typeof storeResponse.products)[number] & { quantity: number })[]>(() => {
    const productsById = new Map(storeResponse.products.map((p) => [p.productId, p]))
    return cart.flatMap((item) => {
      const product = productsById.get(item.productId)
      return product ? [{ ...product, quantity: item.quantity }] : []
    })
  }, [cart, storeResponse])

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <ShoppingCart className="h-18 w-18 text-gray-3" />
        <p>선택한 가게 상품이 없습니다</p>
        <div className="fixed bottom-safe-bottom w-full p-6">
          <Button onClick={() => navigate({ to: '/detail/store', search: { storeId: storeResponse.storeId } })}>
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <DetailHeaderBar
        title={storeResponse.storeName}
        onBackClick={() => {
          navigate({ to: '/detail/store', search: { storeId: storeResponse.storeId } })
        }}
      />

      <section className="mt-[50px] space-y-6 p-6">
        <div className="flex items-center gap-3 rounded-[15px] bg-gray-4 py-3 pr-5 pl-6">
          <StoreCategoryIcon className="h-20 w-20" category={storeDetail.categories?.[0]} />
          <div className="space-y-1">
            <p className="text-caption-2 text-gray-2">{storeDetail.categories?.[0]?.categoryName}</p>
            <div className="flex items-center gap-1">
              <p className="text-body-4">{storeDetail.name}</p>
              <StatusBadge isOpen={storeDetail.isOpen} time={storeDetail.todayClosingTime} />
            </div>
            <div className="flex items-center gap-2 py-[6.5px] text-gray-2">
              <MapPin className="h-4 w-4" />
              <p className="text-caption-2">{storeDetail.address}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-body-4">방문 정보</h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-caption-1 text-gray-2">방문자 정보</p>
              <button className="rounded-[10px] bg-gray-4 px-3 py-2 text-caption-2">방문자 정보를 입력하세요</button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-caption-1 text-gray-2">방문 예정 시간</p>
              <button className="rounded-[10px] bg-gray-4 px-3 py-2 text-caption-2">방문 예정 시간을 입력하세요</button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-caption-1 text-gray-2">차량 번호</p>
              <button className="rounded-[10px] bg-gray-4 px-3 py-2 text-caption-2">차량 번호를 입력하세요</button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-body-4">장바구니</h3>
          {cartProducts.map((product) => (
            <ProductItem key={product.productId} product={product} />
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="text-body-4">받은 혜택보기</h3>

            <div className="flex gap-1">
              <p className="text-caption-1 text-primary-1">{2}시간 무료주차</p>
              <ChevronDown className="h-6 w-6 text-gray-2" />
            </div>
          </div>

          <div className="space-y-1 rounded-[15px] bg-gray-4 py-3 pr-5 pl-6">
            <div className="flex items-center gap-1">
              <h2 className="text-body-4">{parkingLot?.name}</h2>
              <StatusBadge isOpen={parkingLot?.isOpen} />
            </div>
            <div className="flex items-center gap-2 text-gray-2">
              <MapPin className="h-4 w-4" />
              <p className="text-caption-2">{storeDetail?.address}</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-[10px] rounded-[10px] bg-primary-2 px-3 py-2 text-primary-1">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-caption-2">주차비 {formatPrice(20000)}을 아꼈어요!</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-body-4">결제 금액</h3>
          <div className="space-y-2 text-caption-1 text-gray-2">
            <div className="flex justify-between">
              <p>주문 금액</p>
              <p>{formatPrice(cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0))}</p>
            </div>

            <div className="flex justify-between">
              <p>무료 주차 할인 금액</p>
              <p>{formatPrice(0)}</p>
            </div>

            <div className="flex justify-between">
              <p>할인 금액</p>
              <p>{formatPrice(0)}</p>
            </div>

            <div className="flex justify-between text-body-4 text-primary-1">
              <p>총 결제 금액</p>
              <p>{formatPrice(cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0))}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full p-6">
        <Button onClick={() => navigate({ to: '/map' })}>결제하기</Button>
      </div>
    </div>
  )
}
