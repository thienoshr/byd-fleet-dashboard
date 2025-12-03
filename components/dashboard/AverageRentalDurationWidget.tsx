'use client'

import { useMemo } from 'react'
import { agreementsFull } from '@/lib/dummyData'

export default function AverageRentalDurationWidget() {
  const avgDuration = useMemo(() => {
    const activeAgreements = agreementsFull.filter((a) => a.stage !== 'Closed' && a.stage !== 'Vehicle Returned')
    
    if (activeAgreements.length === 0) return { days: 0 }

    const totalDays = activeAgreements.reduce((sum, a) => {
      const start = new Date(a.startAt)
      const end = new Date(a.endAt)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)

    const avgDays = Math.round(totalDays / activeAgreements.length)
    const weeks = Math.floor(avgDays / 7)
    const remainingDays = avgDays % 7

    return { days: avgDays, weeks: weeks || 0, remainingDays: remainingDays || 0 }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Average Rental Duration</h3>
      <div className="text-2xl font-bold text-primary-600 mb-1">
        {avgDuration.weeks && avgDuration.weeks > 0 ? `${avgDuration.weeks}w ${avgDuration.remainingDays || 0}d` : `${avgDuration.days}d`}
      </div>
      <div className="text-xs text-gray-500">Average active agreement length</div>
    </div>
  )
}

