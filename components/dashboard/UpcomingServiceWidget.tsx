'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'
import Link from 'next/link'

export default function UpcomingServiceWidget() {
  const serviceDue = useMemo(() => {
    const now = new Date()
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const due7Days = vehicles.filter((v) => {
      // Use motExpiry as service indicator
      const serviceDate = new Date(v.health.motExpiry)
      return serviceDate >= now && serviceDate <= next7Days
    }).length

    const due30Days = vehicles.filter((v) => {
      const serviceDate = new Date(v.health.motExpiry)
      return serviceDate >= now && serviceDate <= next30Days
    }).length

    return { due7Days, due30Days }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Service Due</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Next 7 Days</span>
          <span className={`font-semibold ${serviceDue.due7Days > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {serviceDue.due7Days}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Next 30 Days</span>
          <span className={`font-semibold ${serviceDue.due30Days > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {serviceDue.due30Days}
          </span>
        </div>
      </div>
    </div>
  )
}

