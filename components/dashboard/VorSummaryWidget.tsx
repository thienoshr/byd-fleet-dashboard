'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'
import Link from 'next/link'

export default function VorSummaryWidget() {
  const vorBreakdown = useMemo(() => {
    const vorStatuses = ['In Workshop', 'Awaiting Parts', 'Awaiting Valet', 'Awaiting Documents', 'Awaiting Allocation']
    
    const breakdown = vorStatuses.reduce((acc, status) => {
      acc[status] = vehicles.filter((v) => v.availability_status === status).length
      return acc
    }, {} as Record<string, number>)

    const totalVor = Object.values(breakdown).reduce((sum, count) => sum + count, 0)

    return { breakdown, totalVor }
  }, [])

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">VOR Summary</h3>
        <Link href="/vor" className="text-xs text-primary-600 hover:text-primary-700">
          View All →
        </Link>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total VOR</span>
          <span className={`font-semibold ${vorBreakdown.totalVor > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {vorBreakdown.totalVor}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">In Workshop</span>
          <span className="font-semibold text-orange-400">{vorBreakdown.breakdown['In Workshop']}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Awaiting Parts</span>
          <span className="font-semibold text-yellow-500">{vorBreakdown.breakdown['Awaiting Parts']}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Awaiting Valet</span>
          <span className="font-semibold text-blue-400">{vorBreakdown.breakdown['Awaiting Valet']}</span>
        </div>
      </div>
    </div>
  )
}



