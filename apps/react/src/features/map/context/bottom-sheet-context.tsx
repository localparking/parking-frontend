import React, { createContext, useState, useContext, ReactNode } from 'react'

interface BottomSheetContextType {
  content: ReactNode
  setContent: (content: ReactNode) => void
  activeSnapIndex: number
  setActiveSnapIndex: React.Dispatch<React.SetStateAction<number>>
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined)

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode>(null)
  const [activeSnapIndex, setActiveSnapIndex] = useState(1) // 기본 중간 스냅

  return (
    <BottomSheetContext.Provider value={{ content, setContent, activeSnapIndex, setActiveSnapIndex }}>
      {children}
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider')
  }
  return context
}
