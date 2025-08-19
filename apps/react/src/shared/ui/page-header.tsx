import { ArrowLeft } from 'lucide-react'

type MyPageHeaderProps = {
  title: string
  onClick: () => void
}
export function MyPageHeader({ title, onClick }: MyPageHeaderProps) {
  return (
    <div className="relative flex items-center justify-center px-[25px] py-[12px]">
      <button onClick={onClick} className="absolute left-6 cursor-pointer">
        <ArrowLeft className="h-6 w-6 text-gray-2" />
      </button>
      <span className="text-body-4 text-gray-1">{title}</span>
    </div>
  )
}
