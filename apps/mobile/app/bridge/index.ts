// @expo/metro-runtime: This file should not be treated as a route
// @expo-router-ignore
import { Bridge, bridge, postMessageSchema } from '@webview-bridge/react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Location from 'expo-location'

import { z } from 'zod'
import * as v from 'valibot'

type LocationData = {
  latitude: number
  longitude: number
  accuracy: number
}

type BridgeStore = {
  showNative: boolean
  count: number
  data: { text: string }
  currentLocation: LocationData | null
}

type BridgeActions = {
  setShowNative(show: boolean): Promise<void>
  openInAppBrowser(url: string): Promise<void>
  getMessage(): Promise<"I'm from native">
  increase(): Promise<void>
  setDataText(text: string): Promise<void>
  getCurrentLocation(): Promise<LocationData | null>
  requestLocationPermission(): Promise<boolean>
}

export type AppBridgeState = Bridge & BridgeStore & BridgeActions

export const appBridge = bridge<AppBridgeState>(({ set, get }) => {
  const actions: BridgeActions = {
    async setShowNative(show: boolean) {
      set({ showNative: show })
    },
    async openInAppBrowser(url) {
      await WebBrowser.openBrowserAsync(url, {})
    },
    async getMessage() {
      return "I'm from native" as const
    },
    async increase() {
      set({ count: get().count + 1 })
    },
    async setDataText(text) {
      set({ data: { text } })
    },
    async getCurrentLocation() {
      try {
        // 권한 확인
        const { status } = await Location.getForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.warn('위치 권한이 없습니다.')
          return null
        }

        // 현재 위치 가져오기
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 0,
        })

        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
        }

        // 브릿지 상태에 저장
        set({ currentLocation: locationData })

        console.log('네이티브에서 위치 정보 획득:', locationData)
        return locationData
      } catch (error) {
        console.error('네이티브 위치 정보 가져오기 실패:', error)
        return null
      }
    },
    async requestLocationPermission() {
      try {
        let { status } = await Location.getForegroundPermissionsAsync()

        if (status !== 'granted') {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
          status = newStatus
        }

        return status === 'granted'
      } catch (error) {
        console.error('위치 권한 요청 실패:', error)
        return false
      }
    },
  }

  return {
    showNative: true,
    count: 0,
    data: { text: '' },
    currentLocation: null,
    ...actions,
  }
})

export const appSchema = postMessageSchema({
  setWebMessage_zod: {
    validate: (value) => {
      return z.object({ message: z.string() }).parse(value)
    },
  },
  setWebMessage_valibot: {
    validate: (value) => {
      return v.parse(v.object({ message: v.string() }), value)
    },
  },
  setDataText: {
    validate: (value) => {
      return z.object({ text: z.string() }).parse(value)
    },
  },
  openInAppBrowser: {
    validate: (value) => {
      return z.object({ url: z.string().url() }).parse(value)
    },
  },
  setDataText_valibot: {
    validate: (value) => {
      return v.parse(v.object({ text: v.string() }), value)
    },
  },
  setLocationData: {
    validate: (value) => {
      return z
        .object({
          latitude: z.number(),
          longitude: z.number(),
          accuracy: z.number(),
        })
        .parse(value)
    },
  },
})

export type AppBridge = typeof appBridge
export type AppPostMessageSchema = typeof appSchema
