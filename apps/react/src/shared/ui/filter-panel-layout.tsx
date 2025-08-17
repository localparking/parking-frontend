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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1" />
        <h3 className="flex-1 text-center text-base font-semibold whitespace-nowrap text-gray-900">{title}</h3>
        <div className="flex flex-1 justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      <div className="flex gap-3 border-t border-gray-100 bg-white p-4">
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
