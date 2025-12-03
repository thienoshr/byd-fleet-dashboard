'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function VehicleHealthDistributionWidget() {
  const healthDistribution = useMemo(() => {
    const excellent = vehicles.filter((v) => v.health.healthScore >= 80).length
    const good = vehicles.filter((v) => v.health.healthScore >= 60 && v.health.healthScore < 80).length
    const poor = vehicles.filter((v) => v.health.healthScore < 60).length

    return { excellent, good, poor }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Health Distribution</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Excellent (80+)</span>
          <span className="font-semibold text-green-600">{healthDistribution.excellent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Good (60-79)</span>
          <span className="font-semibold text-yellow-600">{healthDistribution.good}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Poor (&lt;60)</span>
          <span className="font-semibold text-red-600">{healthDistribution.poor}</span>
        </div>
      </div>
    </div>
  )
}





