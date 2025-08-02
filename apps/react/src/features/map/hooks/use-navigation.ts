import { useNavigate } from '@tanstack/react-router'

export const useNavigation = () => {
  const navigate = useNavigate()

  const navigateToStoreDetail = (storeId: string) => {
    navigate({
      to: '/map',
      search: { storeId: storeId.toString(), parkingLotId: undefined },
    })
  }

  const navigateToParkingLotDetail = (parkingLotId: string) => {
    navigate({
      to: '/map',
      search: { parkingLotId: parkingLotId.toString(), storeId: undefined },
    })
  }

  const navigateToMapList = () => {
    navigate({
      to: '/map',
      search: { parkingLotId: undefined, storeId: undefined },
    })
  }

  return {
    navigateToStoreDetail,
    navigateToParkingLotDetail,
    navigateToMapList,
  }
}
