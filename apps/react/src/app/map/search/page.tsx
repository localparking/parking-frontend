import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SearchIcon, X } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { SearchResults } from '@/features/search/search-results'
import { cn } from '@/shared/utils'

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
    <div className="absolute inset-0 z-20 flex flex-col bg-white px-6 pt-safe-top pb-safe-bottom">
      <div className="fixed top-0 h-safe-top w-full bg-white" />
      <div className="flex items-center gap-3 pt-[10px]">
        <form
          onSubmit={handleSearch}
          aria-label="장소 검색"
          className={cn(
            'relative flex h-12 w-full items-center gap-3 rounded-[30px] border-[1.5px] border-gray-3 px-4 py-3'
          )}
        >
          <SearchIcon className="h-6 w-6 text-gray-2" />

          <input
            id="search-input"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            autoFocus
            className="w-full flex-1 pr-8 text-body-5 placeholder:text-body-5 focus:outline-none"
          />

          {hasValue && (
            <button
              type="button"
              onClick={clearQuery}
              title="지우기"
              aria-label="입력 내용 지우기"
              className="absolute top-1/2 right-4 flex h-9 w-9 -translate-y-1/2 items-center justify-center"
            >
              <X className="h-5 w-5 text-gray-3" />
              <span className="sr-only">지우기</span>
            </button>
          )}
        </form>

        <Link to=".." onClick={clearQuery}>
          <p className="text-caption-1 whitespace-nowrap text-gray-3 hover:text-gray-2">취소</p>
        </Link>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide">
        <SearchResults query={searchKeyword} />
      </div>
    </div>
  )
}
