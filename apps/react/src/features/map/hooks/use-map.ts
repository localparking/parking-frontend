// import { useEffect, useRef, useState } from 'react'
// import type { NaverMap, NaverMarker } from '../model'

// import type { MapInitOptions } from '../model'

// export const isMapReady = (): boolean => {
//   return !!(window.naver?.maps && window.currentMap)
// }

// export const isMapContainerReady = (): boolean => {
//   return !!document.getElementById('map')
// }

// export const useMap = () => {
//   const mapRef = useRef<NaverMap | null>(null)
//   const markersRef = useRef<NaverMarker[]>([])
//   const [locationError, setLocationError] = useState<string | null>(null)

//   const loadNaverMapScript = (): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       if (window.naver?.maps) {
//         resolve()
//         return
//       }

//       const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID

//       if (!naverMapClientId) {
//         reject(new Error('네이버 지도 API 키가 설정되지 않았습니다.'))
//         return
//       }

//       const mapScript = document.createElement('script')
//       mapScript.type = 'text/javascript'
//       mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}&submodules=geocoder`
//       mapScript.onload = () => initializeMap()
//       mapScript.onerror = () => reject(new Error('네이버 지도 API 로드 실패'))
//       document.head.appendChild(mapScript)
//     })
//   }

//   const initializeMap = async (options?: MapInitOptions): Promise<NaverMap | null> => {
//     const mapContainer = document.getElementById('map')

//     if (!mapContainer) {
//       return null
//     }

//     // 기본 설정
//     const defaultOptions: Required<MapInitOptions> = {
//       center: { lat: 37.5665, lng: 126.978 },
//       zoom: 15,
//       mapDataControl: false,
//     }

//     // 사용자 옵션이 있다면 덮어씌워 현 위치 설정
//     const finalOptions = { ...defaultOptions, ...options }
//     const position = new window.naver.maps.LatLng(finalOptions.center.lat, finalOptions.center.lng)

//     // 지도 생성
//     const map = new window.naver.maps.Map('map', {
//       center: position,
//       zoom: finalOptions.zoom,
//       mapDataControl: finalOptions.mapDataControl,
//     })

//     window.currentMap = map

//     return map
//   }

//   // const cleanupMap = () => {
//   //   markersRef.current.forEach((marker) => {
//   //     marker.setMap(null)
//   //   })
//   //   markersRef.current = []

//   //   if (window.currentLocationMarker) {
//   //     window.currentLocationMarker.setMap(null)
//   //     window.currentLocationMarker = undefined
//   //   }

//   //   mapRef.current = null
//   //   window.currentMap = undefined

//   //   setIsMapLoaded(false)
//   //   setLocationError(null)
//   // }

//   // const initMap = async () => {
//   //   cleanupMap()

//   //   try {
//   //     const map = await initializeMap()
//   //     if (!map) return

//   //     mapRef.current = map
//   //     setIsMapLoaded(true)

//   //     if (window.nativeLocationData) {
//   //       updateMapWithNativeLocation(window.nativeLocationData)
//   //     } else {
//   //       try {
//   //         const position = await getCurrentLocation()
//   //         const currentLocation = new window.naver!.maps.LatLng(position.coords.latitude, position.coords.longitude)

//   //         const currentLocationMarker = createLocationMarker(currentLocation, map, '현재 위치 (웹)', '#34a853')
//   //         markersRef.current.push(currentLocationMarker)
//   //         window.currentLocationMarker = currentLocationMarker

//   //         map.setCenter(currentLocation)
//   //         setLocationError(null)
//   //       } catch (locationError) {}
//   //     }
//   //   } catch (error) {}
//   // }

//   // const moveToCurrentLocation = async () => {
//   //   if (!isMapLoaded || !window.currentMap || !window.naver) {
//   //     return
//   //   }

//   //   if (window.nativeLocationData) {
//   //     updateMapWithNativeLocation(window.nativeLocationData)
//   //     return
//   //   }

//   //   try {
//   //     const position = await getCurrentLocation()
//   //     const currentLocation = new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude)

//   //     window.currentMap.setCenter(currentLocation)
//   //     window.currentMap.setZoom(15)

//   //     if (window.currentLocationMarker) {
//   //       window.currentLocationMarker.setMap(null)
//   //     }

//   //     window.currentLocationMarker = createLocationMarker(
//   //       currentLocation,
//   //       window.currentMap,
//   //       '현재 위치 (웹)',
//   //       '#34a853'
//   //     )

//   //     setLocationError(null)
//   //   } catch (error) {
//   //     setLocationError('현재 위치를 가져올 수 없습니다.')
//   //   }
//   // }

//   // useEffect(() => {
//   //   const handleMessage = (event: MessageEvent) => {
//   //     try {
//   //       const data: WebViewMessage = JSON.parse(event.data)

//   //       if (data.type === 'setLocationData' && data.payload) {
//   //         window.nativeLocationData = data.payload

//   //         // 지도가 이미 로드되어 있다면 즉시 위치 업데이트
//   //         if (window.currentMap && window.naver) {
//   //           updateMapWithNativeLocation(data.payload)
//   //         }
//   //       }
//   //     } catch (error) {
//   //     }
//   //   }

//   //   window.addEventListener('message', handleMessage)
//   //   return () => window.removeEventListener('message', handleMessage)
//   // }, [])

//   return {
//     locationError,
//     // moveToCurrentLocation,
//     setLocationError,
//     loadNaverMapScript,
//     initializeMap,
//   }
// }
