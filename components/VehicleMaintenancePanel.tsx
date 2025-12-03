'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'

interface VehicleMaintenancePanelProps {
  vehicle: Vehicle | null
}

interface MaintenanceRecord {
  date: string
  type: string
  description: string
  cost: number
  mileage?: number
  provider: string
  nextDue?: string
}

export default function VehicleMaintenancePanel({ vehicle }: VehicleMaintenancePanelProps) {
  if (!vehicle) return null

  // Mock maintenance history - in real app, this would come from API
  const maintenanceHistory: MaintenanceRecord[] = [
    {
      date: '2024-12-15',
      type: 'Service',
      description: 'Annual service - Battery check, software update',
      cost: 250,
      mileage: 15000,
      provider: 'BYD Service Center',
      nextDue: '2025-12-15'
    },
    {
      date: '2024-09-20',
      type: 'Repair',
      description: 'Brake pad replacement',
      cost: 180,
      mileage: 12000,
      provider: 'London Workshop'
    },
    {
      date: '2024-06-10',
      type: 'Service',
      description: '6-month service - Tire rotation, fluid check',
      cost: 120,
      mileage: 8000,
      provider: 'BYD Service Center'
    },
    {
      date: '2024-03-05',
      type: 'Inspection',
      description: 'Pre-rental inspection',
      cost: 50,
      mileage: 5000,
      provider: 'Fleet Operations'
    }
  ]

  const upcomingServices = [
    {
      type: 'Service',
      dueDate: '2025-03-15',
      description: '6-month service due',
      priority: 'medium' as const
    },
    {
      type: 'Inspection',
      dueDate: '2025-02-01',
      description: 'Pre-rental inspection',
      priority: 'high' as const
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const totalMaintenanceCost = maintenanceHistory.reduce((sum, record) => sum + record.cost, 0)

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
        <div>
          <div className="text-xs text-gray-600 mb-1">Total Maintenance Cost</div>
          <div className="text-lg font-semibold">£{totalMaintenanceCost.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Service Records</div>
          <div className="text-lg font-semibold">{maintenanceHistory.length}</div>
        </div>
      </div>

      {/* Upcoming Services */}
      {upcomingServices.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <div className="text-xs text-gray-600 mb-2 font-medium">Upcoming Services</div>
          <div className="space-y-2">
            {upcomingServices.map((service, idx) => {
              const daysUntil = getDaysUntil(service.dueDate)
              return (
                <div
                  key={idx}
                  className={`p-2 rounded border ${
                    service.priority === 'high' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{service.type}</div>
                    <div className={`text-xs ${
                      daysUntil !== null && daysUntil <= 7 ? 'text-red-600 font-medium' :
                      daysUntil !== null && daysUntil <= 30 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {daysUntil !== null && daysUntil < 0 ? `Overdue ${Math.abs(daysUntil)} days` :
                       daysUntil !== null && daysUntil === 0 ? 'Due today' :
                       daysUntil !== null ? `${daysUntil} days` : formatDate(service.dueDate)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{service.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Maintenance History */}
      <div>
        <div className="text-xs text-gray-600 mb-2 font-medium">Recent Service Records</div>
        <div className="space-y-3">
          {maintenanceHistory.slice(0, 4).map((record, idx) => (
            <div key={idx} className="border-b pb-3 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{record.type}</div>
                <div className="text-sm font-semibold">£{record.cost}</div>
              </div>
              <div className="text-xs text-gray-600 mb-1">{record.description}</div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>{formatDate(record.date)}</div>
                <div>{record.provider}</div>
              </div>
              {record.mileage && (
                <div className="text-xs text-gray-500 mt-1">Mileage: {record.mileage.toLocaleString()} km</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



