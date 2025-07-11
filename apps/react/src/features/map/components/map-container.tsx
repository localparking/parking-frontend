import React, { useEffect } from 'react'
import { useMap } from '../hooks/use-map'
import { useMarkers } from '../hooks/use-markers'
import { MarkerData } from '../model/marker.types'

interface MapContainerProps {
  markers?: MarkerData[]
  children?: React.ReactNode
}

export const MapContainer: React.FC<MapContainerProps> = ({ markers = [], children }) => {
  const { isMapLoaded, locationError } = useMap()
  const { addMarkers } = useMarkers()

  useEffect(() => {
    if (markers.length > 0 && isMapLoaded) {
      addMarkers(markers)
    }
  }, [markers, isMapLoaded, addMarkers])

  return (
    <div className="relative h-screen w-full">
      <div id="map" className="h-full w-full" />

      {!isMapLoaded && (
        <div className="absolute top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/90 p-5">
          지도를 로딩 중입니다...
        </div>
      )}

      {locationError && (
        <div className="absolute bottom-5 left-1/2 z-[1000] max-w-[90%] -translate-x-1/2 rounded-lg bg-red-600 px-5 py-3 text-center text-body-02 font-medium text-white shadow-lg">
          {locationError}
        </div>
      )}

      {children}
    </div>
  )
}
