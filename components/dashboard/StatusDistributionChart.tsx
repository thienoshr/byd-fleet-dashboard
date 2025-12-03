'use client'

import { useMemo, useState, useEffect } from 'react'
import { vehicles } from '@/lib/dummyData'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function StatusDistributionChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const statusData = useMemo(() => {
    const statusCounts = vehicles.reduce((acc, v) => {
      acc[v.availability_status] = (acc[v.availability_status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const colors: Record<string, string> = {
      'Available': '#10b981',
      'On Hire': '#f97316',
      'In Workshop': '#ef4444',
      'Awaiting Valet': '#eab308',
      'Awaiting Parts': '#f59e0b',
      'Awaiting Documents': '#8b5cf6',
      'Awaiting Allocation': '#6366f1',
      'With Partner': '#3b82f6',
      'Delivering': '#06b6d4',
    }

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#6b7280',
    }))
  }, [])

  if (!mounted) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Distribution</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

