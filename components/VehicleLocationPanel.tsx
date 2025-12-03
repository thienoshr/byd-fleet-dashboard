'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'

interface VehicleLocationPanelProps {
  vehicle: Vehicle | null
}

export default function VehicleLocationPanel({ vehicle }: VehicleLocationPanelProps) {
  if (!vehicle) return null

  // Mock location history - in real app, this would come from GPS tracking
  const locationHistory = [
    { timestamp: '2025-01-20T14:30:00Z', location: 'London Heathrow', lat: 51.4700, lng: -0.4543, status: 'Parked' },
    { timestamp: '2025-01-20T10:15:00Z', location: 'M25 Junction 14', lat: 51.5000, lng: -0.4000, status: 'In Transit' },
    { timestamp: '2025-01-20T08:00:00Z', location: 'London Central', lat: 51.5074, lng: -0.1278, status: 'Parked' },
    { timestamp: '2025-01-19T18:00:00Z', location: 'Manchester Hub', lat: 53.4839, lng: -2.2446, status: 'Parked' }
  ]

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDateTime(dateString)
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Location & Tracking</h3>
      
      {/* Current Location */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-xs text-gray-600 mb-1">Current Location</div>
        <div className="text-sm font-semibold mb-2">{vehicle.location}</div>
        <div className="text-xs text-gray-500">
          Coordinates: {vehicle.location_coords.lat.toFixed(4)}, {vehicle.location_coords.lng.toFixed(4)}
        </div>
        <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
          View on Map →
        </button>
      </div>

      {/* Location Status */}
      <div className="mb-4 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">Tracking Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-xs font-medium text-green-600">Active</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Last update: {getRelativeTime(locationHistory[0].timestamp)}
        </div>
      </div>

      {/* Location History */}
      <div>
        <div className="text-xs text-gray-600 mb-2 font-medium">Recent Location History</div>
        <div className="space-y-2">
          {locationHistory.slice(0, 5).map((loc, idx) => (
            <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="text-sm font-medium">{loc.location}</div>
                <div className="text-xs text-gray-500 mt-1">{getRelativeTime(loc.timestamp)}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                loc.status === 'Parked' ? 'bg-gray-200 text-gray-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {loc.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

