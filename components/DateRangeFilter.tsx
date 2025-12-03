'use client'

import { useState } from 'react'

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void
  label?: string
}

export default function DateRangeFilter({ onDateRangeChange, label = 'Date Range' }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [preset, setPreset] = useState<string>('')

  const handlePresetChange = (presetValue: string) => {
    setPreset(presetValue)
    const today = new Date()
    let start: Date | null = null
    let end: Date | null = null

    switch (presetValue) {
      case 'today':
        start = new Date(today)
        end = new Date(today)
        break
      case 'yesterday':
        start = new Date(today)
        start.setDate(start.getDate() - 1)
        end = new Date(start)
        break
      case 'last7days':
        start = new Date(today)
        start.setDate(start.getDate() - 7)
        end = new Date(today)
        break
      case 'last30days':
        start = new Date(today)
        start.setDate(start.getDate() - 30)
        end = new Date(today)
        break
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today)
        break
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today)
        break
      case 'custom':
        setStartDate('')
        setEndDate('')
        onDateRangeChange(null, null)
        return
      default:
        return
    }

    if (start && end) {
      const startStr = start.toISOString().split('T')[0]
      const endStr = end.toISOString().split('T')[0]
      setStartDate(startStr)
      setEndDate(endStr)
      onDateRangeChange(startStr, endStr)
    }
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    setPreset('custom')
    onDateRangeChange(value || null, endDate || null)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    setPreset('custom')
    onDateRangeChange(startDate || null, value || null)
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setPreset('')
    onDateRangeChange(null, null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {(startDate || endDate) && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last7days', label: 'Last 7 Days' },
          { value: 'last30days', label: 'Last 30 Days' },
          { value: 'thisMonth', label: 'This Month' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'thisYear', label: 'This Year' },
          { value: 'custom', label: 'Custom' },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => handlePresetChange(p.value)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              preset === p.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}



