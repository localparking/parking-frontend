import { useNavigate } from '@tanstack/react-router'

export const useNavigation = () => {
  const navigate = useNavigate()

  const navigateToStoreDetail = (storeId: string) => {
    navigate({
      to: '/map/store/$storeId',
      params: { storeId: storeId.toString() },
    })
  }

  const navigateToParkingLotDetail = (parkingLotId: string) => {
    navigate({
      to: '/map/parking-lot/$parkingLotId',
      params: { parkingLotId: parkingLotId.toString() },
    })
  }

  return {
    navigateToStoreDetail,
    navigateToParkingLotDetail,
  }
}
