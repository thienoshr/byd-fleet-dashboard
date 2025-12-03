'use client'

import { useMemo } from 'react'
import { agreementsFull } from '@/lib/dummyData'

export default function ContractValueAtRiskWidget() {
  const contractValue = useMemo(() => {
    const now = new Date()
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringSoon = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate >= now && endDate <= next30Days && a.stage !== 'Closed'
    })

    // Estimate value (in a real app, this would come from actual contract values)
    const estimatedValuePerContract = 5000 // Placeholder
    const totalValue = expiringSoon.length * estimatedValuePerContract

    return {
      count: expiringSoon.length,
      estimatedValue: totalValue,
    }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Value at Risk</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Expiring (30 days)</span>
          <span className={`font-semibold ${contractValue.count > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {contractValue.count}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-700 font-medium">Est. Value</span>
          <span className="font-semibold">£{contractValue.estimatedValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}





