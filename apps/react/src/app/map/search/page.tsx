import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SearchIcon, X } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { SearchResults } from '@/features/search/search-results'

export const Route = createFileRoute('/map/search/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setSearchKeyword, searchKeyword } = useMapContext()

  const [query, setQuery] = useState(searchKeyword)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearchKeyword(query)
  }

  const clearQuery = () => {
    setQuery('')
    setSearchKeyword('')
  }

  return (
    <div className="flex h-full w-full flex-col pt-[10px]">
      {/* 검색창 */}
      <div className="flex items-center gap-[10px] px-[35px]">
        <form onSubmit={handleSearch} className="relative flex-1">
          <SearchIcon className="absolute top-1/2 left-[17px] h-6 w-6 -translate-y-1/2 text-gray-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            autoFocus
            className="h-[39px] w-full rounded-[30px] border border-gray-3 bg-white pr-[40px] pl-[50px] text-caption-1 text-gray-1 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={clearQuery} className="absolute top-1/2 right-[17px] -translate-y-1/2">
              <X className="h-5 w-5 text-gray-3" />
            </button>
          )}
        </form>
        <Link to=".." onClick={clearQuery}>
          <p className="text-caption-2 text-gray-3">취소</p>
        </Link>
      </div>

      {/* 검색 결과 */}
      <div className="mt-4 flex-1 overflow-y-auto px-[35px]">
        <SearchResults query={searchKeyword} />
      </div>
    </div>
  )
}
