'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { vehicles } from '@/lib/dummyData'

// Dynamically import react-leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

export default function FleetMapContent() {
  useEffect(() => {
    // Fix Leaflet icon paths
    if (typeof window !== 'undefined') {
      import('leaflet').then((L: any) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
      })
    }
  }, [])

  // Default center (UK)
  const center: [number, number] = [53.0, -1.5]

  const MapContainerAny = MapContainer as any
  const TileLayerAny = TileLayer as any
  const MarkerAny = Marker as any
  const PopupAny = Popup as any

  return (
    <div className="h-96 rounded shadow overflow-hidden">
      <MapContainerAny
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayerAny
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v) => (
          <MarkerAny
            position={[v.location_coords.lat, v.location_coords.lng]}
            key={v.id}
          >
            <PopupAny>
              <div className="text-sm">
                <div className="font-semibold">
                  {v.model} • {v.registration}
                </div>
                <div>Location: {v.location}</div>
                <div>Status: {v.availability_status}</div>
              </div>
            </PopupAny>
          </MarkerAny>
        ))}
      </MapContainerAny>
    </div>
  )
}

