import React, { useState } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'

interface ListSurfaceProps<T> {
  useDataQuery: () => UseInfiniteQueryResult<any>
  TopFilterComponent: React.FC<{ onFilterIconClick: () => void; onRefresh: () => void }>
  FilterPanelComponent: React.FC<{ onClose: () => void }>
  ListComponent: React.FC<any> // 실제 List 컴포넌트의 props 타입으로 지정하는 것이 좋습니다.
  loadingMessage: string
  errorMessage: string
}

export function ListSurface<T>({
  useDataQuery,
  TopFilterComponent,
  FilterPanelComponent,
  ListComponent,
  loadingMessage,
  errorMessage,
}: ListSurfaceProps<T>) {
  const [isFilterMode, setIsFilterMode] = useState(false)
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } = useDataQuery()

  const renderContent = () => {
    if (isFetching && !isFetchingNextPage) {
      return (
        <div className="flex flex-1 items-center justify-center text-center text-gray-500">
          <p className="text-caption-2">{loadingMessage}</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="mb-2 text-2xl">❌</div>
            <p className="text-caption-2">{errorMessage}</p>
          </div>
        </div>
      )
    }

    return (
      <ListComponent
        pages={data?.pages.map((p: any) => p.data!.data!)}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
      />
    )
  }

  return (
    <div className="flex h-full flex-col rounded-t-[40px] bg-white">
      {isFilterMode ? (
        <FilterPanelComponent onClose={() => setIsFilterMode(false)} />
      ) : (
        <>
          <TopFilterComponent onFilterIconClick={() => setIsFilterMode(true)} onRefresh={refetch} />
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </>
      )}
    </div>
  )
}
