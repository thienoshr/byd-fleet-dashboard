'use client'

import { useEffect, useState } from 'react'
import { vehicles, agreementsFull } from '@/lib/dummyData'
import type { Vehicle } from '@/lib/dummyData'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import VehicleRecallAlert from '@/components/VehicleRecallAlert'

interface SearchModalProps {
  type: 'vehicle' | 'agreement' | 'location'
  data: any
  onClose: () => void
}

export default function SearchModal({ type, data, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape key - must be before any early returns
  useEffect(() => {
    if (!mounted || !data) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVehicle) {
          setSelectedVehicle(null)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose, mounted, data, selectedVehicle])

  if (!mounted || !data) return null

  // Get vehicle driver info
  const getVehicleDriver = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    if (!vehicle) return null

    const isCurrentlyWithDriver = vehicle.availability_status === 'On Hire' || 
                                   vehicle.availability_status === 'With Partner'

    if (isCurrentlyWithDriver) {
      const activeAgreement = agreementsFull
        .filter((a) => a.vehicleId === vehicleId)
        .filter((a) => {
          const endDate = new Date(a.endAt)
          const now = new Date()
          return endDate > now && 
                 a.stage !== 'Vehicle Returned' && 
                 a.stage !== 'Closed' &&
                 a.stage !== 'Charges Finalised'
        })
        .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0]

      if (activeAgreement) {
        return {
          type: 'current' as const,
          driverName: activeAgreement.driverName || 'N/A',
          driverPhone: activeAgreement.driverPhone || 'N/A',
          driverLicense: activeAgreement.driverLicense || 'N/A',
          customer: activeAgreement.customer,
          agreementId: activeAgreement.agreementId,
          startDate: activeAgreement.startAt,
          endDate: activeAgreement.endAt,
        }
      }
    }

    const allAgreements = agreementsFull
      .filter((a) => a.vehicleId === vehicleId)
      .sort((a, b) => {
        const aDate = a.timestamps.returnedAt ? new Date(a.timestamps.returnedAt).getTime() : new Date(a.endAt).getTime()
        const bDate = b.timestamps.returnedAt ? new Date(b.timestamps.returnedAt).getTime() : new Date(b.endAt).getTime()
        return bDate - aDate
      })

    if (allAgreements.length > 0) {
      const lastAgreement = allAgreements[0]
      return {
        type: 'last' as const,
        driverName: lastAgreement.driverName || 'N/A',
        driverPhone: lastAgreement.driverPhone || 'N/A',
        driverLicense: lastAgreement.driverLicense || 'N/A',
        customer: lastAgreement.customer,
        agreementId: lastAgreement.agreementId,
        startDate: lastAgreement.startAt,
        endDate: lastAgreement.endAt,
        returnedDate: lastAgreement.timestamps.returnedAt,
      }
    }

    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatMileage = (miles: number) => {
    return miles.toLocaleString()
  }

  if (type === 'vehicle') {
    if (!data) return null
    const vehicle = data as Vehicle
    if (!vehicle || !vehicle.id) return null
    const driverInfo = getVehicleDriver(vehicle.id)

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Vehicle Details - {vehicle.registration}
              </h2>
              <button
                id="close-modal"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recall Alert */}
              {vehicle?.recall && <VehicleRecallAlert vehicle={vehicle} />}
              
              {/* Vehicle Health Panel */}
              {vehicle && <VehicleHealthPanel vehicle={vehicle} />}

              {/* Driver/Customer Information */}
              {driverInfo && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {driverInfo.type === 'current' ? 'Current Driver/Customer' : 'Last Driver/Customer'}
                    </h3>
                    {driverInfo.type === 'last' && (
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                        Vacant
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Driver Name</label>
                      <p className="mt-1 text-gray-900 font-medium">{driverInfo.driverName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Phone</label>
                      <p className="mt-1 text-gray-900">{driverInfo.driverPhone}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">License</label>
                      <p className="mt-1 text-gray-900 font-mono text-xs">{driverInfo.driverLicense}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Customer</label>
                      <p className="mt-1 text-gray-900 font-medium">{driverInfo.customer}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Agreement ID</label>
                      <p className="mt-1 text-gray-900 font-mono text-xs">{driverInfo.agreementId}</p>
                    </div>
                    {driverInfo.type === 'last' && driverInfo.returnedDate && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Returned Date</label>
                        <p className="mt-1 text-gray-900">{formatDate(driverInfo.returnedDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicle Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">VIN</label>
                  <p className="mt-1 text-gray-900 font-mono">{vehicle.vin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration</label>
                  <p className="mt-1 text-gray-900 font-semibold">{vehicle.registration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Model</label>
                  <p className="mt-1 text-gray-900 font-semibold">{vehicle.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-gray-900">{vehicle.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        vehicle.availability_status === 'Available'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : vehicle.availability_status === 'On Hire'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : vehicle.availability_status === 'In Workshop'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : vehicle.availability_status === 'Awaiting Valet'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}
                    >
                      {vehicle.availability_status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rental Partner</label>
                  <p className="mt-1 text-gray-900">{vehicle.rental_partner}</p>
                </div>
                {vehicle.health && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Health Score</label>
                      <p className="mt-1 text-gray-900 font-semibold">{vehicle.health.healthScore}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Battery Health</label>
                      <p className="mt-1 text-gray-900">{vehicle.health.batteryHealth}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">MOT Expiry</label>
                      <p className="mt-1 text-gray-900">{formatDate(vehicle.health.motExpiry)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last OTA Update</label>
                      <p className="mt-1 text-gray-900">{formatDate(vehicle.health.lastOta)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button id="close-modal" onClick={onClose} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (type === 'agreement') {
    if (!data) return null
    const agreement = data
    if (!agreement || !agreement.vehicleId) return null
    const vehicle = vehicles.find((v) => v.id === agreement.vehicleId)

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Agreement Details - {agreement.agreementId}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Agreement ID</label>
                  <p className="mt-1 text-gray-900 font-mono">{agreement.agreementId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {agreement.stage}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="mt-1 text-gray-900 font-medium">{agreement.customer}</p>
                </div>
                {vehicle && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vehicle</label>
                      <p className="mt-1 text-gray-900">{vehicle.model} - {vehicle.registration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">VIN</label>
                      <p className="mt-1 text-gray-900 font-mono text-xs">{vehicle.vin}</p>
                    </div>
                  </>
                )}
                {agreement.driverName && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Driver Name</label>
                      <p className="mt-1 text-gray-900 font-medium">{agreement.driverName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Driver Phone</label>
                      <p className="mt-1 text-gray-900">{agreement.driverPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Driver License</label>
                      <p className="mt-1 text-gray-900 font-mono text-xs">{agreement.driverLicense || 'N/A'}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="mt-1 text-gray-900">{formatDate(agreement.startAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="mt-1 text-gray-900">{formatDate(agreement.endAt)}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button id="close-modal" onClick={onClose} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (type === 'location') {
    if (!data || !Array.isArray(data)) return null
    const locationVehicles = data as Vehicle[]
    if (locationVehicles.length === 0) return null

    // If a vehicle is selected from location, show vehicle details
    if (selectedVehicle) {
      const vehicle = selectedVehicle
      const driverInfo = getVehicleDriver(vehicle.id)

      return (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedVehicle(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    aria-label="Back"
                  >
                    ←
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Vehicle Details - {vehicle.registration}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Recall Alert */}
                {vehicle?.recall && <VehicleRecallAlert vehicle={vehicle} />}
                
                {/* Vehicle Health Panel */}
                {vehicle && <VehicleHealthPanel vehicle={vehicle} />}

                {/* Driver/Customer Information */}
                {driverInfo && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {driverInfo.type === 'current' ? 'Current Driver/Customer' : 'Last Driver/Customer'}
                      </h3>
                      {driverInfo.type === 'last' && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          Vacant
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Driver Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{driverInfo.driverName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Phone</label>
                        <p className="mt-1 text-gray-900">{driverInfo.driverPhone}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">License</label>
                        <p className="mt-1 text-gray-900 font-mono text-xs">{driverInfo.driverLicense}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Customer</label>
                        <p className="mt-1 text-gray-900 font-medium">{driverInfo.customer}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Agreement ID</label>
                        <p className="mt-1 text-gray-900 font-mono text-xs">{driverInfo.agreementId}</p>
                      </div>
                      {driverInfo.type === 'last' && driverInfo.returnedDate && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Returned Date</label>
                          <p className="mt-1 text-gray-900">{formatDate(driverInfo.returnedDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vehicle Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">VIN</label>
                    <p className="mt-1 text-gray-900 font-mono">{vehicle.vin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration</label>
                    <p className="mt-1 text-gray-900 font-semibold">{vehicle.registration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Model</label>
                    <p className="mt-1 text-gray-900 font-semibold">{vehicle.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1 text-gray-900">{vehicle.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          vehicle.availability_status === 'Available'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : vehicle.availability_status === 'On Hire'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : vehicle.availability_status === 'In Workshop'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : vehicle.availability_status === 'Awaiting Valet'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {vehicle.availability_status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rental Partner</label>
                    <p className="mt-1 text-gray-900">{vehicle.rental_partner}</p>
                  </div>
                  {vehicle.health && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Health Score</label>
                        <p className="mt-1 text-gray-900 font-semibold">{vehicle.health.healthScore}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Battery Health</label>
                        <p className="mt-1 text-gray-900">{vehicle.health.batteryHealth}%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">MOT Expiry</label>
                        <p className="mt-1 text-gray-900">{formatDate(vehicle.health.motExpiry)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last OTA Update</label>
                        <p className="mt-1 text-gray-900">{formatDate(vehicle.health.lastOta)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button onClick={() => setSelectedVehicle(null)} className="btn-secondary">
                  Back to List
                </button>
                <button onClick={onClose} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    // Show location vehicles list
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Vehicles at {locationVehicles[0]?.location || 'Location'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 text-sm text-gray-600">
                {locationVehicles.length} vehicle{locationVehicles.length !== 1 ? 's' : ''} found
              </div>
              <div className="space-y-3">
                {locationVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{v.model} - {v.registration}</h3>
                        <p className="text-sm text-gray-600 mt-1">VIN: {v.vin}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                            v.availability_status === 'Available'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : v.availability_status === 'On Hire'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : v.availability_status === 'In Workshop'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                          }`}
                        >
                          {v.availability_status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{v.rental_partner}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button id="close-modal" onClick={onClose} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return null
}

