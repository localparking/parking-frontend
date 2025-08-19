import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import { TimePicker, TimePickerActions } from './wheel-time-picker'
import { useRef, useState } from 'react'

interface VisitTimeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (visitTime: string) => void
  initialData?: string
  closingTime?: string
}

export function VisitTimeSheet({ isOpen, onOpenChange, onSave, initialData, closingTime }: VisitTimeSheetProps) {
  const { motionKeyboardBottom } = useKeyboardSheetMotion()
  const timePickerRef = useRef<TimePickerActions>(null)
  const [isValid, setIsValid] = useState(false)

  const handleSubmit = () => {
    const picker = timePickerRef.current
    if (!picker || !picker.isValid) {
      alert('선택할 수 없는 시간입니다. 다시 선택해주세요.')
      return
    }
    const isoString = picker.getSelectedTimeAsISO()
    onSave(isoString)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={motionKeyboardBottom}
      >
        <SheetTitle className="sr-only">방문 예정 시간</SheetTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-5 z-20 flex h-6 w-6 items-center justify-center"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex h-full flex-col gap-3 px-6 pt-6">
          <h2 className="text-body-3">방문 예정 시간</h2>
          <div className="space-y-1">
            <TimePicker ref={timePickerRef} initialValue={initialData} closingTime={closingTime} />
          </div>
          <div className="my-5">
            <Button onClick={handleSubmit}>저장하기</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
