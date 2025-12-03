'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'

interface VehicleUtilizationPanelProps {
  vehicle: Vehicle | null
}

export default function VehicleUtilizationPanel({ vehicle }: VehicleUtilizationPanelProps) {
  if (!vehicle) return null

  // Calculate utilization metrics
  const calculateUtilization = () => {
    // Mock calculations - in real app, these would come from actual data
    const daysInService = 180 // Example: days since vehicle entered service
    const daysOnHire = 120 // Example: days vehicle was on hire
    const utilizationRate = (daysOnHire / daysInService) * 100
    
    return {
      daysInService,
      daysOnHire,
      daysIdle: daysInService - daysOnHire,
      utilizationRate: Math.round(utilizationRate),
      totalRevenue: 45000, // Example revenue
      avgDailyRevenue: Math.round(45000 / daysOnHire),
      totalTrips: 342,
      avgTripDuration: 4.5, // hours
      totalDistance: 12500 // km
    }
  }

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const metrics = calculateUtilization()

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Utilization & Performance</h3>
      
      {/* Utilization Rate */}
      <div className="mb-4 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-600">Utilization Rate</div>
          <div className={`text-xs font-medium ${
            metrics.utilizationRate >= 80 ? 'text-green-600' :
            metrics.utilizationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {metrics.utilizationRate >= 80 ? 'Excellent' :
             metrics.utilizationRate >= 60 ? 'Good' : 'Low'}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="font-bold text-2xl">{metrics.utilizationRate}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              metrics.utilizationRate >= 80 ? 'bg-green-500' :
              metrics.utilizationRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${metrics.utilizationRate}%` }}
          />
        </div>
      </div>

      {/* Service Days */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
        <div>
          <div className="text-xs text-gray-600 mb-1">Days in Service</div>
          <div className="text-lg font-semibold">{metrics.daysInService}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Days on Hire</div>
          <div className="text-lg font-semibold text-blue-600">{metrics.daysOnHire}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Days Idle</div>
          <div className="text-lg font-semibold text-gray-500">{metrics.daysIdle}</div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
        <div>
          <div className="text-xs text-gray-600 mb-1">Total Revenue</div>
          <div className="text-lg font-semibold text-green-600">£{metrics.totalRevenue.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Avg Daily Revenue</div>
          <div className="text-lg font-semibold">£{metrics.avgDailyRevenue}</div>
        </div>
      </div>

      {/* Trip Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
        <div>
          <div className="text-xs text-gray-600 mb-1">Total Trips</div>
          <div className="text-lg font-semibold">{metrics.totalTrips}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Avg Trip Duration</div>
          <div className="text-lg font-semibold">{metrics.avgTripDuration}h</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Total Distance</div>
          <div className="text-lg font-semibold">{metrics.totalDistance.toLocaleString()} km</div>
        </div>
      </div>

      {/* Turnaround Time */}
      <div>
        <div className="text-xs text-gray-600 mb-1">Last Turnaround Time</div>
        <div className="text-sm font-medium">{formatDuration(vehicle.turnaround_seconds)}</div>
        <div className="text-xs text-gray-500 mt-1">
          {vehicle.last_returned_at ? `Last returned: ${new Date(vehicle.last_returned_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}` : '—'}
        </div>
      </div>
    </div>
  )
}



