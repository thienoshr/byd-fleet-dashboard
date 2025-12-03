'use client'

import { useState, useMemo } from 'react'
import type { Vehicle } from '../schema'

/**
 * AvailabilityTable component
 * Displays fleet vehicles in a table format with status badges and actions
 * 
 * @param vehicles - Array of vehicle objects to display
 * @param onSelect - Callback function called when "View" button is clicked, receives vehicleId
 */
interface AvailabilityTableProps {
  vehicles: Vehicle[]
  onSelect: (vehicleId: string) => void
}

type SortColumn = 'vin' | 'registration' | 'model' | 'location' | 'status' | 'mileage' | 'nextService' | 'healthScore' | null
type SortDirection = 'asc' | 'desc'

export default function AvailabilityTable({ vehicles, onSelect }: AvailabilityTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Handle column header click for sorting
  const handleSort = (column: SortColumn) => {
    if (column === null) return // Don't sort Action column
    
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort vehicles based on current sort column and direction
  const sortedVehicles = useMemo(() => {
    if (!sortColumn) return vehicles

    return [...vehicles].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortColumn) {
        case 'vin':
          aValue = a.vin.toLowerCase()
          bValue = b.vin.toLowerCase()
          break
        case 'registration':
          aValue = a.registration.toLowerCase()
          bValue = b.registration.toLowerCase()
          break
        case 'model':
          aValue = a.model.toLowerCase()
          bValue = b.model.toLowerCase()
          break
        case 'location':
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'mileage':
          aValue = a.mileage
          bValue = b.mileage
          break
        case 'nextService':
          aValue = new Date(a.nextService).getTime()
          bValue = new Date(b.nextService).getTime()
          break
        case 'healthScore':
          aValue = a.healthScore
          bValue = b.healthScore
          break
        default:
          return 0
      }

      // Compare values
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [vehicles, sortColumn, sortDirection])

  // Get sort icon for a column
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      )
    }
    
    if (sortDirection === 'asc') {
      return (
        <span className="ml-1 text-gray-700">
          <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </span>
      )
    } else {
      return (
        <span className="ml-1 text-gray-700">
          <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      )
    }
  }
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  // Format mileage with comma separator
  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString()
  }

  // Get status badge color classes
  const getStatusBadgeColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'On Hire':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'In Workshop':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Awaiting Valet':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Awaiting Allocation':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get health score color based on value
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold'
    if (score >= 60) return 'text-yellow-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  return (
    <div className="card">
      <div className="table-container overflow-x-hidden">
        <table className="table text-xs w-full">
          <thead className="table-header">
            <tr>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[12%]"
                onClick={() => handleSort('vin')}
              >
                <div className="flex items-center justify-between">
                  <span>VIN</span>
                  {getSortIcon('vin')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[10%]"
                onClick={() => handleSort('registration')}
              >
                <div className="flex items-center justify-between">
                  <span>Registration</span>
                  {getSortIcon('registration')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[12%]"
                onClick={() => handleSort('model')}
              >
                <div className="flex items-center justify-between">
                  <span>Model</span>
                  {getSortIcon('model')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[14%]"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[12%]"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[10%]"
                onClick={() => handleSort('mileage')}
              >
                <div className="flex items-center justify-between">
                  <span>Mileage</span>
                  {getSortIcon('mileage')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[12%]"
                onClick={() => handleSort('nextService')}
              >
                <div className="flex items-center justify-between">
                  <span>Next Service</span>
                  {getSortIcon('nextService')}
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100 group px-3 py-2 w-[10%]"
                onClick={() => handleSort('healthScore')}
              >
                <div className="flex items-center justify-between">
                  <span>Health</span>
                  {getSortIcon('healthScore')}
                </div>
              </th>
              <th className="table-header-cell px-3 py-2 w-[8%]">
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedVehicles.length === 0 ? (
              <tr>
                <td colSpan={9} className="table-cell text-center text-gray-500 py-4">
                  No vehicles found
                </td>
              </tr>
            ) : (
              sortedVehicles.map((vehicle) => {
                return (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="table-cell font-mono text-xs px-3 py-2 truncate max-w-[120px]" title={vehicle.vin}>
                      {vehicle.vin}
                    </td>
                    <td className="table-cell font-medium text-xs px-3 py-2 truncate max-w-[100px]" title={vehicle.registration}>
                      {vehicle.registration}
                    </td>
                    <td className="table-cell font-medium text-xs px-3 py-2 truncate max-w-[120px]" title={vehicle.model}>
                      {vehicle.model}
                    </td>
                    <td className="table-cell text-xs px-3 py-2 truncate max-w-[140px]" title={vehicle.location}>
                      {vehicle.location}
                    </td>
                    <td className="table-cell px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="table-cell text-xs px-3 py-2">{formatMileage(vehicle.mileage)}</td>
                    <td className="table-cell text-xs px-3 py-2">{formatDate(vehicle.nextService)}</td>
                    <td className="table-cell px-3 py-2">
                      <span className={`text-xs ${getHealthScoreColor(vehicle.healthScore)}`}>
                        {vehicle.healthScore}
                      </span>
                    </td>
                    <td className="table-cell px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect(vehicle.id)
                        }}
                        className="text-xs px-2 py-1 whitespace-nowrap bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold transition-colors"
                      >
                        View
                      </button>
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




