'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function OtaUpdateStatusWidget() {
  const otaStatus = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const recent = vehicles.filter((v) => {
      const lastOta = new Date(v.health.lastOta)
      return lastOta >= thirtyDaysAgo
    }).length

    const outdated = vehicles.filter((v) => {
      const lastOta = new Date(v.health.lastOta)
      return lastOta < thirtyDaysAgo && lastOta >= sixtyDaysAgo
    }).length

    const veryOutdated = vehicles.filter((v) => {
      const lastOta = new Date(v.health.lastOta)
      return lastOta < sixtyDaysAgo
    }).length

    return { recent, outdated, veryOutdated }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">OTA Update Status</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Recent (&lt;30 days)</span>
          <span className="font-semibold text-green-600">{otaStatus.recent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Outdated (30-60 days)</span>
          <span className="font-semibold text-yellow-600">{otaStatus.outdated}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Very Outdated (&gt;60 days)</span>
          <span className={`font-semibold ${otaStatus.veryOutdated > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {otaStatus.veryOutdated}
          </span>
        </div>
      </div>
    </div>
  )
}





