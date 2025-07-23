// WebView에서 네이티브로 전송하는 메시지 타입
export interface WebViewMessage {
  type:
    | 'onLandingComplete' // 랜딩 완료
    | 'navigate' // 페이지 이동 요청

  data?: {
    hasCompletedLanding?: boolean
    route?: string
    accessToken?: string
    refreshToken?: string
  }
}

// 네이티브에서 WebView로 전송하는 메시지 타입
export interface NativeMessage {
  type:
    | 'navigate' // 페이지 이동
    | 'showWebView' // WebView 표시
  data?: any
}
