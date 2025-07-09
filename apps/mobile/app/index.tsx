import React, { useRef, useCallback, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, StatusBar, Platform, Alert } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import * as Location from 'expo-location'
import { appBridge, appSchema } from './bridge'

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Method '${method}' not found in native`)
  },
})

export default function App() {
  const webviewRef = useRef<BridgeWebView>(null)
  const [locationPermission, setLocationPermission] = useState<string>('undetermined')

  const { currentLocation, getCurrentLocation } = useBridge(appBridge)

  // 앱 시작 시 위치 권한 요청
  useEffect(() => {
    requestLocationPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentLocation && webviewRef.current) {
      console.log('웹뷰로 위치 정보 전달:', currentLocation)

      // JSON 메시지 형태로 웹뷰에 전달
      const message = JSON.stringify({
        type: 'setLocationData',
        payload: currentLocation,
      })

      webviewRef.current.postMessage(message)
    }
  }, [currentLocation])

  const requestLocationPermission = async () => {
    try {
      // 현재 권한 상태 확인
      let { status } = await Location.getForegroundPermissionsAsync()

      if (status !== 'granted') {
        // 권한 요청
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

  const handleUpdateLocation = async () => {
    const location = await getCurrentLocation()
    if (location) {
      Alert.alert('위치 업데이트', `위도: ${location.latitude.toFixed(6)}, 경도: ${location.longitude.toFixed(6)}`)
    } else {
      Alert.alert('위치 오류', '위치 정보를 가져올 수 없습니다.')
    }
  }

  const webviewUrl =
    Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL : process.env.EXPO_PUBLIC_IOS_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  // 웹뷰 로드 완료 시 처리
  const handleLoadEnd = useCallback(() => {
    console.log('Webview load end')
    console.log('WebView loading finished')
    // WebView 로딩 완료 후 현재 위치 정보가 있다면 전달
    if (currentLocation && webviewRef.current) {
      console.log('WebView 로딩 완료 후 위치 정보 재전달:', currentLocation)
      setTimeout(() => {
        const message = JSON.stringify({
          type: 'setLocationData',
          payload: currentLocation,
        })
        webviewRef.current?.postMessage(message)
      }, 1000) // 1초 딜레이 후 전달
    }
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* WebView 영역 */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: webviewUrl }}
          style={styles.webview}
          geolocationEnabled={true}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          onLoadEnd={handleLoadEnd}
          thirdPartyCookiesEnabled={true}
          domStorageEnabled={true}
          // iOS 특정 설정
          allowsLinkPreview={false}
          // 네트워크 오류 처리
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.error('WebView error: ', nativeEvent)
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.error('WebView HTTP error: ', nativeEvent)
          }}
          // 로딩 상태 처리
          onLoadStart={() => {
            console.log('WebView loading started')
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    height: '100%',
    width: '100%',
  },
})
