import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'
import { useTimePicker } from '../../hook/use-wheel-picker'
import { TimePicker } from './wheel-time-picker'

interface VisitTimeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (visitTime: string) => void
  initialData?: string
}

export function VisitTimeSheet({ isOpen, onOpenChange, onSave, initialData }: VisitTimeSheetProps) {
  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  // TimePicker의 내부 상태를 직접 제어하기 위해 Hook을 사용
  const { actions, state } = useTimePicker(initialData)

  const handleSubmit = () => {
    const isoString = actions.getSelectedTimeAsISO()
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
            {/* TimePicker 컴포넌트에 필요한 값을 전달합니다. */}
            <TimePicker initialValue={initialData} onSave={onSave} />
          </div>

          <div className="my-5">
            <Button onClick={handleSubmit}>저장하기</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
