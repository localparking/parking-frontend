import React, { useRef, useEffect, useState } from 'react'
import { Text, Button, SafeAreaView, TextInput, View, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native'
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

  const { count, data, increase, setDataText, showNative, setShowNative, currentLocation, getCurrentLocation } =
    useBridge(appBridge)

  // 앱 시작 시 위치 권한 요청
  useEffect(() => {
    requestLocationPermission()
  }, [])

  // 위치 정보가 변경될 때마다 웹뷰로 전달
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={{ height: showNative ? '33%' : 0 }}>
        <ScrollView contentContainerStyle={styles.nativeContentContainer}>
          <Text style={styles.headerTitle}>React Native UI</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Native → Web: 메시지 보내기</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Set Web Message (zod)"
                onPress={() => postMessage('setWebMessage_zod', { message: 'zod !' })}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Set Web Message (valibot)"
                onPress={() => postMessage('setWebMessage_valibot', { message: 'valibot !' })}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>공유 상태 관리</Text>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                Webview Count: <Text style={styles.stateValue}>{count}</Text>
              </Text>
              <Button onPress={increase} title="Increase From Native" />
            </View>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                Webview Data Text: <Text style={styles.stateValue}>{data.text}</Text>
              </Text>
              <TextInput
                value={data.text}
                onChangeText={setDataText}
                style={styles.input}
                placeholder="여기에 입력하세요..."
              />
            </View>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                위치 권한 상태: <Text style={styles.stateValue}>{locationPermission}</Text>
              </Text>
              <Button onPress={requestLocationPermission} title="위치 권한 재요청" />
            </View>

            <View style={styles.stateItem}>
              <Text style={styles.stateLabel}>
                현재 위치:{' '}
                {currentLocation ? (
                  <Text style={styles.stateValue}>
                    {`위도: ${currentLocation.latitude.toFixed(6)}, 경도: ${currentLocation.longitude.toFixed(6)}`}
                  </Text>
                ) : (
                  <Text style={styles.stateValue}>위치 정보 없음</Text>
                )}
              </Text>
              <Button onPress={handleUpdateLocation} title="위치 정보 업데이트" />
            </View>
          </View>

          <View style={styles.card}>
            <Button onPress={() => setShowNative(false)} title="Close Native UI" />
          </View>
        </ScrollView>
      </View>

      {/* 2. WebView 영역 */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: 'http://localhost:3001' }}
          style={styles.webview}
          // 위치 정보 관련 설정 개선
          geolocationEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // 권한 관련 설정
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={true}
          domStorageEnabled={true}
          // iOS 특정 설정
          allowsLinkPreview={false}
          // 네트워크 오류 처리
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.error('WebView error:', nativeEvent)
          }}
          // 로딩 상태 처리
          onLoadStart={() => {
            console.log('WebView loading started')
          }}
          onLoadEnd={() => {
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
          }}
        />
      </View>
    </SafeAreaView>
  )
}

// --- 스타일시트 ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  nativeContentContainer: {
    padding: 16,
  },
  nativeContainer: {
    height: '33%',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A202C',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // 그림자 (Android)
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2D3748',
  },
  buttonContainer: {
    marginVertical: 4,
  },
  stateItem: {
    marginVertical: 10,
  },
  stateLabel: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  stateValue: {
    fontWeight: 'bold',
    color: '#2B6CB0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F7FAFC',
  },
  webviewContainer: {
    flex: 2,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
})
