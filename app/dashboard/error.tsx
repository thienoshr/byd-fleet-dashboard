'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h2>
      <p className="text-gray-600 mb-6">{error.message || 'Failed to load dashboard'}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}








