'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function PartsOrdersPendingWidget() {
  const partsPending = useMemo(() => {
    const now = new Date()
    
    const pendingOrders = vehicles.filter((v) => {
      return v.partsInfo && v.partsInfo.eta && new Date(v.partsInfo.eta) > now
    }).length

    const overdueOrders = vehicles.filter((v) => {
      if (!v.partsInfo || !v.partsInfo.eta) return false
      const eta = new Date(v.partsInfo.eta)
      return eta < now && v.availability_status !== 'Available'
    }).length

    return { pendingOrders, overdueOrders }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Parts Orders Pending</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Pending Orders</span>
          <span className={`font-semibold ${partsPending.pendingOrders > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {partsPending.pendingOrders}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Overdue Orders</span>
          <span className={`font-semibold ${partsPending.overdueOrders > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {partsPending.overdueOrders}
          </span>
        </div>
      </div>
    </div>
  )
}





