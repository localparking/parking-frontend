import { useState } from 'react'
import { createFileRoute, useNavigate, Navigate, useLoaderData } from '@tanstack/react-router'
import { DetailHeaderBar } from '@/shared/ui/detail-header-bar'
import { formatPrice } from '@/shared/utils'
import Button from '@/shared/ui/button'
import { CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { StoreCategoryIcon } from '@/shared/ui'
import StatusBadge from '@/shared/ui/status-badge'
import { cn } from '@ui/common/lib/utils'
import z from 'zod'
import orderService from '@/shared/services/order.service'

const searchSchema = z.object({
  orderId: z.string(),
})

export const Route = createFileRoute('/payment/result/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: (search) => search,
  loader: async ({ deps }) => {
    const order = await orderService.getPaidOrderDetail({ orderId: deps.search.orderId })

    return { orderData: order.data.data }
  },
})

function RouteComponent() {
  const { orderData } = Route.useLoaderData()
  const navigate = useNavigate()

  if (!orderData) {
    return <Navigate to="/map" />
  }

  const { storeInfo, parkingLotInfo, totalPrice, parkingFeeDiscount, parkingDiscountMin } = orderData

  return (
    <div className="">
      <DetailHeaderBar title={'결제 완료'} left={null} />

      <section className="mt-[50px] space-y-6 p-6">
        <p className="text-body-3">결제 완료</p>
        <div className="flex items-center gap-3 rounded-[15px] bg-gray-4 py-3 pr-5 pl-6">
          <div className="w-full space-y-1">
            <p className="text-caption-2">결제가 완료되었어요</p>
            <p className="text-body-5">
              결제일시 :{' '}
              {(() => {
                const d = new Date(orderData.createdAt)
                const y = d.getFullYear()
                const m = String(d.getMonth() + 1).padStart(2, '0')
                const day = String(d.getDate()).padStart(2, '0')
                let h = d.getHours()
                const period = h >= 12 ? '오후' : '오전'
                if (h === 0) h = 12
                else if (h > 12) h -= 12
                const hh = String(h).padStart(2, '0')
                const mm = String(d.getMinutes()).padStart(2, '0')
                return `${y}년 ${m}월 ${day}일 ${period} ${hh}:${mm}`
              })()}
            </p>
            <div className="w-full rounded-[10px] bg-gray-2 px-3 py-1.5 text-white">
              <p className="text-caption-2">결제번호: {orderData.orderId}</p>
            </div>
          </div>
        </div>

        <p className="text-body-3">매장 정보</p>
        <div className="flex items-center gap-3 rounded-[15px] bg-gray-4 py-3 pr-5 pl-6">
          <StoreCategoryIcon className="h-20 w-20" category={storeInfo.category} />
          <div className="space-y-1">
            <p className="text-caption-2 text-gray-2">{storeInfo.storeName}</p>
            <div className="flex items-center gap-1">
              <p className="text-body-4">{storeInfo.storeName}</p>
              <StatusBadge isOpen={true} time={storeInfo.storeTodayClosingTime} />
            </div>
            <div className="flex items-center gap-2 py-[6.5px] text-gray-2">
              <MapPin className="h-4 w-4" />
              <p className="text-caption-2">{storeInfo.storeAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex cursor-pointer justify-between">
            <h3 className="text-body-3">받은 혜택보기</h3>
            <div className="flex items-center gap-1">
              <p className="text-caption-1 text-primary-1">
                {parkingDiscountMin > 0 ? `${parkingDiscountMin}분 무료주차` : '혜택 없음'}
              </p>
            </div>
          </div>
          <div className={'grid transition-all duration-500 ease-in-out'}>
            <div className="overflow-hidden">
              <div className="space-y-3 pt-2">
                <div className="space-y-1 rounded-[15px] bg-gray-4 py-3 pr-5 pl-6">
                  <div className="flex items-center gap-1">
                    <h2 className="text-body-4">{parkingLotInfo.parkingLotName}</h2>
                    <StatusBadge isOpen={true} />
                  </div>
                  <div className="flex items-center gap-2 text-gray-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-caption-2">{parkingLotInfo.parkingLotAddress}</p>
                  </div>
                </div>
                {parkingFeeDiscount > 0 && (
                  <div className="flex w-full items-center gap-[10px] rounded-[10px] bg-primary-2 px-3 py-2 text-primary-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-caption-2">주차비 {formatPrice(parkingFeeDiscount)}을 아꼈어요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-body-4">결제 금액</h3>
          <div className="space-y-2 text-caption-1 text-gray-2">
            <div className="flex justify-between">
              <p>주문 금액</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>

            <div className="flex justify-between">
              <p>주차 금액</p>
              <p className="line-through">{formatPrice(parkingFeeDiscount)}</p>
            </div>
            <div className="flex justify-between">
              <p>무료 주차 할인</p>
              <p className="text-primary-1">{formatPrice(-parkingFeeDiscount)}</p>
            </div>

            <div className="flex justify-between text-body-4 text-primary-1">
              <p>총 결제 금액</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="p-6">
        <Button onClick={() => navigate({ to: '/map' })}>지도로 돌아가기</Button>
      </div>
    </div>
  )
}
