'use client'

import { useState, useMemo } from 'react'
import { invoices as importedInvoices, purchaseOrders as importedPurchaseOrders, buybackAgreements as importedBuybackAgreements } from '@/lib/dummyData'
import type { Invoice, PurchaseOrder, BuybackAgreement } from '@/lib/dummyData'

// Ensure data exists with fallback to empty arrays
const invoices: Invoice[] = (importedInvoices && Array.isArray(importedInvoices)) ? importedInvoices : []
const purchaseOrders: PurchaseOrder[] = (importedPurchaseOrders && Array.isArray(importedPurchaseOrders)) ? importedPurchaseOrders : []
const buybackAgreements: BuybackAgreement[] = (importedBuybackAgreements && Array.isArray(importedBuybackAgreements)) ? importedBuybackAgreements : []

// Buybacks Tab Component - Defined before FinancialPage so it can be used
function BuybacksTab({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  selectedBuyback,
  setSelectedBuyback,
}: {
  statusFilter: 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
  setStatusFilter: (filter: 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedBuyback: string | null
  setSelectedBuyback: (id: string | null) => void
}) {
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
    <>
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
                {selectedBuybackData.documents && selectedBuybackData.documents.length > 0 && (
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
    </>
  )
}

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'purchase-orders' | 'buybacks'>('invoices')
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'>('all')
  const [poFilter, setPoFilter] = useState<'all' | 'draft' | 'sent' | 'acknowledged' | 'in_transit' | 'delivered' | 'cancelled'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [selectedPO, setSelectedPO] = useState<string | null>(null)
  const [selectedBuyback, setSelectedBuyback] = useState<string | null>(null)

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesFilter = invoiceFilter === 'all' || invoice.status === invoiceFilter
      const matchesSearch =
        searchQuery === '' ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [invoiceFilter, searchQuery])

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesFilter = poFilter === 'all' || po.status === poFilter
      const matchesSearch =
        searchQuery === '' ||
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [poFilter, searchQuery])

  const selectedInvoiceData = selectedInvoice ? invoices.find((i) => i.id === selectedInvoice) : null
  const selectedPOData = selectedPO ? purchaseOrders.find((po) => po.id === selectedPO) : null

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPOStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="mt-2 text-gray-600">Manage invoices, purchase orders, and financial records</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invoices'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('purchase-orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'purchase-orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('buybacks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'buybacks'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Buybacks
          </button>
        </nav>
      </div>

      {activeTab === 'invoices' && (
        <>
          {/* Invoice Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setInvoiceFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      invoiceFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>

          {/* Invoices Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice #</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700 capitalize">{invoice.type.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{invoice.customer}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(invoice.issueDate)}</td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(invoice.dueDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedInvoice(invoice.id)}
                            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Detail Modal */}
          {selectedInvoiceData && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
                onClick={() => setSelectedInvoice(null)}
              />
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                <div
                  className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedInvoiceData.invoiceNumber}</h2>
                      <p className="text-sm text-gray-600 mt-1">Invoice Details</p>
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Customer</label>
                        <p className="text-gray-900 font-medium">{selectedInvoiceData.customer}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Type</label>
                        <p className="text-gray-900 capitalize">{selectedInvoiceData.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Issue Date</label>
                        <p className="text-gray-900">{formatDate(selectedInvoiceData.issueDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Due Date</label>
                        <p className="text-gray-900">{formatDate(selectedInvoiceData.dueDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInvoiceStatusColor(selectedInvoiceData.status)}`}>
                            {selectedInvoiceData.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Amount</label>
                        <p className="text-gray-900 font-semibold text-lg">
                          {formatCurrency(selectedInvoiceData.amount, selectedInvoiceData.currency)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-semibold text-gray-700">Description</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Quantity</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Unit Price</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoiceData.items && selectedInvoiceData.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100">
                              <td className="py-2 px-4 text-gray-700">{item.description}</td>
                              <td className="py-2 px-4 text-right text-gray-700">{item.quantity}</td>
                              <td className="py-2 px-4 text-right text-gray-700">
                                {formatCurrency(item.unitPrice, selectedInvoiceData.currency)}
                              </td>
                              <td className="py-2 px-4 text-right font-medium text-gray-900">
                                {formatCurrency(item.total, selectedInvoiceData.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="py-2 px-4 text-right font-semibold text-gray-900">Total:</td>
                            <td className="py-2 px-4 text-right font-bold text-lg text-gray-900">
                              {formatCurrency(selectedInvoiceData.amount, selectedInvoiceData.currency)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {selectedInvoiceData.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedInvoiceData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'purchase-orders' && (
        <>
          {/* PO Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'draft', 'sent', 'acknowledged', 'in_transit', 'delivered', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setPoFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      poFilter === status
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
                placeholder="Search purchase orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>

          {/* Purchase Orders Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">PO Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Supplier</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expected Delivery</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No purchase orders found
                      </td>
                    </tr>
                  ) : (
                    filteredPOs.map((po) => (
                      <tr
                        key={po.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{po.poNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{po.supplierName}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(po.amount, po.currency)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(po.issueDate)}</td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(po.expectedDeliveryDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPOStatusColor(po.status)}`}>
                            {po.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedPO(po.id)}
                            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PO Detail Modal */}
          {selectedPOData && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
                onClick={() => setSelectedPO(null)}
              />
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                <div
                  className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPOData.poNumber}</h2>
                      <p className="text-sm text-gray-600 mt-1">Purchase Order Details</p>
                    </div>
                    <button
                      onClick={() => setSelectedPO(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Supplier</label>
                        <p className="text-gray-900 font-medium">{selectedPOData.supplierName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Issue Date</label>
                        <p className="text-gray-900">{formatDate(selectedPOData.issueDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Expected Delivery</label>
                        <p className="text-gray-900">{formatDate(selectedPOData.expectedDeliveryDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPOStatusColor(selectedPOData.status)}`}>
                            {selectedPOData.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Amount</label>
                        <p className="text-gray-900 font-semibold text-lg">
                          {formatCurrency(selectedPOData.amount, selectedPOData.currency)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-semibold text-gray-700">Description</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Quantity</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Unit Price</th>
                            <th className="text-right py-2 px-4 font-semibold text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPOData.items && selectedPOData.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100">
                              <td className="py-2 px-4 text-gray-700">{item.description}</td>
                              <td className="py-2 px-4 text-right text-gray-700">{item.quantity}</td>
                              <td className="py-2 px-4 text-right text-gray-700">
                                {formatCurrency(item.unitPrice, selectedPOData.currency)}
                              </td>
                              <td className="py-2 px-4 text-right font-medium text-gray-900">
                                {formatCurrency(item.total, selectedPOData.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="py-2 px-4 text-right font-semibold text-gray-900">Total:</td>
                            <td className="py-2 px-4 text-right font-bold text-lg text-gray-900">
                              {formatCurrency(selectedPOData.amount, selectedPOData.currency)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {selectedPOData.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedPOData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'buybacks' && (
        <>
          {/* Buybacks Tab - Full Implementation */}
          <BuybacksTab
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBuyback={selectedBuyback}
            setSelectedBuyback={setSelectedBuyback}
          />
        </>
      )}
    </div>
  )
}
