import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import bridge from '@/shared/bridge'
import z from 'zod'

const failSearchSchema = z.object({
  code: z.string(),
  message: z.string(),
  orderId: z.string(),
})

export const Route = createFileRoute('/payment/fail/')({
  component: FailPage,
  validateSearch: failSearchSchema,
})

function FailPage() {
  const search = Route.useSearch()

  useEffect(() => {
    // RN 앱으로 실패 결과 전달
    bridge.paymentResult({
      success: false,
      ...search,
    })
  }, [search])

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <h1 className="text-body-3 text-red-500">결제 실패</h1>
      <p className="text-caption-1 text-gray-2">{search.message}</p>
    </div>
  )
}
