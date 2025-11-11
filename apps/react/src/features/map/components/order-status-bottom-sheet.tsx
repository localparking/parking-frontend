import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CircleDollarSign, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { formatPrice } from '@/shared/utils'
import Button from '@/shared/ui/button'
import { ParkingStatusResponseDto } from '@data/user-api-axios/api'
import { cn } from '@/shared/utils'
import StatusBadge from '@/shared/ui/status-badge'
import parkingLotService from '@/shared/services/parking-lot.service'
import { useRouter } from '@tanstack/react-router'

interface OrderStatusBottomSheetProps {
  data: ParkingStatusResponseDto
  onClose: () => void
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return format(date, 'yyyy.MM.dd · p', { locale: ko })
}

const InfoRow = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between text-caption-1">
    <span className="text-gray-2">{label}</span>
    <span className={cn(highlight ? 'text-primary-1' : 'text-gray-1')}>{value}</span>
  </div>
)

const DetailRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 text-caption-2 text-gray-2">
    {icon}
    <span>{text}</span>
  </div>
)

const FeeRow = ({ label, value, price }: { label: string; value?: string; price?: number }) => (
  <div className="flex items-center justify-between">
    <span className="text-caption-1 text-gray-2">{label}</span>
    {value && <span className="text-caption-1 text-gray-1">{value}</span>}
    {price !== undefined && (
      <div className="flex items-center gap-1 rounded-md bg-primary-2 px-2 py-1 text-caption-2 text-primary-1">
        <CircleDollarSign size={14} />
        <span>{formatPrice(price)}</span>
      </div>
    )}
  </div>
)

export const OrderStatusBottomSheet: React.FC<OrderStatusBottomSheetProps> = ({ data, onClose }) => {
  const router = useRouter()
  const [isProcessingDeparture, setIsProcessingDeparture] = useState(false)

  const handleDeparture = async () => {
    if (isProcessingDeparture) return
    setIsProcessingDeparture(true)
    try {
      await parkingLotService.processDeparture({ orderId: data.orderId })
      await router.invalidate({ sync: true })
      onClose()
    } catch (error) {
      console.error('Failed to process departure:', error)
      window.alert('출차 처리에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsProcessingDeparture(false)
    }
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="fixed bottom-0 z-50 mx-auto w-full max-w-[768px] rounded-t-[25px] bg-white py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-gray-3" />
      <button onClick={onClose} className="absolute top-4 right-4">
        <X className="h-6 w-6 text-gray-2" />
      </button>

      <div className="flex flex-col gap-5 p-6 pb-8">
        <div className="space-y-3">
          <InfoRow label="입차시간" value={formatDateTime(data.visitTime)} />
          <InfoRow label="무료 주차 시간" value={`${formatDateTime(data.freeParkingUntil)} 까지`} />
          <InfoRow
            label="추가비용"
            value={data.extraCharge > 0 ? formatPrice(data.extraCharge) : '없음'}
            highlight={data.extraCharge > 0}
          />
        </div>

        <hr className="border-t border-gray-4" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-body-3">{data.parkingLotName}</h3>
            <StatusBadge isOpen={true} />
          </div>
          <DetailRow icon={<Clock size={16} />} text={`${data.parkingLotTodayClosingTime}까지 영업`} />
          <DetailRow icon={<MapPin size={16} />} text={data.parkingLotAddress ?? '-'} />
        </div>

        <hr className="border-t border-gray-4" />

        <div className="space-y-3">
          <h4 className="text-body-4">주차 정보</h4>
          <FeeRow label="기본 무료 회차" value="30분" />
          <FeeRow label={`기본 요금 ${data.baseTimeMin}분`} price={data.baseFee} />
          <FeeRow label={`추가 요금 ${data.additionalTimeMin}분`} price={data.additionalFee} />
        </div>

        <div className="mt-2 flex gap-3">
          <Button className="flex-1 bg-gray-3" onClick={handleDeparture} disabled={isProcessingDeparture}>
            <p className="text-gray-1">{isProcessingDeparture ? '출차 처리 중...' : '출차 처리하기'}</p>
          </Button>
          <Button className="flex-1 bg-gray-1 text-white">입차시간 설정</Button>
        </div>
      </div>
    </motion.div>
  )
}
