'use client'

import { useState, useMemo } from 'react'
import { suppliers } from '@/lib/dummyData'
import type { Supplier } from '@/lib/dummyData'

export default function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'on_hold'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'rental_partner' | 'parts_supplier' | 'service_provider' | 'other'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesStatus = statusFilter === 'all' || supplier.onboardingStatus === statusFilter
      const matchesType = typeFilter === 'all' || supplier.type === typeFilter
      const matchesSearch =
        searchQuery === '' ||
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesType && matchesSearch
    })
  }, [statusFilter, typeFilter, searchQuery])

  const selectedSupplierData = selectedSupplier
    ? suppliers.find((s) => s.id === selectedSupplier)
    : null

  const getOnboardingColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'on_hold':
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

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'pending_renewal':
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
        <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
        <p className="mt-2 text-gray-600">Manage rental partners, suppliers, and onboarding processes</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 py-2">Onboarding:</span>
              {(['all', 'pending', 'in_progress', 'completed', 'on_hold'] as const).map((status) => (
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
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
              {(['all', 'rental_partner', 'parts_supplier', 'service_provider', 'other'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    typeFilter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Company Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Person</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Onboarding</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Compliance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{supplier.companyName}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{supplier.contactPerson}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700 capitalize">{supplier.type.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{supplier.email}</td>
                    <td className="py-3 px-4 text-gray-700">{supplier.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOnboardingColor(supplier.onboardingStatus)}`}>
                        {supplier.onboardingStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(supplier.complianceStatus)}`}>
                        {supplier.complianceStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedSupplier(supplier.id)}
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

      {/* Supplier Details Modal */}
      {selectedSupplierData && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
            onClick={() => setSelectedSupplier(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSupplierData.companyName}</h2>
                  <p className="text-sm text-gray-600 mt-1">Supplier Details</p>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="text-gray-900 font-medium">{selectedSupplierData.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-gray-900 capitalize">{selectedSupplierData.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact Person</label>
                      <p className="text-gray-900">{selectedSupplierData.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedSupplierData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedSupplierData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900">{selectedSupplierData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Onboarding & Compliance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding & Compliance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Onboarding Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOnboardingColor(selectedSupplierData.onboardingStatus)}`}>
                          {selectedSupplierData.onboardingStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Onboarding Date</label>
                      <p className="text-gray-900">
                        {selectedSupplierData.onboardingDate ? formatDate(selectedSupplierData.onboardingDate) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Compliance Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(selectedSupplierData.complianceStatus)}`}>
                          {selectedSupplierData.complianceStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-gray-900">{selectedSupplierData.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {selectedSupplierData.performance && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedSupplierData.performance.avgLeadTimeHours && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Avg Lead Time</label>
                          <p className="text-gray-900 font-semibold">{selectedSupplierData.performance.avgLeadTimeHours} hours</p>
                        </div>
                      )}
                      {selectedSupplierData.performance.slaPercent && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">SLA %</label>
                          <p className="text-gray-900 font-semibold">{selectedSupplierData.performance.slaPercent}%</p>
                        </div>
                      )}
                      {selectedSupplierData.performance.totalOrders && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Total Orders</label>
                          <p className="text-gray-900 font-semibold">{selectedSupplierData.performance.totalOrders}</p>
                        </div>
                      )}
                      {selectedSupplierData.performance.onTimeDelivery && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">On-Time Delivery</label>
                          <p className="text-gray-900 font-semibold">{selectedSupplierData.performance.onTimeDelivery}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedSupplierData.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                    <div className="space-y-3">
                      {selectedSupplierData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-600 capitalize">{doc.type}</span>
                                <span className="text-xs text-gray-500">
                                  Uploaded: {formatDate(doc.uploadDate)}
                                </span>
                                {doc.expiryDate && (
                                  <span className="text-xs text-gray-500">
                                    Expires: {formatDate(doc.expiryDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status.replace('_', ' ')}
                            </span>
                            <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSupplierData.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


