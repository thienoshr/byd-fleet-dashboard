'use client'

import { exportToCSV, exportToPDF } from '@/lib/export'

/**
 * Export Buttons component
 * Provides buttons to export reports in CSV and PDF formats
 */
interface ExportButtonsProps {
  reportType: 'summary' | 'vehicles' | 'agreements' | 'contract-metrics' | 'utilization-analysis' | 'financial' | 'compliance' | 'supplier-performance' | 'partners' | 'utilisation' | 'fleet-availability' | 'drivers' | 'health' | 'vor' | 'analytics'
}

export default function ExportButtons({ reportType }: ExportButtonsProps) {
  const handleCSVExport = async () => {
    try {
      await exportToCSV(reportType)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to export CSV. Please try again.')
    }
  }

  const handlePDFExport = async () => {
    try {
      await exportToPDF(reportType)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleCSVExport}
        className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-1.5 text-xs"
      >
        <span className="text-xs">📄</span>
        <span>Export CSV</span>
      </button>
      <button
        onClick={handlePDFExport}
        className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-1.5 text-xs"
      >
        <span className="text-xs">📑</span>
        <span>Export PDF</span>
      </button>
    </div>
  )
}








