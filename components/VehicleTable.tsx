'use client'

import { useState, useMemo } from 'react'
import RiskBadge from './RiskBadge'
import BulkActions from './BulkActions'
import { exportToCSV, exportToPDF } from '@/lib/exportUtils'
import type { VehicleWithRisk } from '@/lib/dummyData'

interface VehicleTableProps {
  vehiclesWithRisk: VehicleWithRisk[]
  onSelectVehicle?: (vehicleId: string) => void
}

type SortField = 'vin' | 'registration' | 'rental_partner' | 'part_status' | 'days_overdue' | 'contract_expiry' | 'risk_score' | null
type SortDirection = 'asc' | 'desc'

export default function VehicleTable({ vehiclesWithRisk, onSelectVehicle }: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filter and sort vehicles
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehiclesWithRisk.filter(
      (vehicle) =>
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (sortField) {
          case 'vin':
            aValue = a.vin
            bValue = b.vin
            break
          case 'registration':
            aValue = a.registration
            bValue = b.registration
            break
          case 'rental_partner':
            aValue = a.rental_partner
            bValue = b.rental_partner
            break
          case 'part_status':
            aValue = a.part_status
            bValue = b.part_status
            break
          case 'days_overdue':
            aValue = a.days_overdue
            bValue = b.days_overdue
            break
          case 'contract_expiry':
            aValue = new Date(a.contract_expiry).getTime()
            bValue = new Date(b.contract_expiry).getTime()
            break
          case 'risk_score':
            aValue = a.risk_score
            bValue = b.risk_score
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
  }, [vehiclesWithRisk, searchTerm, sortField, sortDirection])

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

  // Get part status badge color
  const getPartStatusColor = (status: 'OK' | 'Minor' | 'Critical') => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800'
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800'
      case 'Critical':
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

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAndSortedVehicles.map((v) => v.vehicle_id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAction = (action: string, ids: string[]) => {
    if (action === 'export') {
      const selectedVehicles = filteredAndSortedVehicles.filter((v) => ids.includes(v.vehicle_id))
      exportToCSV(selectedVehicles, 'vehicles-bulk-export')
    } else if (action === 'delete') {
      alert(`Deleting ${ids.length} vehicles... (Demo only)`)
      setSelectedIds(new Set())
    } else if (action === 'updateStatus') {
      alert(`Updating status for ${ids.length} vehicles... (Demo only)`)
      setSelectedIds(new Set())
    }
  }

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedVehicles, 'vehicles-export')
  }

  const handleExportPDF = () => {
    exportToPDF('vehicles-table', 'vehicles-export', 'Vehicle List Report')
  }

  const allSelected = filteredAndSortedVehicles.length > 0 && selectedIds.size === filteredAndSortedVehicles.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredAndSortedVehicles.length

  return (
    <div className="card">
      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selectedIds.size}
          selectedIds={Array.from(selectedIds)}
          onBulkAction={handleBulkAction}
          availableActions={['export', 'updateStatus']}
        />
      )}

      {/* Search and Export Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by VIN or Registration..."
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
        <table id="vehicles-table" className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('vin')}
              >
                <div className="flex items-center gap-2">
                  VIN
                  <SortIcon field="vin" />
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
                onClick={() => handleSort('part_status')}
              >
                <div className="flex items-center gap-2">
                  Part Status
                  <SortIcon field="part_status" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('days_overdue')}
              >
                <div className="flex items-center gap-2">
                  Days Overdue
                  <SortIcon field="days_overdue" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contract_expiry')}
              >
                <div className="flex items-center gap-2">
                  Contract Expiry
                  <SortIcon field="contract_expiry" />
                </div>
              </th>
              <th
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('risk_score')}
              >
                <div className="flex items-center gap-2">
                  Risk
                  <SortIcon field="risk_score" />
                </div>
              </th>
              <th className="table-header-cell">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredAndSortedVehicles.length === 0 ? (
              <tr>
                <td colSpan={9} className="table-cell text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            ) : (
              filteredAndSortedVehicles.map((vehicle) => {
                return (
                  <tr
                    key={vehicle.vehicle_id}
                    className={`hover:bg-gray-50 ${
                      vehicle.days_overdue > 0 || vehicle.part_status === 'Critical'
                        ? 'bg-red-50'
                        : ''
                    } ${selectedIds.has(vehicle.vehicle_id) ? 'bg-primary-50' : ''}`}
                  >
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(vehicle.vehicle_id)}
                        onChange={(e) => handleSelectOne(vehicle.vehicle_id, e.target.checked)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="table-cell font-medium">{vehicle.vin}</td>
                    <td className="table-cell">{vehicle.registration}</td>
                    <td className="table-cell">{vehicle.rental_partner}</td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPartStatusColor(
                          vehicle.part_status
                        )}`}
                      >
                        {vehicle.part_status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {vehicle.days_overdue > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {vehicle.days_overdue}
                        </span>
                      ) : (
                        <span className="text-gray-500">0</span>
                      )}
                    </td>
                    <td className="table-cell">{formatDate(vehicle.contract_expiry)}</td>
                    <td className="table-cell">
                      <RiskBadge score={vehicle.risk_score} />
                    </td>
                    <td className="table-cell">
                      {onSelectVehicle && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectVehicle(vehicle.vehicle_id)
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
