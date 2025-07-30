// page.tsx
import { useBottomSheet } from '@/features/map/hooks/use-bottom-sheet'
import { createFileRoute } from '@tanstack/react-router'
import { MapControl } from '@/features/map/components/map-controll'
import { MapMarkers } from '@/features/map/components/map-marker'
import { MapTypeToggle } from '@/features/map/components/map-type-toggle'
import { useMapContext } from '@/features/map/context/map-context'

export const Route = createFileRoute('/map/')({
  component: Map,
})

const PlaceInfoContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold">장소 A</h2>
    <p>여기는 장소 A에 대한 상세 정보입니다.</p>
    <div className="flex overflow-x-auto">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 border-b px-4 py-3">
          검색 결과 #{i + 1}
        </div>
      ))}
    </div>
  </div>
)

const SearchListContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold">검색 결과</h2>
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="border-b py-3">
        검색 결과 #{i + 1}
      </div>
    ))}
  </div>
)

function Map() {
  const { distanceLevel } = useMapContext()
  const { open, close, BottomSheetComponent } = useBottomSheet()

  const handleOpenPlaceInfo = () => {
    open(<PlaceInfoContent />)
  }

  const handleOpenSearchList = () => {
    open(<SearchListContent />)
  }

  return (
    <div className="relative">
      <div id="map" className="h-screen" />
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />
      {distanceLevel === null && (
        <div
          className="absolute top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/60 p-3 text-sm text-white shadow-lg"
          aria-live="polite"
        >
          지도를 확대하여 주변 정보를 확인하세요.
        </div>
      )}
      {/* <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <button onClick={handleOpenPlaceInfo} className="rounded bg-blue-500 px-4 py-2 text-white shadow-md">
          (임시) 장소 정보 열기
        </button>
        <button onClick={handleOpenSearchList} className="rounded bg-green-500 px-4 py-2 text-white shadow-md">
          (임시) 검색 목록 열기
        </button>
        <button onClick={close} className="rounded bg-red-500 px-4 py-2 text-white shadow-md">
          (임시) 바텀시트 닫기
        </button>
      </div> */}
      {BottomSheetComponent}
      {/* <Search /> */}
    </div>
  )
}
