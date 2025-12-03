'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function LocationUtilizationWidget() {
  const locationStats = useMemo(() => {
    const locations = vehicles.reduce((acc, v) => {
      if (!acc[v.location]) {
        acc[v.location] = { total: 0, available: 0 }
      }
      acc[v.location].total++
      if (v.availability_status === 'Available') {
        acc[v.location].available++
      }
      return acc
    }, {} as Record<string, { total: number; available: number }>)

    return Object.entries(locations)
      .map(([location, stats]) => ({
        location,
        total: stats.total,
        available: stats.available,
        utilization: Math.round((stats.available / stats.total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Top 5 locations
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Utilization</h3>
      <div className="space-y-2 text-sm">
        {locationStats.map((stat) => (
          <div key={stat.location} className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 font-medium truncate">{stat.location}</div>
              <div className="text-xs text-gray-500">{stat.available}/{stat.total} available</div>
            </div>
            <div className="ml-2 text-right">
              <div className={`font-semibold ${
                stat.utilization >= 50 ? 'text-green-600' :
                stat.utilization >= 25 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {stat.utilization}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}





