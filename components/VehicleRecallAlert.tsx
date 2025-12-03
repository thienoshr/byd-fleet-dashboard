'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'

interface VehicleRecallAlertProps {
  vehicle: Vehicle
}

export default function VehicleRecallAlert({ vehicle }: VehicleRecallAlertProps) {
  if (!vehicle.recall) return null

  const recall = vehicle.recall

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-600 text-white border-red-700'
      case 'High':
        return 'bg-orange-500 text-white border-orange-600'
      case 'Medium':
        return 'bg-yellow-500 text-white border-yellow-600'
      case 'Low':
        return 'bg-blue-500 text-white border-blue-600'
      default:
        return 'bg-gray-500 text-white border-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const isOverdue = recall.dueDate && new Date(recall.dueDate) < new Date() && recall.status !== 'Completed'

  return (
    <div className={`p-4 rounded-lg border-2 ${getSeverityColor(recall.severity)} mb-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚠️</span>
            <h4 className="font-bold text-lg">Vehicle Recall Alert</h4>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getStatusColor(recall.status)}`}>
              {recall.status}
            </span>
          </div>
          <div className="text-sm font-semibold mb-1">{recall.title}</div>
          <div className="text-xs opacity-90">Recall ID: {recall.id}</div>
        </div>
        {isOverdue && (
          <div className="bg-red-700 text-white px-3 py-1 rounded text-xs font-bold animate-pulse">
            OVERDUE
          </div>
        )}
      </div>

      <div className="bg-white bg-opacity-20 rounded p-3 mb-3">
        <div className="text-sm mb-2">{recall.description}</div>
        {recall.affectedComponent && (
          <div className="text-xs mb-1">
            <span className="font-semibold">Affected Component:</span> {recall.affectedComponent}
          </div>
        )}
        {recall.remedy && (
          <div className="text-xs">
            <span className="font-semibold">Remedy:</span> {recall.remedy}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="font-semibold opacity-90">Issued:</span>
          <span className="ml-2">{formatDate(recall.issuedDate)}</span>
        </div>
        {recall.dueDate && (
          <div>
            <span className="font-semibold opacity-90">Due Date:</span>
            <span className={`ml-2 ${isOverdue ? 'font-bold' : ''}`}>
              {formatDate(recall.dueDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}



