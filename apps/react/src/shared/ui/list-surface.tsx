import React, { createContext, useContext, useState, ReactNode } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { InfiniteListView } from './infinite-list-view'

// 1. Context 생성
interface ListSurfaceContextValue {
  isFilterOpen: boolean
  openFilter: () => void
  closeFilter: () => void
  queryResult: UseInfiniteQueryResult<any>
}

const ListSurfaceContext = createContext<ListSurfaceContextValue | null>(null)
const useListSurface = () => {
  const context = useContext(ListSurfaceContext)
  if (!context) throw new Error('useListSurface must be used within a ListSurface provider')
  return context
}

interface HeaderChildProps {
  onFilterIconClick?: () => void
  onRefresh?: () => void
}

interface PanelChildProps {
  onClose?: () => void
}

// 2. Compound Components 정의
type ListSurfaceComposition = {
  Header: React.FC<{ children: React.ReactElement<HeaderChildProps> }>
  Panel: React.FC<{ children: React.ReactElement<PanelChildProps> }>
  Content: React.FC<{
    renderItem: (item: any) => React.ReactNode
    getKey: (item: any) => string | number
    emptyMessage: string
    loadingMessage: string
    errorMessage: string
  }>
}

// 3. 메인 Provider 컴포넌트
interface ListSurfaceProps {
  useDataQuery: () => UseInfiniteQueryResult<any>
  children: ReactNode
}

export const ListSurface: React.FC<ListSurfaceProps> & ListSurfaceComposition = ({ useDataQuery, children }) => {
  const [isFilterOpen, setFilterOpen] = useState(false)
  const queryResult = useDataQuery()

  return (
    <ListSurfaceContext.Provider
      value={{
        isFilterOpen,
        openFilter: () => setFilterOpen(true),
        closeFilter: () => setFilterOpen(false),
        queryResult,
      }}
    >
      <div className="flex h-full flex-col gap-6 px-6">{children}</div>
    </ListSurfaceContext.Provider>
  )
}

// 4. Header 컴포넌트
ListSurface.Header = ({ children }) => {
  const { isFilterOpen, openFilter, queryResult } = useListSurface()
  if (isFilterOpen) return null

  const childWithProps = React.cloneElement(children, {
    onFilterIconClick: openFilter,
    onRefresh: queryResult.refetch,
  })

  return <>{childWithProps}</>
}

// 5. Panel 컴포넌트
ListSurface.Panel = ({ children }) => {
  const { isFilterOpen, closeFilter } = useListSurface()
  if (!isFilterOpen) return null

  const childWithProps = React.cloneElement(children, {
    onClose: closeFilter,
  })

  return <>{childWithProps}</>
}

// 6. Content 컴포넌트
ListSurface.Content = ({ renderItem, getKey, emptyMessage, loadingMessage, errorMessage }) => {
  const { isFilterOpen, queryResult } = useListSurface()
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = queryResult

  if (isFilterOpen) return null
  if (isFetching && !isFetchingNextPage)
    return <div className="flex-center flex-1 text-caption-2 text-gray-500">{loadingMessage}</div>
  if (error) return <div className="flex-center flex-1 text-caption-2 text-red-500">{errorMessage}</div>

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <InfiniteListView
        pages={data?.pages.map((p: any) => p.data!.data!)}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        renderItem={renderItem}
        getKey={getKey}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
