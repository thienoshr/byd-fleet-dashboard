'use client'

import React from 'react'
import Link from 'next/link'
import { vehicles } from '@/lib/dummyData'

const STAGE_THRESHOLDS = {
  inspected: 2 * 3600,       // 2 hours (in seconds)
  valeted: 3 * 3600,         // 3 hours
  workshop: 48 * 3600,       // 48 hours
  awaitingParts: 72 * 3600   // 72 hours
}

function secondsSince(ts?: string | null): number | null {
  if (!ts) return null
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  return Math.floor(diff)
}

// Helper function to capitalize progress text properly
function capitalizeProgress(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function BottleneckDetector() {
  const stuck = vehicles.map((v) => {
    // Calculate time in current stage
    const t = v.stage_timestamps || {}

    // Determine current stage heuristically
    let currentStage = 'Available'
    // Check status-based stages first
    if (v.availability_status === 'In Workshop') {
      currentStage = 'In Workshop'
    } else if (v.availability_status === 'Awaiting Documents') {
      currentStage = 'Awaiting Documents'
    } else if (v.availability_status === 'Awaiting Valet') {
      currentStage = 'Awaiting Valet'
    } else if (t.partsRequestedAt && v.availability_status !== 'Available') {
      // If parts were requested and vehicle is not available, it's awaiting parts
      currentStage = 'Awaiting Parts'
    }

    // Compute seconds since the relevant timestamp
    let secondsInStage: number | null = null
    if (currentStage === 'In Workshop') {
      secondsInStage = secondsSince(t.workshopInAt || t.inspectedAt)
    } else if (currentStage === 'Awaiting Parts') {
      secondsInStage = secondsSince(t.partsRequestedAt)
    } else if (currentStage === 'Awaiting Valet') {
      secondsInStage = secondsSince(t.valetedAt)
    } else if (currentStage === 'Available') {
      secondsInStage = secondsSince(t.valetedAt) || 0
    }

    // Determine severity
    let severity: 'ok' | 'warning' | 'critical' = 'ok'
    if (currentStage === 'In Workshop' && secondsInStage && secondsInStage > STAGE_THRESHOLDS.workshop) {
      severity = 'critical'
    }
    if (currentStage === 'Awaiting Parts' && secondsInStage && secondsInStage > STAGE_THRESHOLDS.awaitingParts) {
      severity = 'critical'
    }
    if (currentStage === 'Awaiting Valet' && secondsInStage && secondsInStage > STAGE_THRESHOLDS.valeted) {
      severity = 'warning'
    }

    return {
      id: v.id,
      vin: v.vin,
      registration: v.registration,
      model: v.model,
      currentStage,
      secondsInStage,
      severity,
      partner: v.rental_partner,
      currentProgress: v.currentProgress,
      lastUpdate: v.lastUpdate,
      vorUpdate: v.vorUpdate,
      partsInfo: v.partsInfo,
      workshopEta: v.workshopEta,
    }
  })
    .filter((x) => x.severity !== 'ok') // only show issues
    .sort((a, b) => {
      // Sort by severity first (critical > warning), then by duration (longest first)
      if (a.severity === 'critical' && b.severity !== 'critical') return -1
      if (a.severity !== 'critical' && b.severity === 'critical') return 1
      // Both same severity, sort by duration (longest first)
      const aDuration = a.secondsInStage || 0
      const bDuration = b.secondsInStage || 0
      return bDuration - aDuration
    })

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Service Delays</h3>
      {stuck.length === 0 && (
        <p className="text-sm text-gray-600">No service delays detected.</p>
      )}
      <ul>
        {stuck.map((s) => {
          const formatDuration = () => {
            if (!s.secondsInStage) return 'unknown'
            const totalHours = Math.floor(s.secondsInStage / 3600)
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
            <li key={s.id} className="mb-2 p-2 border rounded">
              <div className="flex justify-between items-center">
                <div className="flex-1 relative z-10">
                  {/* Duration at the top - highlighted in red for warning/critical */}
                  <div className={`text-lg font-bold mb-1 ${
                    s.severity === 'critical' 
                      ? 'text-red-600' 
                      : s.severity === 'warning'
                      ? 'text-red-500'
                      : 'text-gray-900'
                  }`}>
                    {formatDuration()}
                  </div>
                  <div className="font-medium text-gray-800">
                    {s.model} — {s.registration} ({s.vin})
                  </div>
                  {s.currentProgress && (
                    <div className="text-xs text-gray-600 mt-1">
                      Current Progress: {capitalizeProgress(s.currentProgress)}
                    </div>
                  )}
                </div>
                <div className="ml-4 relative z-10">
                  <Link
                    href={`/vor?vehicle=${s.id}`}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View in VOR
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}





