'use client'

import React from 'react'
import { vehicles } from '@/lib/dummyData'

interface QuickActionsSidebarProps {
  onAction: (actionName: string, payload: Record<string, any>) => void
}

export default function QuickActionsSidebar({ onAction }: QuickActionsSidebarProps) {
  // Find next available vehicle
  const nextAvailableVehicle = vehicles.find((v) => v.availability_status === 'Available')
  const vehicleInWorkshop = vehicles.find((v) => v.availability_status === 'In Workshop')

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <button
          className="w-full px-4 py-2.5 rounded-lg font-medium transition-all text-sm bg-primary-600 text-white shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            onAction('allocateVehicle', {
              vehicleId: nextAvailableVehicle?.id || vehicles[0]?.id,
            })
          }
          disabled={!nextAvailableVehicle && vehicles.length === 0}
        >
          Allocate Vehicle
        </button>
        <button
          className="w-full px-4 py-2.5 rounded-lg font-medium transition-all text-sm bg-primary-600 text-white shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            onAction('requestParts', {
              vehicleId: vehicleInWorkshop?.id || vehicles[1]?.id || vehicles[0]?.id,
            })
          }
        >
          Request Parts
        </button>
        <button
          className="w-full px-4 py-2.5 rounded-lg font-medium transition-all text-sm bg-primary-600 text-white shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            onAction('markResolved', {
              vehicleId: vehicleInWorkshop?.id || vehicles[1]?.id || vehicles[0]?.id,
            })
          }
        >
          Mark Vehicle Resolved
        </button>
      </div>
    </div>
  )
}





