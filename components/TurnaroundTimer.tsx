'use client'

import React from 'react'
import { vehicles } from '@/lib/dummyData'

function fmtSeconds(s: number | null | undefined): string {
  if (!s) return '—'
  const totalHours = Math.floor(s / 3600)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  return `${hours}h`
}

export default function TurnaroundTimer() {
  // Show top 5 longest turnaround_seconds
  const sorted = [...vehicles]
    .sort((a, b) => (b.turnaround_seconds || 0) - (a.turnaround_seconds || 0))
    .slice(0, 5)

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Longest Service Turnaround Time</h3>
      <ul className="space-y-2">
        {sorted.map((v) => (
          <li key={v.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div className="flex-1">
              <div className="font-medium text-sm">
                {v.model} • {v.registration}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {v.location}
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="font-semibold text-sm">{fmtSeconds(v.turnaround_seconds)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}





