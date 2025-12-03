'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'
import Link from 'next/link'

// Helper function to capitalize progress text
function capitalizeProgress(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function ServiceDelaysSummaryWidget() {
  const delays = useMemo(() => {
    const STAGE_THRESHOLDS = {
      workshop: 48 * 3600,
      awaitingParts: 72 * 3600,
      valeted: 3 * 3600,
    }

    let critical = 0
    let warning = 0
    const delayedVehicles: Array<{
      id: string
      registration: string
      model: string
      currentStage: string
      secondsInStage: number | null
      severity: 'critical' | 'warning'
    }> = []

    vehicles.forEach((v) => {
      const ts = v.stage_timestamps || {}
      let secondsInStage: number | null = null
      let currentStage = 'Available'
      let severity: 'critical' | 'warning' | null = null

      if (v.availability_status === 'In Workshop') {
        currentStage = 'In Workshop'
        secondsInStage = ts.workshopInAt
          ? Math.floor((Date.now() - new Date(ts.workshopInAt).getTime()) / 1000)
          : null
        if (secondsInStage && secondsInStage > STAGE_THRESHOLDS.workshop) {
          critical++
          severity = 'critical'
        }
      } else if (ts.partsRequestedAt && v.availability_status !== 'Available') {
        currentStage = 'Awaiting Parts'
        secondsInStage = Math.floor((Date.now() - new Date(ts.partsRequestedAt).getTime()) / 1000)
        if (secondsInStage > STAGE_THRESHOLDS.awaitingParts) {
          critical++
          severity = 'critical'
        }
      } else if (v.availability_status === 'Awaiting Valet') {
        currentStage = 'Awaiting Valet'
        if (ts.returnedAt) {
          secondsInStage = Math.floor((Date.now() - new Date(ts.returnedAt).getTime()) / 1000)
          if (secondsInStage > STAGE_THRESHOLDS.valeted) {
            warning++
            severity = 'warning'
          }
        }
      }

      if (severity) {
        delayedVehicles.push({
          id: v.id,
          registration: v.registration,
          model: v.model,
          currentStage,
          secondsInStage,
          severity,
        })
      }
    })

    // Sort by severity (critical first) then by duration (longest first)
    delayedVehicles.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1
      if (a.severity !== 'critical' && b.severity === 'critical') return 1
      const aDuration = a.secondsInStage || 0
      const bDuration = b.secondsInStage || 0
      return bDuration - aDuration
    })

    return { critical, warning, delayedVehicles: delayedVehicles.slice(0, 5) } // Show top 5
  }, [])

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return '—'
    const totalHours = Math.floor(seconds / 3600)
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    
    if (months > 0) {
      return `${months}m ${remainingDays}d ${hours}h`
    } else if (days > 0) {
      return `${days}d ${hours}h`
    }
    return `${hours}h`
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Service Delays</h3>
        <Link href="/operations" className="text-xs text-primary-600 hover:text-primary-700">
          View Details →
        </Link>
      </div>
      
      {/* Summary Counts */}
      <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Critical</span>
          <span className={`font-semibold ${delays.critical > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {delays.critical}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Warning</span>
          <span className={`font-semibold ${delays.warning > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
            {delays.warning}
          </span>
        </div>
      </div>

      {/* Delayed Vehicles List */}
      {delays.delayedVehicles.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 mb-2">Top Delayed Vehicles:</p>
          <ul className="space-y-2">
            {delays.delayedVehicles.map((v) => (
              <li key={v.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold mb-1 ${
                      v.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {formatDuration(v.secondsInStage)}
                    </div>
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {v.model} • {v.registration}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {v.currentStage}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">No service delays detected</p>
      )}
    </div>
  )
}
