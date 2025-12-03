/**
 * Utility functions for tracking export history
 */

export interface ExportHistoryEntry {
  id: string
  timestamp: string
  reportType: string
  format: 'CSV' | 'PDF'
  fileName: string
  recordCount: number
  user: string
}

export function addToExportHistory(
  reportType: string,
  format: 'CSV' | 'PDF',
  fileName: string,
  recordCount: number,
  user: string = 'Current User'
) {
  const entry: ExportHistoryEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    reportType,
    format,
    fileName,
    recordCount,
    user,
  }

  const history = getExportHistory()
  history.unshift(entry)
  // Keep only last 100 exports
  const limited = history.slice(0, 100)
  localStorage.setItem('exportHistory', JSON.stringify(limited))
}

export function getExportHistory(): ExportHistoryEntry[] {
  const saved = localStorage.getItem('exportHistory')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load export history:', e)
    }
  }
  return []
}








