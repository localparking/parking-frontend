import { LocalSearchItem } from '@/shared/services/search.service'
import { useMapContext } from '../map/context/map-context'
import { useNavigate } from '@tanstack/react-router'

interface SearchResultsProps {
  query: string
  data?: LocalSearchItem[]
  isLoading: boolean
  error: Error | null
}

export const SearchResults = ({ query, data, isLoading, error }: SearchResultsProps) => {
  const { moveTo, setSearchKeyword } = useMapContext()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-2">검색 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <p className="text-red-500">
          오류가 발생했습니다.
          <br />
          {error.message}
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-2">검색 결과가 없습니다.</p>
      </div>
    )
  }

  const handleItemClick = (item: LocalSearchItem) => {
    const mapx = parseInt(item.mapx, 10)
    const mapy = parseInt(item.mapy, 10)

    if (isNaN(mapx) || isNaN(mapy)) {
      console.error('Invalid coordinates:', item)
      return
    }

    const lng = mapx / 10000000
    const lat = mapy / 10000000

    console.log(`Converted Coords: lat=${lat}, lng=${lng}`)

    moveTo({ lat, lng }, 15)
    setSearchKeyword(query)
    navigate({ to: '..', replace: true })
  }

  return (
    <ul className="divide-y divide-gray-08">
      {data.map((item, index) => (
        <li key={index} className="py-4">
          <div onClick={() => handleItemClick(item)} className="cursor-pointer">
            <h3 className="text-body-5 font-semibold text-gray-1">{item.title}</h3>
            <p className="mt-1 text-caption-2 text-gray-2">{item.category}</p>
            <p className="mt-2 text-caption-2 text-gray-3">{item.roadAddress}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
