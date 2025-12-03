'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'

interface VehicleCompliancePanelProps {
  vehicle: Vehicle | null
}

interface ComplianceDocument {
  type: string
  number: string
  issueDate: string
  expiryDate: string
  status: 'Valid' | 'Expiring' | 'Expired'
  issuer: string
}

export default function VehicleCompliancePanel({ vehicle }: VehicleCompliancePanelProps) {
  if (!vehicle) return null

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

  // Mock compliance documents - in real app, this would come from API
  const documents: ComplianceDocument[] = [
    {
      type: 'MOT Certificate',
      number: 'MOT-2024-12345',
      issueDate: '2024-03-01',
      expiryDate: vehicle.health.motExpiry,
      status: getDaysUntil(vehicle.health.motExpiry) !== null && getDaysUntil(vehicle.health.motExpiry)! < 0 ? 'Expired' :
              getDaysUntil(vehicle.health.motExpiry) !== null && getDaysUntil(vehicle.health.motExpiry)! <= 30 ? 'Expiring' : 'Valid',
      issuer: 'DVSA'
    },
    {
      type: 'Insurance',
      number: 'INS-2024-67890',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'Valid',
      issuer: 'Fleet Insurance Co.'
    },
    {
      type: 'Road Tax',
      number: 'TAX-2024-11111',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      status: 'Valid',
      issuer: 'DVLA'
    },
    {
      type: 'Registration Document',
      number: vehicle.registration,
      issueDate: '2023-01-01',
      expiryDate: 'N/A',
      status: 'Valid',
      issuer: 'DVLA'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid': return 'bg-green-100 text-green-700 border-green-200'
      case 'Expiring': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Expired': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const validCount = documents.filter(d => d.status === 'Valid').length
  const expiringCount = documents.filter(d => d.status === 'Expiring').length
  const expiredCount = documents.filter(d => d.status === 'Expired').length

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Compliance & Documents</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b">
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-600">{validCount}</div>
          <div className="text-xs text-gray-600">Valid</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="text-lg font-bold text-yellow-600">{expiringCount}</div>
          <div className="text-xs text-gray-600">Expiring</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="text-lg font-bold text-red-600">{expiredCount}</div>
          <div className="text-xs text-gray-600">Expired</div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        {documents.map((doc, idx) => {
          const daysUntil = doc.expiryDate !== 'N/A' ? getDaysUntil(doc.expiryDate) : null
          return (
            <div
              key={idx}
              className={`p-3 rounded border ${getStatusColor(doc.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">{doc.type}</div>
                <div className={`text-xs px-2 py-1 rounded font-medium ${
                  doc.status === 'Valid' ? 'bg-green-200' :
                  doc.status === 'Expiring' ? 'bg-yellow-200' : 'bg-red-200'
                }`}>
                  {doc.status}
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-1">Number: {doc.number}</div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Issued: </span>
                  <span className="font-medium">{formatDate(doc.issueDate)}</span>
                </div>
                {doc.expiryDate !== 'N/A' && (
                  <div>
                    <span className="text-gray-500">Expires: </span>
                    <span className={`font-medium ${
                      daysUntil !== null && daysUntil <= 30 ? 'text-red-600' :
                      daysUntil !== null && daysUntil <= 60 ? 'text-yellow-600' : ''
                    }`}>
                      {formatDate(doc.expiryDate)}
                    </span>
                    {daysUntil !== null && (
                      <span className="ml-1 text-gray-500">
                        ({daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` :
                          daysUntil === 0 ? 'Today' :
                          `${daysUntil} days`})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">Issuer: {doc.issuer}</div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button className="flex-1 text-xs py-2 px-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">
          View Documents
        </button>
        <button className="flex-1 text-xs py-2 px-3 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 font-medium">
          Renew Documents
        </button>
      </div>
    </div>
  )
}



