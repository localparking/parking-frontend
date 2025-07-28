import { use } from 'react'
import { DrawerContext } from '@ui/common/components/global-drawer'

// Context를 쉽게 사용하기 위한 Custom Hook
export function useDrawer() {
  const context = use(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}
