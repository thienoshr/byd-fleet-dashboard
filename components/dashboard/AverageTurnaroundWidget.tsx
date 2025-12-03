'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function AverageTurnaroundWidget() {
  const avgTurnaround = useMemo(() => {
    const vehiclesWithTurnaround = vehicles.filter((v) => v.turnaround_seconds > 0)
    if (vehiclesWithTurnaround.length === 0) return { hours: 0, days: 0 }

    const avgSeconds = vehiclesWithTurnaround.reduce((sum, v) => sum + v.turnaround_seconds, 0) / vehiclesWithTurnaround.length
    const avgHours = Math.floor(avgSeconds / 3600)
    const avgDays = Math.floor(avgHours / 24)
    const remainingHours = avgHours % 24

    return { hours: remainingHours, days: avgDays, totalHours: avgHours }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Average Turnaround Time</h3>
      <div className="text-2xl font-bold text-primary-600 mb-1">
        {avgTurnaround.days > 0 ? `${avgTurnaround.days}d ${avgTurnaround.hours}h` : `${avgTurnaround.totalHours}h`}
      </div>
      <div className="text-xs text-gray-500">Average time from return to ready</div>
    </div>
  )
}





