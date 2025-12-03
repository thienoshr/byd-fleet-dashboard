'use client'

import { useMemo } from 'react'
import { partners } from '@/lib/dummyData'

export default function PartnerResponseTimesWidget() {
  const responseTimes = useMemo(() => {
    const avgLeadTime = partners.reduce((sum, p) => sum + p.avgLeadTimeHours, 0) / partners.length
    const fastest = Math.min(...partners.map((p) => p.avgLeadTimeHours))
    const slowest = Math.max(...partners.map((p) => p.avgLeadTimeHours))

    return {
      average: Math.round(avgLeadTime),
      fastest: Math.round(fastest),
      slowest: Math.round(slowest),
    }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Partner Response Times</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Average</span>
          <span className="font-semibold">{responseTimes.average}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fastest</span>
          <span className="font-semibold text-green-600">{responseTimes.fastest}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Slowest</span>
          <span className="font-semibold text-red-600">{responseTimes.slowest}h</span>
        </div>
      </div>
    </div>
  )
}





