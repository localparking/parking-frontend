import React from 'react'
import { ParkingLotDetailResponse } from '@data/user-api-axios/api'

interface ParkingLotDetailProps {
  parkingLot: ParkingLotDetailResponse
}

export const ParkingLotDetail: React.FC<ParkingLotDetailProps> = ({ parkingLot }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* TODO: 주차장 상세 정보 구현 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{parkingLot.name}</h2>
        <p className="text-sm text-gray-600">{parkingLot.address || '주소 정보 없음'}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">주차 현황</span>
          <span className="text-sm font-medium">
            {parkingLot.curCapacity && parkingLot.capacity
              ? `${parkingLot.curCapacity}면 / ${parkingLot.capacity}면`
              : '정보 없음'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">요금</span>
          <span className="text-sm font-medium">{parkingLot.isFree ? '무료' : '유료'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">영업 상태</span>
          <span className="text-sm font-medium">{parkingLot.isOpen ? '영업중' : '영업종료'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">전화번호</span>
          <span className="text-sm font-medium">{parkingLot.tel || '정보 없음'}</span>
        </div>

        {/* 태그들 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {parkingLot.isFree && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              무료
            </span>
          )}
          {parkingLot.isRealtime && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              실시간
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
