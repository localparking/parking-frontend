import { CircleCheck } from 'lucide-react'

interface ProfileInfoDisplayProps {
  label: string
  value: string
  icon?: React.ReactNode
}

export function ProfileInfoDisplay({ label, value, icon }: ProfileInfoDisplayProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-body-5 text-gray-1">{label}</label>
      <div className="flex items-center justify-between rounded-[10px] bg-gray-4 px-3 py-2">
        <span className="text-caption-2">{value}</span>
        {icon || <CircleCheck className="h-6 w-6 text-gray-2" />}
      </div>
    </div>
  )
}
