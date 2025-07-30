import { useMapContext } from '@/features/map/context/map-context'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SearchIcon, X } from 'lucide-react'

export const Route = createFileRoute('/map/search/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center gap-[10px] px-[35px] pt-[10px]">
        <div className="flex flex-1 items-center gap-[10px] rounded-[30px] border border-gray-3 bg-white px-[17px] py-[7px]">
          <SearchIcon className="h-6 w-6" />
          <p className="text-caption-2 text-gray-2">검색어를 입력하세요</p>
        </div>

        <Link to="..">
          <p className="text-caption-2 text-gray-3">취소</p>
        </Link>
      </div>

      <div></div>

      <div className="flex flex-col gap-3 pr-[35px] pl-[49px]">
        <p className="text-end text-caption-2 text-gray-3">전체삭제</p>

        <div className="flex items-center justify-between">
          <p className="text-caption-2 text-gray-1">검색기록1</p>
          <div className="flex items-center gap-2">
            <p className="text-caption-2">YYYY-MM-DD</p>
            <X className="text-gray2 h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-caption-2 text-gray-1">검색기록1</p>
          <div className="flex items-center gap-2">
            <p className="text-caption-2">YYYY-MM-DD</p>
            <X className="text-gray2 h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-caption-2 text-gray-1">검색기록1</p>
          <div className="flex items-center gap-2">
            <p className="text-caption-2">YYYY-MM-DD</p>
            <X className="text-gray2 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
