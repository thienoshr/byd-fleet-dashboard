'use client'

import { useState, useMemo } from 'react'
import { buybackAgreements, vehicles } from '@/lib/dummyData'
import type { BuybackAgreement } from '@/lib/dummyData'

export default function BuybacksPage() {
  const [selectedBuyback, setSelectedBuyback] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBuybacks = useMemo(() => {
    return buybackAgreements.filter((buyback) => {
      const matchesStatus = statusFilter === 'all' || buyback.status === statusFilter
      const matchesSearch =
        searchQuery === '' ||
        buyback.buybackId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyback.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyback.rentalPartner.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [statusFilter, searchQuery])

  const selectedBuybackData = selectedBuyback
    ? buybackAgreements.find((b) => b.id === selectedBuyback)
    : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'non_compliant':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buyback Agreements</h1>
        <p className="mt-2 text-gray-600">Manage and track vehicle buyback agreements</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search buybacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      {/* Buyback Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Buyback ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rental Partner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Buyback Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Compliance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuybacks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No buyback agreements found
                  </td>
                </tr>
              ) : (
                filteredBuybacks.map((buyback) => (
                  <tr
                    key={buyback.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{buyback.buybackId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{buyback.vehicleRegistration}</span>
                        <span className="text-xs text-gray-500">{buyback.vehicleId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{buyback.rentalPartner}</td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(buyback.buybackDate)}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: buyback.currency }).format(buyback.buybackPrice)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-gray-700">{buyback.condition}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(buyback.status)}`}>
                        {buyback.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(buyback.complianceStatus)}`}>
                        {buyback.complianceStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedBuyback(buyback.id)}
                        className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyback Details Modal */}
      {selectedBuybackData && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
            onClick={() => setSelectedBuyback(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBuybackData.buybackId}</h2>
                  <p className="text-sm text-gray-600 mt-1">Buyback Agreement Details</p>
                </div>
                <button
                  onClick={() => setSelectedBuyback(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Vehicle Registration</label>
                      <p className="text-gray-900 font-medium">{selectedBuybackData.vehicleRegistration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Vehicle ID</label>
                      <p className="text-gray-900">{selectedBuybackData.vehicleId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rental Partner</label>
                      <p className="text-gray-900">{selectedBuybackData.rentalPartner}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Original Agreement</label>
                      <p className="text-gray-900">{selectedBuybackData.originalAgreementId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Buyback Date</label>
                      <p className="text-gray-900">{formatDate(selectedBuybackData.buybackDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Buyback Price</label>
                      <p className="text-gray-900 font-semibold text-lg">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: selectedBuybackData.currency }).format(selectedBuybackData.buybackPrice)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Condition</label>
                      <p className="text-gray-900 capitalize">{selectedBuybackData.condition}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mileage at Buyback</label>
                      <p className="text-gray-900">{selectedBuybackData.mileageAtBuyback.toLocaleString()} miles</p>
                    </div>
                  </div>
                </div>

                {/* Status and Compliance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Compliance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBuybackData.status)}`}>
                          {selectedBuybackData.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Compliance Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(selectedBuybackData.complianceStatus)}`}>
                          {selectedBuybackData.complianceStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-gray-900">{selectedBuybackData.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Agreement Created</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedBuybackData.timestamps.agreementCreatedAt)}</p>
                      </div>
                    </div>
                    {selectedBuybackData.timestamps.vehicleInspectedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Vehicle Inspected</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedBuybackData.timestamps.vehicleInspectedAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedBuybackData.timestamps.buybackCompletedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Buyback Completed</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedBuybackData.timestamps.buybackCompletedAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedBuybackData.timestamps.paymentProcessedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedBuybackData.timestamps.paymentProcessedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                {selectedBuybackData.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                    <div className="space-y-2">
                      {selectedBuybackData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-xl">📄</span>
                          <span className="text-sm text-gray-700">{doc}</span>
                          <button className="ml-auto px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBuybackData.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


