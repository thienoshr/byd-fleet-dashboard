'use client'

import { useState, useEffect } from 'react'
import AgreementsTable from '@/components/AgreementsTable'
import AgreementTracker from '@/components/AgreementTracker'
import DateRangeFilter from '@/components/DateRangeFilter'
import { agreements, agreementsFull, vehicles as comprehensiveVehicles } from '@/lib/dummyData'
import type { AgreementFull } from '@/lib/dummyData'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import VehicleRecallAlert from '@/components/VehicleRecallAlert'
import { exportAgreementPDF, exportAgreementCSV } from '@/lib/exportAgreement'

export default function AgreementsPage() {
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })
  const [selectedContractNumber, setSelectedContractNumber] = useState<string | null>(null)

  // Close modal when clicking navigation links
  useEffect(() => {
    if (selectedContractNumber) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest('a[href]')
        const nav = target.closest('nav')
        if (link && nav) {
          setSelectedContractNumber(null)
        }
      }
      document.addEventListener('click', handleClick, true)
      return () => document.removeEventListener('click', handleClick, true)
    }
  }, [selectedContractNumber])

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setDateRange({ start: startDate, end: endDate })
  }

  // Filter agreements by date range
  const filteredAgreements = agreements.filter((agreement) => {
    if (!dateRange.start && !dateRange.end) return true
    const agreementDate = new Date(agreement.start_date)
    const start = dateRange.start ? new Date(dateRange.start) : null
    const end = dateRange.end ? new Date(dateRange.end) : null
    if (start && agreementDate < start) return false
    if (end && agreementDate > end) return false
    return true
  })

  // Get full agreement details
  const getFullAgreement = (contractNumber: string): AgreementFull | null => {
    return agreementsFull.find((a) => a.agreementId === contractNumber) || null
  }

  // Get vehicle for agreement
  const getVehicle = (vehicleId: string) => {
    return comprehensiveVehicles.find((v) => v.id === vehicleId) || null
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

  const selectedAgreement = selectedContractNumber ? getFullAgreement(selectedContractNumber) : null
  const selectedVehicle = selectedAgreement ? getVehicle(selectedAgreement.vehicleId) : null

  // Download handlers
  const handleDownloadPDF = () => {
    if (!selectedAgreement || !selectedVehicle) return
    exportAgreementPDF(selectedAgreement, selectedVehicle)
  }

  const handleDownloadCSV = () => {
    if (!selectedAgreement || !selectedVehicle) return
    exportAgreementCSV(selectedAgreement, selectedVehicle)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agreements</h1>
        <p className="mt-2 text-gray-600">Manage rental agreements and contracts</p>
      </div>

      {/* Date Range Filter */}
      <div className="card">
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} label="Filter by Start Date" />
      </div>

      {/* Agreement Tracker */}
      <AgreementTracker />

      {/* Agreements Table */}
      <AgreementsTable 
        agreements={filteredAgreements} 
        onSelectAgreement={setSelectedContractNumber}
      />

      {/* Agreement Details Modal */}
      {selectedAgreement && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
            onClick={() => setSelectedContractNumber(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Contract Details - {selectedAgreement.agreementId}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    title="Download as PDF"
                  >
                    PDF
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    title="Download as CSV"
                  >
                    CSV
                  </button>
                  <button
                    id="close-modal"
                    onClick={() => setSelectedContractNumber(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Agreement Information - On Top */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Agreement Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Contract ID</label>
                      <p className="mt-1 text-gray-900 font-mono font-semibold">{selectedAgreement.agreementId}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Customer</label>
                      <p className="mt-1 text-gray-900 font-medium">{selectedAgreement.customer}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Stage</label>
                      <p className="mt-1">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {selectedAgreement.stage}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Created At</label>
                      <p className="mt-1 text-gray-900">{formatDateTime(selectedAgreement.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Mileage Tracking */}
                {(selectedAgreement.mileageLimit || selectedAgreement.currentMileage || selectedAgreement.mileageAtStart) && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mileage Tracking</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedAgreement.mileageLimit && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Mileage Limit</label>
                          <p className="mt-1 text-gray-900 font-semibold">{selectedAgreement.mileageLimit.toLocaleString()} miles</p>
                        </div>
                      )}
                      {selectedAgreement.mileageAtStart && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Mileage at Start</label>
                          <p className="mt-1 text-gray-900">{selectedAgreement.mileageAtStart.toLocaleString()} miles</p>
                        </div>
                      )}
                      {selectedAgreement.currentMileage && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Current Mileage</label>
                          <p className="mt-1 text-gray-900 font-semibold">{selectedAgreement.currentMileage.toLocaleString()} miles</p>
                        </div>
                      )}
                      {selectedAgreement.mileageAtReturn && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Mileage at Return</label>
                          <p className="mt-1 text-gray-900">{selectedAgreement.mileageAtReturn.toLocaleString()} miles</p>
                        </div>
                      )}
                      {selectedAgreement.mileageOverage && selectedAgreement.mileageOverage > 0 && (
                        <div className="col-span-2 md:col-span-4">
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <label className="text-xs font-medium text-red-700">Mileage Overage</label>
                            <p className="mt-1 text-red-900 font-bold text-lg">
                              {selectedAgreement.mileageOverage.toLocaleString()} miles over limit
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Penalties */}
                {selectedAgreement.penalties && selectedAgreement.penalties.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Penalties</h3>
                    <div className="space-y-3">
                      {selectedAgreement.penalties.map((penalty) => (
                        <div key={penalty.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 capitalize">{penalty.type.replace('_', ' ')}</p>
                              <p className="text-sm text-gray-600 mt-1">{penalty.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-900">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: penalty.currency }).format(penalty.amount)}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                penalty.status === 'paid' ? 'bg-green-100 text-green-800' :
                                penalty.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                penalty.status === 'waived' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {penalty.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>Date: {formatDateTime(penalty.date)}</span>
                            <span>Recorded by: {penalty.recordedBy}</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-yellow-200">
                        <p className="text-sm font-semibold text-gray-900">
                          Total Penalties: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: selectedAgreement.penalties[0]?.currency || 'GBP' }).format(
                            selectedAgreement.penalties.reduce((sum, p) => sum + p.amount, 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Breaches */}
                {selectedAgreement.breaches && selectedAgreement.breaches.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Breaches</h3>
                    <div className="space-y-3">
                      {selectedAgreement.breaches.map((breach) => (
                        <div key={breach.id} className="p-3 bg-white rounded-lg border border-red-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 capitalize">{breach.type.replace('_', ' ')}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  breach.severity === 'critical' ? 'bg-red-600 text-white' :
                                  breach.severity === 'major' ? 'bg-red-400 text-white' :
                                  breach.severity === 'moderate' ? 'bg-orange-400 text-white' :
                                  'bg-yellow-400 text-white'
                                }`}>
                                  {breach.severity}
                                </span>
                                {breach.resolved && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Resolved
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{breach.description}</p>
                              {breach.resolutionNotes && (
                                <p className="text-sm text-green-700 mt-2 italic">Resolution: {breach.resolutionNotes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>Date: {formatDateTime(breach.date)}</span>
                            <span>Recorded by: {breach.recordedBy}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recall Alert */}
                {selectedVehicle?.recall && (
                  <div>
                    <VehicleRecallAlert vehicle={selectedVehicle} />
                  </div>
                )}

                {/* Vehicle Health - At Bottom */}
                {selectedVehicle && <VehicleHealthPanel vehicle={selectedVehicle} />}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    id="close-modal"
                    onClick={() => setSelectedContractNumber(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
