import React, { useRef, useCallback, useEffect } from 'react'
import { View, StyleSheet, StatusBar, Platform, Keyboard, LayoutAnimation } from 'react-native'
import { createWebView, useBridge, type BridgeWebView } from '@webview-bridge/react-native'
import { appBridge, appSchema } from './bridge'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebViewError } from './component/webview-error'

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
  const { setKeyboardHeight } = useBridge(appBridge)

  const insets = useSafeAreaInsets()

  // const webviewUrl = process.env.EXPO_PUBLIC_WEB_VIEW_URL
  const webviewUrl =
    Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_WEB_VIEW_URL : process.env.EXPO_PUBLIC_IOS_WEB_VIEW_URL

  if (!webviewUrl) {
    throw new Error('Webview URL is not set')
  }

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    const showEvent = 'keyboardWillShow'
    const hideEvent = 'keyboardWillHide'
    const showSub = Keyboard.addListener(showEvent, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(e.endCoordinates.height - insets.bottom)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      setKeyboardHeight(0)
    })
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [insets.bottom, setKeyboardHeight])

  const handleLoadEnd = useCallback(() => {}, [])
  const handleRetry = useCallback(() => {
    webviewRef.current?.reload()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle="dark-content" />

      {/* WebView 영역 */}
      <WebView
        ref={webviewRef}
        source={{ uri: webviewUrl }}
        style={styles.webview}
        bounces={false}
        geolocationEnabled
        scrollEnabled={false}
        domStorageEnabled
        javaScriptEnabled
        thirdPartyCookiesEnabled
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        allowsBackForwardNavigationGestures={false}
        onShouldStartLoadWithRequest={() => true}
        renderError={() => <WebViewError onRetry={handleRetry} />}
        startInLoadingState={false}
        onLoadEnd={handleLoadEnd}
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
