'use client'

import { useMemo } from 'react'
import { agreementsFull } from '@/lib/dummyData'

export default function VehiclesGoingOutWidget() {
  const goingOut = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const goingOutToday = agreementsFull.filter((a) => {
      const startDate = new Date(a.startAt)
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      return startDateOnly.getTime() === today.getTime() && a.stage !== 'Closed'
    }).length

    const goingOutThisWeek = agreementsFull.filter((a) => {
      const startDate = new Date(a.startAt)
      return startDate >= today && startDate <= next7Days && a.stage !== 'Closed'
    }).length

    return { goingOutToday, goingOutThisWeek }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicles Going Out</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Today</span>
          <span className={`font-semibold ${goingOut.goingOutToday > 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {goingOut.goingOutToday}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">This Week</span>
          <span className={`font-semibold ${goingOut.goingOutThisWeek > 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {goingOut.goingOutThisWeek}
          </span>
        </div>
      </div>
    </div>
  )
}








