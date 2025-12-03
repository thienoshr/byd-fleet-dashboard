'use client'

import { useState, useEffect } from 'react'
import { vehicles } from '@/modules/fleet-availability/schema'
import type { Vehicle } from '@/modules/fleet-availability/schema'
import { vehicles as comprehensiveVehicles, agreementsFull } from '@/lib/dummyData'
import type { AgreementFull } from '@/lib/dummyData'
import AvailabilityTable from '@/modules/fleet-availability/components/AvailabilityTable'
import AvailabilityFilters, { type FilterState } from '@/modules/fleet-availability/components/AvailabilityFilters'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import VehicleRecallAlert from '@/components/VehicleRecallAlert'

export default function FleetAvailabilityPage() {
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  // Close modal when clicking navigation links
  useEffect(() => {
    if (!selectedVehicleId) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      const nav = target.closest('nav')
      
      if (link && nav) {
        setSelectedVehicleId(null)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [selectedVehicleId])

  // Handle filter changes
  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...vehicles]

    if (filters.status !== 'All') {
      filtered = filtered.filter((v) => v.availability_status === filters.status)
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter((v) => v.location === filters.location)
    }

    if (filters.query) {
      const searchLower = filters.query.toLowerCase()
      filtered = filtered.filter(
        (v) =>
          v.vin.toLowerCase().includes(searchLower) ||
          v.registration.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower)
      )
    }

    setFilteredVehicles(filtered)
  }

  // Get comprehensive vehicle for modal
  const getComprehensiveVehicle = (vehicleId: string) => {
    // Normalize vehicle ID - schema uses "V001" but dummyData uses "BYD-V001"
    const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
    return comprehensiveVehicles.find((v) => v.id === normalizedId || v.id === vehicleId) || null
  }

  // Get active agreement for vehicle
  const getActiveAgreement = (vehicleId: string): AgreementFull | null => {
    // Normalize vehicle ID - schema uses "V001" but dummyData uses "BYD-V001"
    const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
    const now = new Date()
    return agreementsFull
      .filter((a) => a.vehicleId === normalizedId || a.vehicleId === vehicleId)
      .filter((a) => {
        const endDate = new Date(a.endAt)
        const startDate = new Date(a.startAt)
        return endDate > now && 
               startDate <= now &&
               a.stage !== 'Vehicle Returned' && 
               a.stage !== 'Closed' &&
               a.stage !== 'Charges Finalised'
      })
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0] || null
  }

  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  const selectedVehicle = selectedVehicleId 
    ? filteredVehicles.find(v => v.id === selectedVehicleId) || null
    : null
  const compVehicle = selectedVehicleId ? getComprehensiveVehicle(selectedVehicleId) : null
  const activeAgreement = selectedVehicleId ? getActiveAgreement(selectedVehicleId) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fleet Availability</h1>
        <p className="mt-2 text-gray-600">View and manage fleet availability status</p>
      </div>

      <AvailabilityFilters vehicles={vehicles} onFilter={handleFilterChange} />
      <AvailabilityTable 
        vehicles={filteredVehicles} 
        onSelect={(vehicleId) => setSelectedVehicleId(vehicleId)}
      />

      {/* Vehicle Details Modal */}
      {selectedVehicle && compVehicle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedVehicleId(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                  <p className="text-sm text-gray-500 mt-1">{compVehicle.registration} • {compVehicle.model}</p>
                </div>
                <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center">×</button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Agreement Information - On Top */}
                  {activeAgreement ? (
                    <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Agreement Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Contract ID</label>
                          <p className="text-sm text-gray-900 font-mono font-semibold">{activeAgreement.agreementId}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Customer</label>
                          <p className="text-sm text-gray-900 font-medium">{activeAgreement.customer}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Stage</label>
                          <p className="mt-0.5">
                            <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {activeAgreement.stage}
                            </span>
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Created At</label>
                          <p className="text-sm text-gray-900">{formatDateTime(activeAgreement.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600">No active agreement for this vehicle</div>
                    </div>
                  )}

                  {/* Recall Alert */}
                  {compVehicle.recall && (
                    <div>
                      <VehicleRecallAlert vehicle={compVehicle} />
                    </div>
                  )}

                  {/* Vehicle Health - At Bottom */}
                  <div>
                    <VehicleHealthPanel vehicle={compVehicle} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="btn-primary">Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
