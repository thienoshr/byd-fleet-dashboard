'use client'

import { useMemo } from 'react'
import { agreementsFull } from '@/lib/dummyData'

export default function VehiclesReturningWidget() {
  const returning = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const returningToday = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      return endDateOnly.getTime() === today.getTime() && a.stage !== 'Closed'
    }).length

    const returningThisWeek = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate >= today && endDate <= next7Days && a.stage !== 'Closed'
    }).length

    return { returningToday, returningThisWeek }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicles Returning</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Today</span>
          <span className={`font-semibold ${returning.returningToday > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
            {returning.returningToday}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">This Week</span>
          <span className={`font-semibold ${returning.returningThisWeek > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
            {returning.returningThisWeek}
          </span>
        </div>
      </div>
    </div>
  )
}





