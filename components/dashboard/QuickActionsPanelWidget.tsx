'use client'

import Link from 'next/link'

export default function QuickActionsPanelWidget() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/vehicles"
          className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors text-center"
        >
          Allocate Vehicle
        </Link>
        <Link
          href="/vor"
          className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
        >
          View VOR
        </Link>
        <Link
          href="/reports"
          className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-center"
        >
          Generate Report
        </Link>
        <Link
          href="/communications"
          className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-center"
        >
          Send Email
        </Link>
      </div>
    </div>
  )
}





