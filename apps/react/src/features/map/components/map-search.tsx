import { SearchIcon, UserRound } from 'lucide-react'
import { useMapContext } from '../context/map-context'
import { Link } from '@tanstack/react-router'

function MapSearch() {
  const { insets, searchKeyword } = useMapContext()

  return (
    <div className="absolute flex w-full gap-[10px] px-[35px]" style={{ top: insets?.top + 10 }}>
      <Link
        className="flex flex-1 items-center gap-[10px] rounded-[30px] border border-white bg-white px-[17px] py-[7px]"
        to="/map/search"
      >
        <SearchIcon className="h-6 w-6" />
        <p className="text-caption-2 text-gray-2">{searchKeyword || '검색어를 입력하세요'}</p>
      </Link>

      <div className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-white">
        <UserRound className="h-6 w-6 text-gray-3" />
      </div>
    </div>
  )
}

export default MapSearch
