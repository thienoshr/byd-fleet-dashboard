'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function MotExpiringWidget() {
  const motExpiring = useMemo(() => {
    const now = new Date()
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const next60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

    const expiring30Days = vehicles.filter((v) => {
      const motDate = new Date(v.health.motExpiry)
      return motDate >= now && motDate <= next30Days
    }).length

    const expiring60Days = vehicles.filter((v) => {
      const motDate = new Date(v.health.motExpiry)
      return motDate >= now && motDate <= next60Days
    }).length

    return { expiring30Days, expiring60Days }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">MOT Expiring Soon</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Next 30 Days</span>
          <span className={`font-semibold ${motExpiring.expiring30Days > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {motExpiring.expiring30Days}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Next 60 Days</span>
          <span className={`font-semibold ${motExpiring.expiring60Days > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {motExpiring.expiring60Days}
          </span>
        </div>
      </div>
    </div>
  )
}





