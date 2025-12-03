'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'
import VehicleRecallAlert from './VehicleRecallAlert'

interface VehicleHealthPanelProps {
  vehicle: Vehicle | null
}

export default function VehicleHealthPanel({ vehicle }: VehicleHealthPanelProps) {
  if (!vehicle) return null

  const h = vehicle.health || {}

  // Calculate days until MOT expiry
  const getDaysUntilMOT = () => {
    if (!h.motExpiry) return null
    const motDate = new Date(h.motExpiry)
    if (isNaN(motDate.getTime())) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    motDate.setHours(0, 0, 0, 0)
    const diffTime = motDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate days since last OTA
  const getDaysSinceOTA = () => {
    if (!h.lastOta) return null
    const otaDate = new Date(h.lastOta)
    if (isNaN(otaDate.getTime())) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    otaDate.setHours(0, 0, 0, 0)
    const diffTime = today.getTime() - otaDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get battery health color
  const getBatteryHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600'
    if (health >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get health status text
  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Poor'
  }

  const daysUntilMOT = getDaysUntilMOT()
  const daysSinceOTA = getDaysSinceOTA()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Recall Alert */}
      {vehicle.recall && <VehicleRecallAlert vehicle={vehicle} />}
      
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Vehicle Health</h3>
      
      {/* Health Score Section */}
      <div className="mb-4 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-600">Overall Health Score</div>
          <div className={`text-xs font-medium ${getHealthScoreColor(h.healthScore ?? 0)}`}>
            {getHealthStatus(h.healthScore ?? 0)}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className={`font-bold text-3xl ${getHealthScoreColor(h.healthScore ?? 0)}`}>
            {h.healthScore ?? '—'}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              (h.healthScore ?? 0) >= 80 ? 'bg-green-500' :
              (h.healthScore ?? 0) >= 65 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${h.healthScore ?? 0}%` }}
          />
        </div>
      </div>

      {/* Battery Health Section */}
      <div className="mb-4 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-600">Battery Health</div>
          <div className={`text-xs font-medium ${getBatteryHealthColor(h.batteryHealth ?? 0)}`}>
            {h.batteryHealth && h.batteryHealth >= 90 ? 'Optimal' :
             h.batteryHealth && h.batteryHealth >= 75 ? 'Good' :
             h.batteryHealth && h.batteryHealth >= 60 ? 'Fair' : 'Low'}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className={`font-bold text-2xl ${getBatteryHealthColor(h.batteryHealth ?? 0)}`}>
            {h.batteryHealth ?? '—'}%
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              (h.batteryHealth ?? 0) >= 90 ? 'bg-green-500' :
              (h.batteryHealth ?? 0) >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${h.batteryHealth ?? 0}%` }}
          />
        </div>
      </div>

      {/* OTA Update Section */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-xs text-gray-600 mb-1">Last OTA Update</div>
        <div className="text-sm font-medium">{h.lastOta ? formatDate(h.lastOta) : '—'}</div>
        {daysSinceOTA !== null && (
          <div className="text-xs text-gray-500 mt-1">
            {daysSinceOTA === 0 ? 'Today' :
             daysSinceOTA === 1 ? '1 day ago' :
             `${daysSinceOTA} days ago`}
          </div>
        )}
      </div>

      {/* MOT Expiry Section */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-xs text-gray-600 mb-1">MOT Expiry</div>
        <div className="text-sm font-medium">{h.motExpiry ? formatDate(h.motExpiry) : '—'}</div>
        {daysUntilMOT !== null && (
          <div className={`text-xs mt-1 ${
            daysUntilMOT <= 30 ? 'text-red-600 font-medium' :
            daysUntilMOT <= 60 ? 'text-yellow-600 font-medium' : 'text-gray-500'
          }`}>
            {daysUntilMOT < 0 ? `Expired ${Math.abs(daysUntilMOT)} days ago` :
             daysUntilMOT === 0 ? 'Expires today' :
             daysUntilMOT <= 30 ? `Expires in ${daysUntilMOT} days` :
             `Valid for ${daysUntilMOT} days`}
          </div>
        )}
      </div>

      {/* Fault Codes Section */}
      {h.faultCodes && h.faultCodes.length > 0 ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-600">Active Fault Codes</div>
            <div className="text-xs font-medium text-red-600">{h.faultCodes.length} active</div>
          </div>
          <div className="space-y-1">
            {h.faultCodes.map((f, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 p-2 rounded text-sm">
                <div className="font-mono font-medium text-red-700">{f}</div>
                <div className="text-xs text-red-600 mt-1">
                  {f.startsWith('P0') ? 'Powertrain fault' :
                   f.startsWith('B') ? 'Body control fault' :
                   f.startsWith('C') ? 'Chassis fault' :
                   f.startsWith('D') ? 'Network fault' : 'System fault'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-1">Fault Codes</div>
          <div className="text-sm text-green-600 font-medium">No active fault codes</div>
        </div>
      )}

      {/* Health Warnings */}
      {h.healthScore && h.healthScore < 65 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <div className="font-medium text-sm mb-1">⚠ Health Warning</div>
          <div className="text-xs">Vehicle health is below recommended threshold. Consider scheduling a workshop inspection.</div>
        </div>
      )}

      {h.batteryHealth && h.batteryHealth < 75 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
          <div className="font-medium text-sm mb-1">⚠ Battery Warning</div>
          <div className="text-xs">Battery health is below optimal. Monitor charging patterns and consider battery assessment.</div>
        </div>
      )}

      {daysUntilMOT !== null && daysUntilMOT <= 30 && daysUntilMOT > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
          <div className="font-medium text-sm mb-1">⚠ MOT Expiring Soon</div>
          <div className="text-xs">MOT certificate expires in {daysUntilMOT} days. Schedule MOT test to avoid expiry.</div>
        </div>
      )}

      {daysUntilMOT !== null && daysUntilMOT < 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <div className="font-medium text-sm mb-1">⚠ MOT Expired</div>
          <div className="text-xs">MOT certificate expired {Math.abs(daysUntilMOT)} days ago. Vehicle must not be driven until MOT is renewed.</div>
        </div>
      )}
    </div>
  )
}







