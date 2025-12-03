'use client'

import { useMemo } from 'react'
import { vehicles, agreementsFull } from '@/lib/dummyData'

export default function RecentActivityFeedWidget() {
  const recentActivity = useMemo(() => {
    const activities: Array<{ type: string; description: string; time: string; icon: string }> = []

    // Get recent vehicle updates
    vehicles
      .filter((v) => v.lastUpdate)
      .sort((a, b) => new Date(b.lastUpdate || 0).getTime() - new Date(a.lastUpdate || 0).getTime())
      .slice(0, 3)
      .forEach((v) => {
        activities.push({
          type: 'vehicle',
          description: `${v.model} (${v.registration}) - ${v.currentProgress || 'Status updated'}`,
          time: v.lastUpdate || '',
          icon: '🚗',
        })
      })

    // Get recent agreement changes
    agreementsFull
      .filter((a) => a.timestamps.collectedAt || a.timestamps.returnedAt)
      .sort((a, b) => {
        const aTime = a.timestamps.returnedAt || a.timestamps.collectedAt || ''
        const bTime = b.timestamps.returnedAt || b.timestamps.collectedAt || ''
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      .slice(0, 2)
      .forEach((a) => {
        if (a.timestamps.returnedAt) {
          activities.push({
            type: 'agreement',
            description: `Vehicle returned - ${a.agreementId}`,
            time: a.timestamps.returnedAt,
            icon: '📥',
          })
        } else if (a.timestamps.collectedAt) {
          activities.push({
            type: 'agreement',
            description: `Vehicle collected - ${a.agreementId}`,
            time: a.timestamps.collectedAt,
            icon: '📤',
          })
        }
      })

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
      <div className="space-y-2 text-sm">
        {recentActivity.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No recent activity</div>
        ) : (
          recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0">
              <span className="text-lg">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 truncate">{activity.description}</div>
                <div className="text-xs text-gray-500">{formatTime(activity.time)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



