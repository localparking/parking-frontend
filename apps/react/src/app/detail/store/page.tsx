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
import { cn } from '@ui/common/lib/utils'

// --- 라우트 및 데이터 로딩 (변경 없음) ---
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
  const navigate = Route.useNavigate()
  const { cart } = useCart()
  const { backAlertModal } = useOrderModal()

  if (!data) return null

  // --- 이 페이지에서만 사용하는 파생 데이터 계산 로직 ---
  const { totalQuantity, totalPrice, parkingBenefitInfo } = useMemo(() => {
    const productsById = new Map(data.products.map((p) => [p.productId, p]))
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPr = cart.reduce((sum, item) => {
      const product = productsById.get(item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    const sortedBenefits = [...data.benefits].sort((a, b) => a.purchaseAmount - b.purchaseAmount)
    let currentBenefit: ParkingBenefitDto | null = null
    let nextBenefit: ParkingBenefitDto | null = null
    let remainingForNext = 0

    for (const benefit of sortedBenefits) {
      if (totalPr >= benefit.purchaseAmount) {
        currentBenefit = benefit
      } else {
        nextBenefit = benefit
        break
      }
    }

    if (nextBenefit) {
      remainingForNext = nextBenefit.purchaseAmount - totalPr
    }

    return {
      totalQuantity: totalQty,
      totalPrice: totalPr,
      parkingBenefitInfo: {
        currentBenefit,
        nextBenefit,
        remainingForNext,
      },
    }
  }, [cart, data.products, data.benefits])

  const isEmpty = cart.length === 0

  return (
    <div className={cn({ 'pb-[130px]': cart.length > 0 })}>
      <DetailHeaderBar
        title={data.storeName}
        onBackClick={() => {
          if (isEmpty) {
            navigate({ to: '/map' })
          } else {
            backAlertModal({ storeId: data.storeId.toString() })
          }
        }}
      />

      <section className="mt-[50px] space-y-3 overflow-y-scroll p-6">
        <div className="rounded-[15px] bg-gray-4 px-6 py-3">
          <ParkingBenefits benefits={data.benefits} title={`${data.storeName}의 주차 혜택`} className="text-body-4" />
        </div>

        {data.products.map((product) => (
          <ProductItem key={product.productId} product={product} />
        ))}
      </section>

      {cart.length > 0 && (
        <div className="fixed bottom-0 flex w-full max-w-[768px] flex-col rounded-t-[25px] bg-primary-2">
          <div className="px-6 pt-2.5">
            {parkingBenefitInfo.nextBenefit && parkingBenefitInfo.remainingForNext > 0 && (
              <div className="mb-0.5 w-fit rounded-[15px] bg-white px-2 py-1">
                <p className="text-caption-3 text-gray-2">
                  {`다음 혜택까지 ${formatPrice(parkingBenefitInfo.remainingForNext)} 남았습니다.`}
                </p>
              </div>
            )}
            {parkingBenefitInfo.currentBenefit && (
              <p className="text-caption-1 text-primary-1">
                {`총 ${parkingBenefitInfo.currentBenefit.discountMin / 60}시간 무료주차 혜택 적용`}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-t-[25px] bg-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black">
                <p className="text-caption-2 text-white">{totalQuantity}</p>
              </div>
              <p className="text-caption-2">{`총 ${totalQuantity}개가 담겼어요!`}</p>
            </div>

            <Button
              className="w-fit"
              onClick={() => navigate({ to: '/detail/store/order', search: { storeId: data.storeId } })}
            >
              <p className="text-caption-2">{`${formatPrice(totalPrice)} 결제하기`}</p>
            </Button>
          </div>
          <div className="h-safe-bottom w-full bg-white" />
        </div>
      )}
    </div>
  )
}
