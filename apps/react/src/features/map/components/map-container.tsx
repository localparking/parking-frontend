import React from 'react'
import { useMap } from '../hooks/use-map'

export const MapContainer: React.FC = () => {
  const { isMapLoaded, locationError, moveToCurrentLocation } = useMap()

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100%' }} />

      {!isMapLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          지도를 로딩 중입니다...
        </div>
      )}

      {locationError && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff5722',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {locationError}
        </div>
      )}

      <button
        onClick={moveToCurrentLocation}
        disabled={!isMapLoaded}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '12px',
          backgroundColor: isMapLoaded ? '#4285f4' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: isMapLoaded ? 'pointer' : 'not-allowed',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      >
        📍
      </button>
    </div>
  )
}
