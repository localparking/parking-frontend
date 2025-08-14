import React, { useRef, useMemo, useEffect } from 'react'
import { PageResponseParkingLotListResponse } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'
import { useNavigation } from '@/features/map'
import { formatPrice } from '@/shared/utils/format'
import { useMapContext } from '@/features/map'

interface ParkingLotListProps {
  pages: PageResponseParkingLotListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

export const ParkingLotList: React.FC<ParkingLotListProps> = ({
  pages,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}) => {
  const parkingLots = useMemo(() => pages?.flatMap((page) => page.content || []) || [], [pages])
  const { navigateToParkingLotDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  const observerTarget = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!onFetchNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage()
        }
      },
      { threshold: 1.0 } // 타겟이 100% 보였을 때 콜백 실행
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    // 컴포넌트가 언마운트되거나, 의존성이 변경되어 effect가 재실행되기 전에 관찰을 중단
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [onFetchNextPage, hasNextPage, isFetchingNextPage])

  if (parkingLots.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-caption-2">주변에 주차장이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-2.5">
        {parkingLots.map((parkingLot) => (
          <li key={parkingLot.parkingCode} className="mx-4">
            <div
              className="cursor-pointer rounded-lg border border-white bg-white p-3"
              onClick={() => {
                moveTo({ lat: parkingLot.lat, lng: parkingLot.lon })
                navigateToParkingLotDetail(parkingLot.parkingCode)
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-gray-500">
                    {parkingLot.curCapacity
                      ? `주차 ${parkingLot.curCapacity}면 / ${parkingLot.capacity}면`
                      : `주차 ${parkingLot.capacity}면`}
                  </div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-body-4 text-gray-1">{parkingLot.name}</h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        parkingLot.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      )}
                    >
                      {parkingLot.isOpen ? '영업중' : '영업종료'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1">
                  <span className="text-caption-3 text-gray-2">1시간당 요금</span>
                  <span className="text-caption-2 text-gray-1">{formatPrice(parkingLot.hourlyFee || 0)}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div
        ref={observerTarget}
        className={cn('h-1', { invisible: isFetchingNextPage || !hasNextPage })}
        // 로딩 중이거나 더 이상 페이지가 없을 때는 높이를 0으로 만들어 보이지 않게 처리
      />

      {isFetchingNextPage && (
        <div className="p-4 text-center">
          <div className="text-caption-2 text-gray-2">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
