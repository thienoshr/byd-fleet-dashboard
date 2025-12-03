'use client'

import { useState, useMemo } from 'react'
import { agreementsFull, suppliers, buybackAgreements, invoices, purchaseOrders } from '@/lib/dummyData'

export interface Document {
  id: string
  name: string
  type: 'contract' | 'invoice' | 'compliance' | 'legal' | 'insurance' | 'certification' | 'buyback' | 'purchase_order' | 'other'
  category: 'agreement' | 'supplier' | 'buyback' | 'financial' | 'compliance' | 'other'
  relatedEntityId?: string // ID of related agreement, supplier, etc.
  relatedEntityName?: string // Name of related entity
  uploadDate: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'pending_renewal'
  fileUrl: string
  fileSize?: number
  uploadedBy: string
  tags?: string[]
}

// Generate documents from existing data
const generateDocuments = (): Document[] => {
  const documents: Document[] = []

  // Agreement documents
  agreementsFull.forEach((agreement) => {
    documents.push({
      id: `doc-agreement-${agreement.id}`,
      name: `Rental Agreement - ${agreement.agreementId}`,
      type: 'contract',
      category: 'agreement',
      relatedEntityId: agreement.id,
      relatedEntityName: `${agreement.agreementId} - ${agreement.customer}`,
      uploadDate: agreement.createdAt,
      status: agreement.stage === 'Closed' ? 'expired' : 'valid',
      fileUrl: `/documents/agreements/${agreement.id}/contract.pdf`,
      uploadedBy: agreement.assignedTo,
      tags: ['rental', 'contract', agreement.customer]
    })
  })

  // Supplier documents
  suppliers.forEach((supplier) => {
    supplier.documents.forEach((doc) => {
      documents.push({
        id: doc.id,
        name: doc.name,
        type: doc.type === 'legal' ? 'legal' : doc.type === 'compliance' ? 'compliance' : doc.type === 'insurance' ? 'insurance' : doc.type === 'certification' ? 'certification' : 'other',
        category: 'supplier',
        relatedEntityId: supplier.id,
        relatedEntityName: supplier.companyName,
        uploadDate: doc.uploadDate,
        expiryDate: doc.expiryDate,
        status: doc.status,
        fileUrl: doc.fileUrl,
        uploadedBy: supplier.assignedTo,
        tags: ['supplier', supplier.type, supplier.companyName]
      })
    })
  })

  // Buyback documents
  buybackAgreements.forEach((buyback) => {
    buyback.documents.forEach((docId, index) => {
      documents.push({
        id: `doc-buyback-${buyback.id}-${index}`,
        name: `Buyback Document - ${buyback.buybackId}`,
        type: 'buyback',
        category: 'buyback',
        relatedEntityId: buyback.id,
        relatedEntityName: `${buyback.buybackId} - ${buyback.vehicleRegistration}`,
        uploadDate: buyback.timestamps.agreementCreatedAt,
        status: buyback.status === 'completed' ? 'valid' : 'pending_renewal',
        fileUrl: `/documents/buybacks/${buyback.id}/${docId}.pdf`,
        uploadedBy: buyback.assignedTo,
        tags: ['buyback', buyback.rentalPartner]
      })
    })
  })

  // Invoice documents
  invoices.forEach((invoice) => {
    documents.push({
      id: `doc-invoice-${invoice.id}`,
      name: `Invoice - ${invoice.invoiceNumber}`,
      type: 'invoice',
      category: 'financial',
      relatedEntityId: invoice.id,
      relatedEntityName: `${invoice.invoiceNumber} - ${invoice.customer}`,
      uploadDate: invoice.issueDate,
      status: invoice.status === 'paid' ? 'valid' : invoice.status === 'overdue' ? 'expired' : 'pending_renewal',
      fileUrl: `/documents/invoices/${invoice.id}/invoice.pdf`,
      uploadedBy: invoice.createdBy,
      tags: ['invoice', invoice.type, invoice.customer]
    })
  })

  // Purchase Order documents
  purchaseOrders.forEach((po) => {
    documents.push({
      id: `doc-po-${po.id}`,
      name: `Purchase Order - ${po.poNumber}`,
      type: 'purchase_order',
      category: 'financial',
      relatedEntityId: po.id,
      relatedEntityName: `${po.poNumber} - ${po.supplierName}`,
      uploadDate: po.issueDate,
      status: po.status === 'delivered' ? 'valid' : 'pending_renewal',
      fileUrl: `/documents/purchase-orders/${po.id}/po.pdf`,
      uploadedBy: po.createdBy,
      tags: ['purchase-order', po.supplierName]
    })
  })

  return documents
}

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(generateDocuments())
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'agreement' | 'supplier' | 'buyback' | 'financial' | 'compliance' | 'other'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'contract' | 'invoice' | 'compliance' | 'legal' | 'insurance' | 'certification' | 'buyback' | 'purchase_order' | 'other'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'expired' | 'pending_renewal'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
      const matchesType = typeFilter === 'all' || doc.type === typeFilter
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      const matchesSearch =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.relatedEntityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesType && matchesStatus && matchesSearch
    })
  }, [categoryFilter, typeFilter, statusFilter, searchQuery, documents])

  const getStatusColor = (status: string) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return '📄'
      case 'invoice':
        return '🧾'
      case 'compliance':
        return '✅'
      case 'legal':
        return '⚖️'
      case 'insurance':
        return '🛡️'
      case 'certification':
        return '🏆'
      case 'buyback':
        return '💰'
      case 'purchase_order':
        return '📋'
      default:
        return '📎'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
        <p className="mt-2 text-gray-600">Centralized repository for all fleet management documents</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 py-2">Category:</span>
              {(['all', 'agreement', 'supplier', 'buyback', 'financial', 'compliance', 'other'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    categoryFilter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
              {(['all', 'contract', 'invoice', 'compliance', 'legal', 'insurance', 'certification', 'buyback', 'purchase_order', 'other'] as const).map((type) => (
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
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 py-2">Status:</span>
              {(['all', 'valid', 'expired', 'pending_renewal'] as const).map((status) => (
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
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No documents found
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{doc.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{doc.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status.replace('_', ' ')}
                </span>
              </div>
              
              {doc.relatedEntityName && (
                <p className="text-xs text-gray-600 mb-2">
                  Related: {doc.relatedEntityName}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Uploaded: {formatDate(doc.uploadDate)}</span>
                {doc.expiryDate && (
                  <span className={doc.status === 'expired' ? 'text-red-600 font-semibold' : ''}>
                    Expires: {formatDate(doc.expiryDate)}
                  </span>
                )}
              </div>

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {doc.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
            onClick={() => setSelectedDocument(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">Document Details</p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getTypeIcon(selectedDocument.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{selectedDocument.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{selectedDocument.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                      {selectedDocument.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Upload Date</label>
                    <p className="text-gray-900">{formatDate(selectedDocument.uploadDate)}</p>
                  </div>
                  {selectedDocument.expiryDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                      <p className={`text-gray-900 ${selectedDocument.status === 'expired' ? 'text-red-600 font-semibold' : ''}`}>
                        {formatDate(selectedDocument.expiryDate)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Uploaded By</label>
                    <p className="text-gray-900">{selectedDocument.uploadedBy}</p>
                  </div>
                  {selectedDocument.fileSize && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">File Size</label>
                      <p className="text-gray-900">{formatFileSize(selectedDocument.fileSize)}</p>
                    </div>
                  )}
                </div>

                {selectedDocument.relatedEntityName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Related Entity</label>
                    <p className="text-gray-900">{selectedDocument.relatedEntityName}</p>
                  </div>
                )}

                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDocument.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // In a real app, this would download/open the document
                      alert(`Opening document: ${selectedDocument.name}\n\nIn a real system, this would open the document at: ${selectedDocument.fileUrl}`)
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    View Document
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would download the document
                      alert(`Downloading document: ${selectedDocument.name}`)
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Download
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


