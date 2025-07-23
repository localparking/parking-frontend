import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { WebViewMessage } from '../bridge/types'

export const useNativeMessageHandler = () => {
  const navigate = useNavigate()

  const handleWebViewMessage = useCallback(
    async (message: WebViewMessage) => {
      const { type, data } = message

      switch (type) {
        case 'navigate':
          if (data?.route) {
            navigate({ to: data.route })
          }
          break
        default:
        // console.warn('알 수 없는 메시지 타입:', type)
      }
    },
    [navigate]
  )

  return {
    handleWebViewMessage,
  }
}
