'use client'

import { useMemo } from 'react'
import { vehiclesWithRisk } from '@/lib/dummyData'

export default function PartsStatusWidget() {
  const partsStatus = useMemo(() => {
    const ok = vehiclesWithRisk.filter((v) => v.part_status === 'OK').length
    const minor = vehiclesWithRisk.filter((v) => v.part_status === 'Minor').length
    const critical = vehiclesWithRisk.filter((v) => v.part_status === 'Critical').length

    return { ok, minor, critical }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Parts Status</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">OK</span>
          <span className="font-semibold text-green-600">{partsStatus.ok}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Minor</span>
          <span className="font-semibold text-yellow-600">{partsStatus.minor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Critical</span>
          <span className="font-semibold text-red-600">{partsStatus.critical}</span>
        </div>
      </div>
    </div>
  )
}





