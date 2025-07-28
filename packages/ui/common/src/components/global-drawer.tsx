import * as React from 'react'
import { createContext, useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@ui/common/components/drawer' // 경로에 맞게 수정해주세요
import { useDrawer } from '../hooks/drawer.hook'

// Drawer를 열 때 전달할 옵션 타입
type DrawerOpenOptions = {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}

// Context가 제공할 값들의 타입
interface DrawerContextType {
  isOpen: boolean
  options: DrawerOpenOptions
  open: (options: DrawerOpenOptions) => void
  close: () => void
}

export const DrawerContext = createContext<DrawerContextType | null>(null)

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<DrawerOpenOptions>({})

  const open = (newOptions: DrawerOpenOptions) => {
    setOptions(newOptions)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <DrawerContext.Provider value={{ isOpen, options, open, close }}>
      {children}
      <GlobalDrawer />
    </DrawerContext.Provider>
  )
}

function GlobalDrawer() {
  const context = useDrawer()

  if (!context) {
    return null
  }

  const { isOpen, close, options } = context

  // 사용자가 스와이프하거나 오버레이를 클릭해 닫는 경우에도 상태를 동기화합니다.
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        {(options.title || options.description) && (
          <DrawerHeader>
            {options.title && <DrawerTitle>{options.title}</DrawerTitle>}
            {options.description && <DrawerDescription>{options.description}</DrawerDescription>}
          </DrawerHeader>
        )}
        {options.children}
      </DrawerContent>
    </Drawer>
  )
}
