'use client'

import { useMemo, useState, useEffect } from 'react'
import { vehiclesWithRisk } from '@/lib/dummyData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function RiskScoreDistributionChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const riskData = useMemo(() => {
    const ranges = [
      { range: '0-1', min: 0, max: 1 },
      { range: '1-2', min: 1, max: 2 },
      { range: '2-3', min: 2, max: 3 },
      { range: '3-4', min: 3, max: 4 },
      { range: '4-5', min: 4, max: 5 },
      { range: '5+', min: 5, max: Infinity },
    ]

    return ranges.map(({ range, min, max }) => ({
      range,
      count: vehiclesWithRisk.filter((v) => v.risk_score >= min && (max === Infinity || v.risk_score < max)).length,
    }))
  }, [])

  if (!mounted) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Score Distribution</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Score Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={riskData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

