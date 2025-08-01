import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ParkingLotDetail } from '@/features/map/components/detail'
import { useQuery } from '@tanstack/react-query'
import { ParkingApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

export const Route = createFileRoute('/map/parking-lot/$parkingLotId/')({
  component: ParkingLotDetailPage,
})

function ParkingLotDetailPage() {
  const { parkingLotId } = Route.useParams()
  const parkingApi = new ParkingApi(undefined, '', apiInstance)

  const {
    data: parkingLotResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['parkingLot', parkingLotId],
    queryFn: async () => {
      const { data } = await parkingApi.getParkingLotDetail({ parkingCode: parkingLotId })
      return data
    },
    enabled: !!parkingLotId,
  })

  const parkingLot = parkingLotResponse?.data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (error || !parkingLot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center text-red-600">주차장 정보를 불러올 수 없습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900">주차장 상세 정보</h1>
        <p className="text-gray-600">주차장 ID: {parkingLotId}</p>
        <ParkingLotDetail parkingLot={parkingLot} />
      </div>
    </div>
  )
}
