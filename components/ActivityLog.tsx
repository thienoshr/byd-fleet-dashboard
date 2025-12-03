'use client'

import { useState, useMemo } from 'react'

export interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  category: 'vehicle' | 'agreement' | 'report' | 'system' | 'communication' | 'financial' | 'supplier' | 'buyback' | 'penalty' | 'breach' | 'workflow'
  details: string
  entityId?: string
  entityType?: string
  ipAddress?: string
  userAgent?: string
  changes?: {
    field: string
    oldValue: string
    newValue: string
  }[]
  relatedEntities?: {
    id: string
    type: string
    name: string
  }[]
}

// Mock activity log data
const mockActivities: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    user: 'John Smith',
    action: 'Exported Report',
    category: 'report',
    details: 'Exported Vehicles Report as CSV',
    entityId: 'report-vehicles-001',
    entityType: 'report',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    user: 'Sarah Johnson',
    action: 'Updated Vehicle Status',
    category: 'vehicle',
    details: 'Changed BYD-V002 status from "In Workshop" to "Available"',
    entityId: 'BYD-V002',
    entityType: 'vehicle',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    user: 'Mike Davis',
    action: 'Sent Email',
    category: 'communication',
    details: 'Sent "Vehicle Ready" email to Company Alpha',
    entityId: 'email-001',
    entityType: 'communication',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    user: 'John Smith',
    action: 'Created Agreement',
    category: 'agreement',
    details: 'Created new agreement C-015 for Beta Rentals',
    entityId: 'AG-015',
    entityType: 'agreement',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    user: 'Sarah Johnson',
    action: 'Requested Parts',
    category: 'vehicle',
    details: 'Requested parts for BYD-V003 from Manchester Depot',
    entityId: 'BYD-V003',
    entityType: 'vehicle',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    user: 'Mike Davis',
    action: 'Exported Report',
    category: 'report',
    details: 'Exported Agreements Report as PDF',
    entityId: 'report-agreements-002',
    entityType: 'report',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    user: 'John Smith',
    action: 'Updated Settings',
    category: 'system',
    details: 'Updated service delay threshold to 48 hours',
    entityId: 'settings',
    entityType: 'system',
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    user: 'Sarah Johnson',
    action: 'Allocated Vehicle',
    category: 'vehicle',
    details: 'Allocated BYD-V001 to Company Alpha',
    entityId: 'BYD-V001',
    entityType: 'vehicle',
  },
]

export default function ActivityLog() {
  const [activities] = useState<ActivityLogEntry[]>(mockActivities)
  const [filter, setFilter] = useState<'all' | ActivityLogEntry['category']>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesFilter = filter === 'all' || activity.category === filter
      const matchesSearch =
        searchQuery === '' ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [activities, filter, searchQuery])

  const getCategoryColor = (category: ActivityLogEntry['category']) => {
    switch (category) {
      case 'vehicle':
        return 'bg-blue-100 text-blue-800'
      case 'agreement':
        return 'bg-green-100 text-green-800'
      case 'report':
        return 'bg-purple-100 text-purple-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      case 'communication':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: ActivityLogEntry['category']) => {
    switch (category) {
      case 'vehicle':
        return '🚗'
      case 'agreement':
        return '📄'
      case 'report':
        return '📊'
      case 'system':
        return '⚙️'
      case 'communication':
        return '📧'
      default:
        return '📝'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
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
        {(['vehicle', 'agreement', 'report', 'system', 'communication'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors capitalize ${
              filter === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoryIcon(cat)} {cat}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{getCategoryIcon(activity.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{activity.user}</span>
                      <span className="text-sm text-gray-600">{activity.action}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



