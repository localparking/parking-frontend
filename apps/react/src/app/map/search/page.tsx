import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SearchIcon, X } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { SearchResults } from '@/features/search/search-results'
import { cn } from '@ui/common/lib/utils'

export const Route = createFileRoute('/map/search/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setSearchKeyword, searchKeyword } = useMapContext()
  const [query, setQuery] = useState(searchKeyword ?? '')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setSearchKeyword(trimmed)
  }

  const clearQuery = () => {
    setQuery('')
    setSearchKeyword('')
  }

  const hasValue = query.trim().length > 0

  return (
    <div className="flex h-full w-full flex-col px-6 pt-[10px]">
      <div className="flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          aria-label="장소 검색"
          className={cn('flex h-12 flex-1 items-center gap-3 rounded-[30px] border-[1.5px] border-gray-3 px-4 py-3')}
        >
          <SearchIcon className="h-6 w-6 text-gray-2" />

          <input
            id="search-input"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            autoFocus
            className="flex-1 text-body-5 placeholder:text-body-5 focus:outline-none"
          />

          {/* 지우기 버튼: 값 있을 때만 노출 */}
          {hasValue && (
            <button
              type="button"
              onClick={clearQuery}
              title="지우기"
              aria-label="입력 내용 지우기"
              className="flex h-9 w-9 items-center justify-center"
            >
              <X className="h-5 w-5 text-gray-3" />
              <span className="sr-only">지우기</span>
            </button>
          )}
        </form>

        {/* 취소 */}
        <Link to=".." onClick={clearQuery} className="text-caption-2 text-gray-3 hover:text-gray-2">
          취소
        </Link>
      </div>

      {/* 검색 결과 */}
      <div className="mt-4 flex-1 overflow-y-scroll scrollbar-hide">
        <SearchResults query={searchKeyword} />
      </div>
    </div>
  )
}
