// page.tsx
import { useBottomSheet } from '@/features/map/hooks/use-bottom-sheet'
import { createFileRoute } from '@tanstack/react-router'

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
  const { open, close, BottomSheetComponent } = useBottomSheet()

  const handleOpenPlaceInfo = () => {
    open(<PlaceInfoContent />)
  }

  const handleOpenSearchList = () => {
    open(<SearchListContent />)
  }

  return (
    <div>
      <div id="map" className="h-screen bg-gray-200" />

      {/* 외부에서 BottomSheet를 제어하는 버튼 예시 */}
      <div className="fixed top-4 left-4 z-10 flex flex-col space-y-2">
        <button onClick={handleOpenPlaceInfo} className="rounded bg-blue-500 px-4 py-2 text-white">
          장소 정보 열기
        </button>
        <button onClick={handleOpenSearchList} className="rounded bg-green-500 px-4 py-2 text-white">
          검색 목록 열기
        </button>
        <button onClick={close} className="rounded bg-red-500 px-4 py-2 text-white">
          바텀시트 닫기
        </button>
      </div>

      {/* 훅이 반환하는 컴포넌트를 렌더링하기만 하면 끝 */}
      {BottomSheetComponent}
    </div>
  )
}
