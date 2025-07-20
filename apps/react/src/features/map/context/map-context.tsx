import { useNavigate } from '@tanstack/react-router'
import { cn } from '@ui/common/lib/utils'
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useMap } from '../hooks'

interface MapContextType {
  data: []
  isMapLoaded: boolean
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MapContextType['data']>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const { loadNaverMapScript, initializeMap } = useMap()

  useEffect(() => {
    if (typeof window.naver === 'undefined') {
      loadNaverMapScript()
    } else {
      initializeMap()
    }
    setIsMapLoaded(true)
  }, [])

  return (
    <MapContext.Provider
      value={{
        data,
        isMapLoaded,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

// 커스텀 훅
export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}
