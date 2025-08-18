import { useMemo, useState } from 'react'
import { ParkingBenefits } from '@/features/store/detail'
import storeService from '@/shared/services/store.service'
import { DetailHeaderBar } from '@/shared/ui/detail-header-bar'
import { formatPrice } from '@/shared/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import z from 'zod'
import Button from '@/shared/ui/button'
import { ParkingBenefitDto } from '@data/user-api-axios/api'

// --- 타입 정의 ---
interface CartItem {
  productId: number
  quantity: number
}

// --- 라우트 및 데이터 로딩 ---
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

  // --- 장바구니 계산 로직 ---
  const { totalQuantity, totalPrice, parkingBenefitInfo } = useMemo(() => {
    const productsById = new Map(data.products.map((p) => [p.productId, p]))
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPr = cart.reduce((sum, item) => {
      const product = productsById.get(item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    // 주차 혜택 계산
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

  // --- 핸들러 함수 ---
  const findItemInCart = (productId: number) => cart.find((item) => item.productId === productId)
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
    <div className="pb-[130px]">
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

              <div className="w-24 flex-shrink-0 space-y-2">
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

      {/* --- 하단 장바구니 정보 UI --- */}
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

            <Button className="w-fit">
              <p className="text-caption-2">{`${formatPrice(totalPrice)} 결제하기`}</p>
            </Button>
          </div>
          <div className="h-safe-bottom w-full bg-white" />
        </div>
      )}
    </div>
  )
}
