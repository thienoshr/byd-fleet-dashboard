'use client'

import React from 'react'
import type { Vehicle } from '@/lib/dummyData'
import VehicleRecallAlert from './VehicleRecallAlert'

interface VehicleInfoPanelProps {
  vehicle: Vehicle | null
}

export default function VehicleInfoPanel({ vehicle }: VehicleInfoPanelProps) {
  if (!vehicle) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700'
      case 'On Hire': return 'bg-blue-100 text-blue-700'
      case 'In Workshop': return 'bg-red-100 text-red-700'
      case 'Awaiting Valet': return 'bg-yellow-100 text-yellow-700'
      case 'Awaiting Documents': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPartStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-green-600'
      case 'Minor': return 'text-yellow-600'
      case 'Critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Recall Alert */}
      {vehicle.recall && <VehicleRecallAlert vehicle={vehicle} />}
      
      <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-600 mb-1">Registration</div>
          <div className="text-sm font-semibold">{vehicle.registration}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">VIN</div>
          <div className="text-sm font-mono">{vehicle.vin}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Model</div>
          <div className="text-sm font-medium">{vehicle.model}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Location</div>
          <div className="text-sm font-medium">{vehicle.location}</div>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Availability Status</div>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(vehicle.availability_status)}`}>
              {vehicle.availability_status}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Parts Status</div>
            <div className={`text-sm font-medium ${getPartStatusColor(vehicle.part_status)}`}>
              {vehicle.part_status}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Risk Level</div>
            <div className={`text-sm font-medium ${
              vehicle.risk_level === 'Low' ? 'text-green-600' :
              vehicle.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {vehicle.risk_level} ({vehicle.risk_score.toFixed(1)})
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Rental Partner</div>
            <div className="text-sm font-medium">{vehicle.rental_partner}</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Contract Expiry</div>
            <div className="text-sm font-medium">{formatDate(vehicle.contract_expiry)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Next Available</div>
            <div className="text-sm font-medium">{formatDate(vehicle.next_available_date)}</div>
          </div>
          {vehicle.days_overdue > 0 && (
            <div className="col-span-2">
              <div className="text-xs text-gray-600 mb-1">Days Overdue</div>
              <div className="text-sm font-medium text-red-600">{vehicle.days_overdue} days</div>
            </div>
          )}
        </div>
      </div>

      {vehicle.currentProgress && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs text-blue-600 mb-1">Current Progress</div>
          <div className="text-sm font-medium text-blue-700">{vehicle.currentProgress}</div>
        </div>
      )}
    </div>
  )
}

