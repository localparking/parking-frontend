import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import orderService from '@/shared/services/order.service'

const successSearchSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.number(),
})

export const Route = createFileRoute('/payment/success/')({
  component: SuccessPage,
  validateSearch: successSearchSchema,
})

function SuccessPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  useEffect(() => {
    async function newFunction() {
      try {
        const result = await orderService.handlePaymentSuccess({
          paymentKey: search.paymentKey,
          orderId: search.orderId,
          amount: search.amount,
        })
        if (result) {
          navigate({ to: '/payment/result', replace: true, search: { orderId: search.orderId } })
        }
      } catch {
        alert('결제 처리에 실패했습니다.')
      }
    }
    newFunction()
  }, [search])

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <h1 className="text-body-3">결제 처리 중...</h1>
      <p className="text-caption-1 text-gray-2">결과를 앱으로 전송하고 있습니다.</p>
    </div>
  )
}
