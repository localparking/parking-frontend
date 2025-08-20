import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet'
import { Input } from '@/shared/ui/input'
import Button from '@/shared/ui/button'
import { useKeyboardSheetMotion } from '@/shared/hooks/use-keyboard-motion'

interface VisitorInfo {
  name: string
  tel: string
}

interface VisitorInfoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (info: VisitorInfo) => void
  initialData?: VisitorInfo
}

export function VisitorInfoSheet({ isOpen, onOpenChange, onSave, initialData }: VisitorInfoSheetProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [tel, setTel] = useState(initialData?.tel || '')

  const { motionKeyboardBottom } = useKeyboardSheetMotion()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setTel(initialData.tel)
    }
  }, [initialData])

  const handleSubmit = () => {
    // name과 tel만 저장
    onSave({ name, tel })
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
              maxLength={6}
            />
          </div>

          <div className="space-y-1">
            <p className="pb-1 text-body-5">전화번호</p>
            <Input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="01012345678"
              maxLength={11}
            />
          </div>

          <div className="my-5">
            <Button onClick={handleSubmit} disabled={!name.trim() || !tel.trim()}>
              저장하기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
