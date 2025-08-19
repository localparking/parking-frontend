import { X } from 'lucide-react'
import { useState } from 'react'

import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Input } from '@/shared/ui/input'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'

interface VistorInfoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function VistorInfoSheet({ isOpen, onOpenChange, onSuccess }: VistorInfoSheetProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  const handleSubmit = () => {}

  const handleClose = () => {
    setName('')
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] border-none p-0 [&>*:last-child]:hidden"
        style={motionKeyboardBottom}
      >
        <SheetTitle className="sr-only">방문자 정보</SheetTitle>

        <button onClick={handleClose} className="absolute top-4 right-5 z-10 flex h-6 w-6 items-center justify-center">
          <X className="h-6 w-6" />
        </button>

        <div className="flex h-full flex-col gap-3 px-6 pt-6">
          <h2 className="text-body-3">방문자 정보</h2>

          <div className="space-y-1">
            <p className="pb-1 text-body-5">이름</p>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="방문자 이름을 입력해주세요"
              maxLength={10}
            />
          </div>

          <div className="space-y-1">
            <p className="pb-1 text-body-5">전화번호</p>
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="방문자 전화번호를 입력해주세요"
              maxLength={10}
            />
          </div>

          <div className="my-5">
            <Button onClick={handleSubmit} disabled={!name.trim() || !phone.trim()}>
              저장하기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
