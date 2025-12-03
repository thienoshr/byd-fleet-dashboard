'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Utilisation } from '../schema'

/**
 * UtilisationChart component
 * Displays weekly fleet utilisation as a line chart
 * 
 * @param data - Array of utilisation data points with date and utilisation percentage
 */
interface UtilisationChartProps {
  data: Utilisation[]
}

export default function UtilisationChart({ data }: UtilisationChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Format date for display (show day and month)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  // Format utilisation percentage
  const formatUtilisation = (value: number) => {
    return `${value}%`
  }

  // Check if data is valid
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Weekly Fleet Utilisation
        </h3>
        <p className="text-gray-500">No utilisation data available</p>
      </div>
    )
  }

  // Wait for client-side mount to avoid hydration issues
  if (!mounted) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Weekly Fleet Utilisation
        </h3>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Weekly Fleet Utilisation
      </h3>
      <div className="w-full" style={{ height: '200px', minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart 
            data={data} 
            margin={{ top: 5, right: 5, bottom: 30, left: 20 }}
            width={300}
            height={200}
          >
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              style={{ fontSize: '12px' }}
              label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={formatUtilisation}
              style={{ fontSize: '12px' }}
              label={{ value: 'Utilisation (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
            />
            <Tooltip
              labelFormatter={(label) => formatDate(label as string)}
              formatter={(value: number) => [`${value}%`, 'Utilisation']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="utilisation"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}



