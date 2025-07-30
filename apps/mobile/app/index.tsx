import React, { useRef, useCallback } from 'react'
import { View, StyleSheet, StatusBar, Platform } from 'react-native' // SafeAreaView 대신 View를 import합니다.
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const { setIntent } = useBridge(appBridge)
  const insets = useSafeAreaInsets()

  const webviewUrl =
    Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL : process.env.EXPO_PUBLIC_IOS_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  const handleLoadEnd = useCallback(() => {
    console.log('WebView loading finished')
    console.log('Current insets:', insets)

    setIntent(insets)
  }, [insets, setIntent])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle="dark-content" />

      {/* WebView 영역 */}
      <WebView
        bounces={false}
        ref={webviewRef}
        source={{ uri: webviewUrl }}
        style={styles.webview}
        onShouldStartLoadWithRequest={(event) => {
          console.log('WebView should start load with request:', event)
          return true
        }}
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
        allowsLinkPreview={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.error('WebView error: ', nativeEvent)
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.error('WebView HTTP error: ', nativeEvent)
        }}
        onLoadStart={() => {
          console.log('WebView loading started')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
})
