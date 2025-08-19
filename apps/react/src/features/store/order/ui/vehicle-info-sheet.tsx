import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Input } from '@/shared/ui/input'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'

interface VehicleInfoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (vehicleNumber: string) => void
  initialData?: string
}

export function VehicleInfoSheet({ isOpen, onOpenChange, onSave, initialData }: VehicleInfoSheetProps) {
  const [vehicleNumber, setVehicleNumber] = useState(initialData || '')
  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  useEffect(() => {
    if (initialData) {
      setVehicleNumber(initialData)
    }
  }, [initialData])

  const handleSubmit = () => {
    onSave(vehicleNumber)
    handleClose()
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
          <h2 className="text-body-3">차량 번호</h2>

          <div className="space-y-1">
            <p className="pb-1 text-body-5">차량 번호</p>
            <Input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="12가 3456"
            />
          </div>

          <div className="my-5">
            <Button onClick={handleSubmit} disabled={!vehicleNumber.trim()}>
              저장하기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
