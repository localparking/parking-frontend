import { useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk'
import Button from '@/shared/ui/button' // Button 경로 수정
import z from 'zod'

const searchSchema = z.object({
  orderId: z.string(),
  orderName: z.string(),
  amount: z.number(),
  customerEmail: z.string().optional(),
  customerName: z.string().optional().nullable(),
})

export const Route = createFileRoute('/payment/')({
  component: PaymentPage,
  validateSearch: searchSchema,
})

// .env 파일에 VITE_TOSS_PAYMENTS_CLIENT_KEY를 추가하세요.
const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY

function PaymentPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)

  useEffect(() => {
    if (!clientKey) {
      console.error('Toss Payments Client Key가 설정되지 않았습니다.')
      return
    }

    const fetchPaymentWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, search.customerEmail || 'ANONYMOUS')

        paymentWidget.renderPaymentMethods('#payment-widget', { value: search.amount }, { variantKey: 'DEFAULT' })
        paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })
        paymentWidgetRef.current = paymentWidget
      } catch (error) {
        console.error('결제 위젯을 불러오는 데 실패했습니다:', error)
      }
    }
    fetchPaymentWidget()
  }, [search])

  const handlePaymentRequest = async () => {
    const paymentWidget = paymentWidgetRef.current
    try {
      if (paymentWidget) {
        await paymentWidget.requestPayment({
          orderId: search.orderId,
          orderName: search.orderName,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
          customerEmail: search.customerEmail,
          customerName: search.customerName ?? 'ANONYMOUS',
        })
      }
    } catch (error) {
      console.error('결제 요청에 실패했습니다:', error)
    }
  }

  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="mb-4 text-body-3">주문 확인 및 결제</h1>
      <div className="flex-1">
        <div id="payment-widget" />
        <div id="agreement" />
      </div>
      <div className="mt-auto">
        <Button onClick={handlePaymentRequest}>{`${search.amount.toLocaleString()}원 결제하기`}</Button>
      </div>
    </div>
  )
}
