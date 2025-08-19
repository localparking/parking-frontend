import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Input } from '@/shared/ui/input'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'

export interface VehicleInfo {
  vehicleNumber: string
  regionName: string
}

interface VehicleInfoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (info: VehicleInfo) => void
  initialData?: VehicleInfo
}

export function VehicleInfoSheet({ isOpen, onOpenChange, onSave, initialData }: VehicleInfoSheetProps) {
  const [vehicleNumber, setVehicleNumber] = useState(initialData?.vehicleNumber || '')
  const [regionName, setRegionName] = useState(initialData?.regionName || '')
  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  useEffect(() => {
    setVehicleNumber(initialData?.vehicleNumber || '')
    setRegionName(initialData?.regionName || '')
  }, [initialData])

  const handleSubmit = () => {
    onSave({ vehicleNumber, regionName })
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={motionKeyboardBottom}
      >
        <SheetTitle className="sr-only">차량 정보</SheetTitle>

        <button onClick={handleClose} className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center">
          <X className="h-6 w-6" />
        </button>

        <div className="flex h-full flex-col gap-3 px-6 pt-6">
          <h2 className="text-body-3">차량 정보</h2>

          {/* 지역명 입력 필드 추가 */}
          <div className="space-y-1">
            <p className="pb-1 text-body-5">지역명</p>
            <Input
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="서울"
              maxLength={2}
            />
          </div>

          <div className="space-y-1">
            <p className="pb-1 text-body-5">차량 번호</p>
            <Input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="12가3456"
              maxLength={8}
            />
          </div>

          <div className="my-5">
            {/* 저장 버튼 유효성 검사 수정 */}
            <Button onClick={handleSubmit} disabled={!vehicleNumber.trim() || !regionName.trim()}>
              저장하기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
