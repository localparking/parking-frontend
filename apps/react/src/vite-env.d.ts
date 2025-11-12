/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_NAVER_MAP_CLIENT_ID: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  ReactNativeWebView: {
    postMessage: (msg: string) => void
  }
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}
