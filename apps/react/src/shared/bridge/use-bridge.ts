// import { useCallback } from 'react'
// import { bridge } from './index'

// export const useBridge = () => {
//   const postMessage = useCallback((message: string, data?: any) => {
//     if (window.ReactNativeWebView) {
//       window.ReactNativeWebView.postMessage(JSON.stringify({ type: message, data }))
//     }
//   }, [])

//   return {
//     bridge,
//     postMessage,
//   }
// }
