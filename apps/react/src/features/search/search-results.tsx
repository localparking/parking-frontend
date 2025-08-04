import { SearchItemResponse } from '@data/user-api-axios/api'
import { useMapContext } from '../map/context/map-context'
import { useNavigate } from '@tanstack/react-router'

interface SearchResultsProps {
  query: string
  data?: SearchItemResponse[]
  isLoading: boolean
  error: Error | null
}

export const SearchResults = ({ query, data, isLoading, error }: SearchResultsProps) => {
  const { naverMap, setSearchKeyword } = useMapContext()
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

  const handleItemClick = (item: SearchItemResponse) => {
    const lng = item.lon / 10000000
    const lat = item.lat / 10000000

    naverMap.moveTo({ lat, lng }, 15)
    setSearchKeyword(query)
    navigate({ to: '..', replace: true })
  }

  return (
    <ul className="divide-y divide-gray-08">
      {data.map((item, index) => (
        <div onClick={() => handleItemClick(item)} className="cursor-pointer">
          <li key={index} className="py-4">
            <h3 className="text-body-5 font-semibold text-gray-1">{item.title}</h3>
            <p className="mt-2 text-caption-2 text-gray-3">{item.roadAddress}</p>
          </li>
        </div>
      ))}
    </ul>
  )
}
