'use client'

import { useState, useEffect } from 'react'

interface ExportHistoryEntry {
  id: string
  timestamp: string
  reportType: string
  format: 'CSV' | 'PDF'
  fileName: string
  recordCount: number
  user: string
}

export default function ExportHistoryPage() {
  const [exports, setExports] = useState<ExportHistoryEntry[]>([])
  const [filter, setFilter] = useState<'all' | 'CSV' | 'PDF'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load export history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('exportHistory')
    if (saved) {
      try {
        setExports(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load export history:', e)
      }
    } else {
      // Mock data for demo
      const mockExports: ExportHistoryEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          reportType: 'Vehicles',
          format: 'CSV',
          fileName: 'vehicles_report_2025-02-07.csv',
          recordCount: 10,
          user: 'John Smith',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          reportType: 'Agreements',
          format: 'PDF',
          fileName: 'agreements_report_2025-02-07.pdf',
          recordCount: 15,
          user: 'Sarah Johnson',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          reportType: 'Fleet Availability',
          format: 'CSV',
          fileName: 'fleet_availability_2025-02-07.csv',
          recordCount: 10,
          user: 'Mike Davis',
        },
      ]
      setExports(mockExports)
      localStorage.setItem('exportHistory', JSON.stringify(mockExports))
    }
  }, [])

  const filteredExports = exports.filter((exp) => {
    const matchesFilter = filter === 'all' || exp.format === filter
    const matchesSearch =
      searchQuery === '' ||
      exp.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.user.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  const handleDownload = (exportEntry: ExportHistoryEntry) => {
    // In a real app, this would download the file
    alert(`Downloading ${exportEntry.fileName}...`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this export record?')) {
      const updated = exports.filter((e) => e.id !== id)
      setExports(updated)
      localStorage.setItem('exportHistory', JSON.stringify(updated))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export History</h1>
        <p className="mt-2 text-gray-600">
          View and manage all exported reports
        </p>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="flex gap-4 mb-4 flex-wrap items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('CSV')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === 'CSV'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CSV
            </button>
            <button
              onClick={() => setFilter('PDF')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === 'PDF'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PDF
            </button>
          </div>
          <input
            type="text"
            placeholder="Search exports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Exports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Report Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Format</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">File Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Records</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No exports found
                  </td>
                </tr>
              ) : (
                filteredExports.map((exportEntry) => (
                  <tr key={exportEntry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{formatTime(exportEntry.timestamp)}</td>
                    <td className="py-3 px-4 font-medium">{exportEntry.reportType}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          exportEntry.format === 'CSV'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {exportEntry.format}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{exportEntry.fileName}</td>
                    <td className="py-3 px-4">{exportEntry.recordCount}</td>
                    <td className="py-3 px-4">{exportEntry.user}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(exportEntry)}
                          className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(exportEntry.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



