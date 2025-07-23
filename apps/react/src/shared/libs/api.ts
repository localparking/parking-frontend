import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isWebView } from '../utils/webview'
import { bridge } from '../bridge'
import Cookies from 'js-cookie'
import { saveTokens } from './token'
import { AuthApi } from '@data/user-api-axios/api'
const { VITE_API_URL } = import.meta.env

// TODO: 동적으로 개발 환경에 따라 BASE_URL을 설정할 수 있도록 개선
const BASE_URL = '/api'
const AUTH_ROUTE = '/auth'

interface QueueItem {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}

interface ApiOptions {
  throwError?: boolean
}

export const defaultOptions = {
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 200000,
}

const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = AUTH_ROUTE
  }
}

export function initApi(): AxiosInstance {
  const apiInstance = axios.create(defaultOptions)

  const authApi = new AuthApi(undefined, '', apiInstance)

  const refreshAccessToken = async (): Promise<string | null> => {
    // 1) WebView → 네이티브에게 토큰 갱신 요청
    if (isWebView()) {
      try {
        const { accessToken } = await bridge.notifyTokenExpired()

        if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
          throw new Error('Access token not found after refresh.')
        }
        return accessToken
      } catch (error: any) {
        throw error
      }
    }
    const refreshToken = Cookies.get('town-refreshToken')
    if (!refreshToken) {
      throw new Error('Refresh token not found.')
    }
    const { data } = await authApi.reissueRefreshToken({
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    if (!data?.data) throw new Error('Failed to refresh token.')

    const { accessToken, refreshToken: newRefreshToken } = data.data
    if (!accessToken || !newRefreshToken) throw new Error('Invalid token payload.')

    saveTokens(accessToken, newRefreshToken)
    return accessToken
  }

  apiInstance.interceptors.request.use(
    async (config) => {
      let accessToken: string | null = null

      if (isWebView()) {
        const tokenData = await bridge.getAuthToken()
        accessToken = tokenData.accessToken
      } else {
        accessToken = Cookies.get('town-accessToken')
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  let failedQueue: QueueItem[] = []

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else if (token && promise.config.headers) {
        promise.config.headers['Authorization'] = `Bearer ${token}`
        apiInstance(promise.config)
          .then((response) => promise.resolve(response))
          .catch((err) => promise.reject(err))
      }
    })
    failedQueue = []
  }

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      const { response } = error

      if (response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const newAccessToken = await refreshAccessToken()
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)

          return apiInstance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error, null)

          if (isWebView()) {
            try {
              await bridge.logout()
            } catch (logoutError) {}
          } else {
            Cookies.remove('town-accessToken')
            Cookies.remove('town-refreshToken')
          }

          // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
          redirectToAuth()
          return Promise.reject(refreshError)
        }
      }

      if (response?.status === 403) {
        redirectToAuth()
      }

      return Promise.reject(error)
    }
  )

  return apiInstance
}

export default initApi()
