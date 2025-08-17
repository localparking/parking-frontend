import React from 'react'

interface FilterPanelLayoutProps {
  title: string
  onClose: () => void
  onReset: () => void
  onApply: () => void
  children: React.ReactNode
}

export const FilterPanelLayout: React.FC<FilterPanelLayoutProps> = ({ title, onClose, onReset, onApply, children }) => {
  const handleApply = () => {
    onApply()
    onClose()
  }

  return (
    <div className="flex h-full flex-col gap-3 pb-6">
      <h3 className="w-full text-center text-body-4">{title}</h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      <div className="flex gap-3 bg-white">
        <button
          onClick={onReset}
          className="flex-1 rounded-[10px] bg-gray-200 px-5 py-[9px] text-caption-1 text-gray-600"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-5 rounded-[10px] bg-gray-1 px-5 py-[9px] text-caption-1 text-white"
        >
          적용하기
        </button>
      </div>
    </div>
  )
}
