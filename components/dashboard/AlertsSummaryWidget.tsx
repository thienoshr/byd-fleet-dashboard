'use client'

import { useMemo } from 'react'
import { vehicles, agreementsFull } from '@/lib/dummyData'
import Link from 'next/link'

export default function AlertsSummaryWidget() {
  const alerts = useMemo(() => {
    // Critical bottlenecks
    const criticalBottlenecks = vehicles.filter((v) => {
      const ts = v.stage_timestamps || {}
      if (v.availability_status === 'In Workshop' && ts.workshopInAt) {
        const hours = (Date.now() - new Date(ts.workshopInAt).getTime()) / (1000 * 60 * 60)
        return hours > 48
      }
      if (ts.partsRequestedAt) {
        const hours = (Date.now() - new Date(ts.partsRequestedAt).getTime()) / (1000 * 60 * 60)
        return hours > 72
      }
      return false
    }).length

    // Overdue agreements
    const overdueAgreements = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate < new Date() && a.stage !== 'Closed'
    }).length

    // High-risk vehicles
    const highRiskVehicles = vehicles.filter((v) => v.risk_level === 'High').length

    // Contracts expiring soon
    const expiringContracts = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      const daysUntil = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 && daysUntil > 0 && a.stage !== 'Closed'
    }).length

    return {
      critical: criticalBottlenecks,
      warning: overdueAgreements + expiringContracts,
      info: highRiskVehicles,
    }
  }, [])

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Alerts Summary</h3>
        <Link href="/operations" className="text-xs text-primary-600 hover:text-primary-700">
          View All →
        </Link>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">🚨 Critical</span>
          <span className={`font-semibold ${alerts.critical > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {alerts.critical}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">⚠️ Warning</span>
          <span className={`font-semibold ${alerts.warning > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
            {alerts.warning}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">ℹ️ Info</span>
          <span className={`font-semibold ${alerts.info > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
            {alerts.info}
          </span>
        </div>
      </div>
    </div>
  )
}





