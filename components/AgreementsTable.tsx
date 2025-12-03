'use client'

import { useState, useMemo } from 'react'
import { exportToCSV, exportToPDF } from '@/lib/exportUtils'
import type { Agreement } from '@/lib/dummyData'

interface AgreementsTableProps {
  agreements: Agreement[]
  onSelectAgreement?: (contractNumber: string) => void
}

type SortField = 'contract_number' | 'registration' | 'rental_partner' | 'driverName' | 'start_date' | 'end_date' | 'status' | null
type SortDirection = 'asc' | 'desc'

export default function AgreementsTable({ agreements, onSelectAgreement }: AgreementsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Filter and sort agreements
  const filteredAndSortedAgreements = useMemo(() => {
    let filtered = agreements.filter(
      (agreement) =>
        agreement.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.driverLicense?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (sortField) {
          case 'contract_number':
            aValue = a.contract_number
            bValue = b.contract_number
            break
          case 'registration':
            aValue = a.registration
            bValue = b.registration
            break
          case 'rental_partner':
            aValue = a.rental_partner
            bValue = b.rental_partner
            break
          case 'driverName':
            aValue = a.driverName || ''
            bValue = b.driverName || ''
            break
          case 'start_date':
            aValue = new Date(a.start_date).getTime()
            bValue = new Date(b.start_date).getTime()
            break
          case 'end_date':
            aValue = new Date(a.end_date).getTime()
            bValue = new Date(b.end_date).getTime()
            break
          case 'status':
            aValue = a.status
            bValue = b.status
            break
          default:
            return 0
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        } else {
          return sortDirection === 'asc'
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number)
        }
      })
    }

    return filtered
  }, [agreements, searchTerm, sortField, sortDirection])

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Check if contract is overdue
  const isOverdue = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  // Get status badge color
  const getStatusBadgeColor = (status: 'Pending' | 'Signed' | 'Overdue') => {
    switch (status) {
      case 'Signed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>
  }

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedAgreements, 'agreements-export')
  }

  const handleExportPDF = () => {
    exportToPDF('agreements-table', 'agreements-export', 'Agreements Report')
  }

  return (
    <div className="card">
      {/* Search and Export Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Contract ID, Registration, or Driver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs"
          >
            <span className="text-xs">📄</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs"
          >
            <span className="text-xs">📑</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table id="agreements-table" className="table">
          <thead className="table-header">
            <tr>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contract_number')}
              >
                <div className="flex items-center gap-2">
                  Contract ID
                  <SortIcon field="contract_number" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('registration')}
              >
                <div className="flex items-center gap-2">
                  Registration
                  <SortIcon field="registration" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rental_partner')}
              >
                <div className="flex items-center gap-2">
                  Rental Partner
                  <SortIcon field="rental_partner" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('driverName')}
              >
                <div className="flex items-center gap-2">
                  Driver
                  <SortIcon field="driverName" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('start_date')}
              >
                <div className="flex items-center gap-2">
                  Start Date
                  <SortIcon field="start_date" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('end_date')}
              >
                <div className="flex items-center gap-2">
                  End Date
                  <SortIcon field="end_date" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="table-header-cell">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredAndSortedAgreements.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-cell text-center text-gray-500">
                  No agreements found
                </td>
              </tr>
            ) : (
              filteredAndSortedAgreements.map((agreement) => {
                const overdue = isOverdue(agreement.end_date)
                return (
                  <tr
                    key={agreement.contract_number}
                    className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}
                  >
                    <td className="table-cell font-medium">
                      {agreement.contract_number}
                    </td>
                    <td className="table-cell">{agreement.registration}</td>
                    <td className="table-cell">{agreement.rental_partner}</td>
                    <td className="table-cell">
                      {agreement.driverName ? (
                        <div>
                          <div className="font-medium">{agreement.driverName}</div>
                          {agreement.driverLicense && (
                            <div className="text-xs text-gray-500">License: {agreement.driverLicense}</div>
                          )}
                          {agreement.driverPhone && (
                            <div className="text-xs text-gray-500">{agreement.driverPhone}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="table-cell">{formatDate(agreement.start_date)}</td>
                    <td
                      className={`table-cell ${overdue ? 'text-red-600 font-semibold' : ''}`}
                    >
                      {formatDate(agreement.end_date)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          agreement.status
                        )}`}
                      >
                        {agreement.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {onSelectAgreement && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectAgreement(agreement.contract_number)
                          }}
                          className="text-xs px-2 py-1 whitespace-nowrap bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold transition-colors"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}




