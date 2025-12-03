'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { vehicles } from '@/lib/dummyData'
import type { Vehicle } from '@/lib/dummyData'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import VehicleRecallAlert from '@/components/VehicleRecallAlert'

// Helper function to capitalize progress text
function capitalizeProgress(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Helper function to format duration
function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '—'
  const totalHours = Math.floor(seconds / 3600)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  
  if (months > 0) {
    return `${months}m ${remainingDays}d ${hours}h`
  } else if (days > 0) {
    return `${days}d ${hours}h`
  }
  return `${hours}h`
}

function VorPageContent() {
  const searchParams = useSearchParams()
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState<'all' | string>('all')

  // Auto-open vehicle details if vehicle ID is in URL
  useEffect(() => {
    const vehicleId = searchParams.get('vehicle')
    if (vehicleId) {
      const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
      const vehicle = vehicles.find(v => v.id === normalizedId || v.id === vehicleId)
      if (vehicle) {
        setSelectedVehicleId(vehicle.id)
      }
    }
  }, [searchParams])

  // Filter vehicles that are VOR (Vehicle Off Road)
  const vorVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const ts = v.stage_timestamps || {}
      const isVor = v.availability_status === 'In Workshop' ||
                   (ts.partsRequestedAt && v.availability_status !== 'Available') ||
                   v.availability_status === 'Awaiting Valet' ||
                   v.availability_status === 'Awaiting Documents' ||
                   v.availability_status === 'Awaiting Allocation'
      if (!isVor) return false

      // Apply search filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase()
        const matches = 
          v.model.toLowerCase().includes(query) ||
          v.registration.toLowerCase().includes(query) ||
          v.vin.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query) ||
          v.rental_partner.toLowerCase().includes(query)
        if (!matches) return false
      }

      // Apply stage filter
      if (filterStage !== 'all') {
        if (filterStage === 'In Workshop' && v.availability_status !== 'In Workshop') return false
        if (filterStage === 'Awaiting Parts' && !(ts.partsRequestedAt && v.availability_status !== 'Available')) return false
        if (filterStage === 'Awaiting Valet' && v.availability_status !== 'Awaiting Valet') return false
        if (filterStage === 'Awaiting Documents' && v.availability_status !== 'Awaiting Documents') return false
      }

      return true
    })
  }, [searchTerm, filterStage])

  const selectedVehicle = selectedVehicleId 
    ? vehicles.find(v => v.id === selectedVehicleId)
    : null

  // Calculate time in current stage
  const getTimeInStage = (vehicle: Vehicle): number | null => {
    const ts = vehicle.stage_timestamps || {}
    if (vehicle.availability_status === 'In Workshop') {
      const workshopIn = ts.workshopInAt || ts.inspectedAt
      if (workshopIn) {
        return Math.floor((Date.now() - new Date(workshopIn).getTime()) / 1000)
      }
    } else if (ts.partsRequestedAt && vehicle.availability_status !== 'Available') {
      return Math.floor((Date.now() - new Date(ts.partsRequestedAt).getTime()) / 1000)
    }
    return null
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">VOR (Vehicle Off Road)</h1>
        <p className="mt-2 text-gray-600">Manage vehicles that are currently off road</p>
      </div>

      <div className="card">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Stages</option>
            <option value="In Workshop">In Workshop</option>
            <option value="Awaiting Parts">Awaiting Parts</option>
            <option value="Awaiting Valet">Awaiting Valet</option>
            <option value="Awaiting Documents">Awaiting Documents</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {vorVehicles.map((v) => {
                const timeInStage = getTimeInStage(v)
                const duration = formatDuration(timeInStage)
                const isCritical = timeInStage && ((v.availability_status === 'In Workshop' && timeInStage > 48 * 3600) || (v.stage_timestamps?.partsRequestedAt && timeInStage > 72 * 3600))
                return (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-semibold">{v.registration}</td>
                    <td className="py-3 px-4 text-gray-900">{v.model}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        v.availability_status === 'In Workshop' ? 'bg-red-100 text-red-800' :
                        v.availability_status === 'Awaiting Parts' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {v.availability_status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-semibold ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                      {duration}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {v.currentProgress ? capitalizeProgress(v.currentProgress) : '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{v.location}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedVehicleId(v.id)}
                        className="px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold transition-colors text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VOR Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[50] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto z-[60]">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">VOR Vehicle Details - {selectedVehicle.model} ({selectedVehicle.registration})</h2>
              <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-6">
              {/* VOR Specific Details - On Top */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">VOR Status & Timeline</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedVehicle.availability_status === 'In Workshop' ? 'bg-red-100 text-red-800' :
                        selectedVehicle.availability_status === 'Awaiting Parts' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedVehicle.availability_status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Time in Current Stage:</span>
                      <span className={`ml-2 font-semibold ${getTimeInStage(selectedVehicle) && ((selectedVehicle.availability_status === 'In Workshop' && getTimeInStage(selectedVehicle)! > 48 * 3600) || (selectedVehicle.stage_timestamps?.partsRequestedAt && getTimeInStage(selectedVehicle)! > 72 * 3600)) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDuration(getTimeInStage(selectedVehicle))}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Current Progress:</span>
                      <span className="ml-2 text-gray-900">{selectedVehicle.currentProgress ? capitalizeProgress(selectedVehicle.currentProgress) : '—'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <span className="ml-2 text-gray-900">{selectedVehicle.location}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Rental Partner:</span>
                      <span className="ml-2 text-gray-900">{selectedVehicle.rental_partner}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Returned At:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.stage_timestamps?.returnedAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Inspected At:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.stage_timestamps?.inspectedAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Workshop In At:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.stage_timestamps?.workshopInAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Parts Requested At:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.stage_timestamps?.partsRequestedAt)}</span>
                    </div>
                    {selectedVehicle.workshopEta && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Workshop ETA:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.workshopEta)}</span>
                      </div>
                    )}
                    {selectedVehicle.lastUpdate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Last Update:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.lastUpdate)}</span>
                      </div>
                    )}
                    {selectedVehicle.vorUpdate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">VOR Update:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.vorUpdate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Parts Information */}
              {selectedVehicle.partsInfo && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Depot:</span>
                      <span className="ml-2 text-gray-900">{selectedVehicle.partsInfo.depot || '—'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Part Name:</span>
                      <span className="ml-2 text-gray-900">{selectedVehicle.partsInfo.partName || '—'}</span>
                    </div>
                    {selectedVehicle.partsInfo.partNumber && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Part Number:</span>
                        <span className="ml-2 text-gray-900 font-mono">{selectedVehicle.partsInfo.partNumber}</span>
                      </div>
                    )}
                    {selectedVehicle.partsInfo.orderDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Order Date:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.partsInfo.orderDate)}</span>
                      </div>
                    )}
                    {selectedVehicle.partsInfo.eta && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Parts ETA:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedVehicle.partsInfo.eta)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recall Alert */}
              {selectedVehicle.recall && (
                <div className="border-t border-gray-200 pt-6">
                  <VehicleRecallAlert vehicle={selectedVehicle} />
                </div>
              )}

              {/* Vehicle Health Panel - At Bottom/Last */}
              <div className="border-t border-gray-200 pt-6">
                <VehicleHealthPanel vehicle={selectedVehicle} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VorPageContent />
    </Suspense>
  )
}
