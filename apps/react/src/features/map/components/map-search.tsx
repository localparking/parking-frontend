import { SearchIcon, UserRound } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { Link } from '@tanstack/react-router'

function MapSearchInputBox() {
  const { searchKeyword } = useMapContext()

  return (
    <div className="absolute top-[calc(var(--spacing-safe-top)+10px)] flex w-full gap-[10px] px-[35px]">
      <Link
        className="flex flex-1 items-center gap-[10px] rounded-[30px] border border-white bg-white px-[17px] py-[7px]"
        to="/map/search"
      >
        <SearchIcon className="h-6 w-6 text-gray-2" />
        <p className="text-body-5 text-gray-2">{searchKeyword || '검색어를 입력하세요'}</p>
      </Link>

      <Link className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white" to="/login">
        <UserRound className="h-[30px] w-[30px] text-gray-3" />
      </Link>
    </div>
  )
}

export default MapSearchInputBox
