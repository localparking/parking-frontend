import { appBridge } from '@/app/bridge'
import { useBridge } from '@webview-bridge/react-native'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import * as Location from 'expo-location'

const useMap = () => {
  const [locationPermission, setLocationPermission] = useState<string>('undetermined')

  const { currentLocation, getCurrentLocation } = useBridge(appBridge)

  // 앱 시작 시 위치 권한 요청
  useEffect(() => {
    requestLocationPermission()
  }, [])

  //   useEffect(() => {
  //     if (currentLocation && webviewRef.current) {
  //       console.log('웹뷰로 위치 정보 전달:', currentLocation)

  //       // JSON 메시지 형태로 웹뷰에 전달
  //       const message = JSON.stringify({
  //         type: 'setLocationData',
  //         payload: currentLocation,
  //       })

  //       webviewRef.current.postMessage(message)
  //     }
  //   }, [currentLocation])

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync()

      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
        status = newStatus
      }

      setLocationPermission(status)

      if (status !== 'granted') {
        Alert.alert(
          '위치 권한 필요',
          '지도 기능을 사용하려면 위치 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인', style: 'default' }]
        )
      } else {
        console.log('위치 권한이 허용되었습니다.')
        await getCurrentLocation()
      }
    } catch (error) {
      console.error('위치 권한 요청 중 오류:', error)
    }
  }

  //   const handleUpdateLocation = async () => {
  //     const location = await getCurrentLocation()
  //     if (location) {
  //       Alert.alert('위치 업데이트', `위도: ${location.latitude.toFixed(6)}, 경도: ${location.longitude.toFixed(6)}`)
  //     } else {
  //       Alert.alert('위치 오류', '위치 정보를 가져올 수 없습니다.')
  //     }
  //   }

  return null
}

export default useMap
