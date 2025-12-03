'use client'

import { useState, useEffect } from 'react'
import { vehicles, agreementsFull, suppliers } from '@/lib/dummyData'

export type NotificationType = 'critical' | 'warning' | 'info' | 'success'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Generate notifications based on data
  useEffect(() => {
    const newNotifications: Notification[] = []

    // Check for service delays
    const criticalVehicles = vehicles.filter((v) => {
      const t = v.stage_timestamps || {}
      const workshopIn = t.workshopInAt ? (Date.now() - new Date(t.workshopInAt).getTime()) / (1000 * 60 * 60) : 0
      const partsRequested = t.partsRequestedAt ? (Date.now() - new Date(t.partsRequestedAt).getTime()) / (1000 * 60 * 60) : 0
      return (v.availability_status === 'In Workshop' && workshopIn > 48) || 
             (t.partsRequestedAt && v.availability_status !== 'Available' && partsRequested > 72)
    })

    criticalVehicles.forEach((v) => {
      newNotifications.push({
        id: `critical-${v.id}`,
        type: 'critical',
        title: 'Service Delays',
        message: `${v.model} (${v.registration}) has been stuck for over threshold`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/operations',
      })
    })

    // Check for overdue agreements
    const overdueAgreements = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate < new Date() && a.stage !== 'Closed'
    })

    overdueAgreements.forEach((a) => {
      newNotifications.push({
        id: `overdue-${a.id}`,
        type: 'warning',
        title: 'Overdue Agreement',
        message: `Contract ${a.agreementId} for ${a.customer} is overdue`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/agreements',
      })
    })

    // Check for contracts expiring soon
    const expiringAgreements = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      const daysUntil = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 && daysUntil > 0 && a.stage !== 'Closed'
    })

    expiringAgreements.forEach((a) => {
      newNotifications.push({
        id: `expiring-${a.id}`,
        type: 'warning',
        title: 'Contract Expiring Soon',
        message: `Contract ${a.agreementId} expires in ${Math.ceil((new Date(a.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/agreements',
      })
    })

    // Check for high-risk vehicles
    const highRiskVehicles = vehicles.filter((v) => v.risk_level === 'High')
    if (highRiskVehicles.length > 0) {
      newNotifications.push({
        id: 'high-risk-summary',
        type: 'warning',
        title: 'High-Risk Vehicles',
        message: `${highRiskVehicles.length} vehicle(s) flagged as high risk`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/vehicles',
      })
    }

    // Check for penalties pending
    const pendingPenalties = agreementsFull.filter((a) => {
      return a.penalties && a.penalties.some(p => p.status === 'pending')
    })

    if (pendingPenalties.length > 0) {
      const totalPendingAmount = pendingPenalties.reduce((sum, a) => {
        if (a.penalties) {
          return sum + a.penalties.filter(p => p.status === 'pending').reduce((pSum, p) => pSum + p.amount, 0)
        }
        return sum
      }, 0)

      newNotifications.push({
        id: 'pending-penalties',
        type: 'warning',
        title: 'Pending Penalties',
        message: `${pendingPenalties.length} contract(s) have pending penalties totaling ${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(totalPendingAmount)}`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/agreements',
      })
    }

    // Check for unresolved breaches
    const unresolvedBreaches = agreementsFull.filter((a) => {
      return a.breaches && a.breaches.some(b => !b.resolved)
    })

    if (unresolvedBreaches.length > 0) {
      const criticalBreaches = unresolvedBreaches.filter((a) => {
        return a.breaches && a.breaches.some(b => !b.resolved && b.severity === 'critical')
      })

      newNotifications.push({
        id: 'unresolved-breaches',
        type: criticalBreaches.length > 0 ? 'critical' : 'warning',
        title: 'Unresolved Breaches',
        message: `${unresolvedBreaches.length} contract(s) have unresolved breaches${criticalBreaches.length > 0 ? ` (${criticalBreaches.length} critical)` : ''}`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/agreements',
      })
    }

    // Check for document renewals
    const expiringDocuments = suppliers.flatMap(s => s.documents).filter(d => {
      if (d.expiryDate) {
        const expiryDate = new Date(d.expiryDate)
        const daysUntil = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysUntil <= 30 && daysUntil > 0 && d.status !== 'expired'
      }
      return false
    })

    if (expiringDocuments.length > 0) {
      newNotifications.push({
        id: 'expiring-documents',
        type: 'info',
        title: 'Documents Expiring Soon',
        message: `${expiringDocuments.length} document(s) expiring within 30 days`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/documents',
      })
    }

    // Preserve read state from existing notifications
    setNotifications((prev) => {
      const readStateMap = new Map(prev.map(n => [n.id, n.read]))
      return newNotifications.map(n => ({
        ...n,
        read: readStateMap.get(n.id) ?? false
      }))
    })
  }, [])

  // Update unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'success':
        return '✅'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
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
    return `${day}/${month}/${year}`
  }

  return (
    <div className="relative flex-shrink-0">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
        aria-label="Notifications"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[10001]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[10002] max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id)
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

