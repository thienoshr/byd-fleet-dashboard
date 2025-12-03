'use client'

import { useMemo } from 'react'
import { partners } from '@/lib/dummyData'

export default function PartnerPerformanceWidget() {
  const partnerStats = useMemo(() => {
    const sorted = [...partners].sort((a, b) => b.slaPercent - a.slaPercent)
    const topPartner = sorted[0]
    const bottomPartner = sorted[sorted.length - 1]
    const avgSla = partners.reduce((sum, p) => sum + p.slaPercent, 0) / partners.length

    return { topPartner, bottomPartner, avgSla: Math.round(avgSla) }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Partner Performance</h3>
      <div className="space-y-2 text-sm">
        <div>
          <div className="text-gray-600 mb-1">Top Performer</div>
          <div className="flex justify-between">
            <span className="font-medium">{partnerStats.topPartner.id}</span>
            <span className="font-semibold text-green-600">{partnerStats.topPartner.slaPercent}% SLA</span>
          </div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Needs Improvement</div>
          <div className="flex justify-between">
            <span className="font-medium">{partnerStats.bottomPartner.id}</span>
            <span className="font-semibold text-red-600">{partnerStats.bottomPartner.slaPercent}% SLA</span>
          </div>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-700 font-medium">Average SLA</span>
          <span className="font-semibold">{partnerStats.avgSla}%</span>
        </div>
      </div>
    </div>
  )
}





