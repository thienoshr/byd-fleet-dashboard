'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function GeographicDistributionWidget() {
  const locationDistribution = useMemo(() => {
    const locations = vehicles.reduce((acc, v) => {
      if (!acc[v.location]) {
        acc[v.location] = 0
      }
      acc[v.location]++
      return acc
    }, {} as Record<string, number>)

    return Object.entries(locations)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Geographic Distribution</h3>
      <div className="space-y-2 text-sm">
        {locationDistribution.map((item) => (
          <div key={item.location} className="flex justify-between items-center">
            <span className="text-gray-600 truncate flex-1">{item.location}</span>
            <span className="font-semibold ml-2">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}





