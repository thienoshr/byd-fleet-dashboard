'use client'

import { useState, useEffect } from 'react'
import type { Vehicle, VehicleStatus } from '../schema'

/**
 * Filter state interface
 */
export interface FilterState {
  status: VehicleStatus | 'All'
  location: string
  query: string
}

/**
 * AvailabilityFilters component
 * Provides filtering controls for fleet availability table
 * 
 * @param vehicles - Array of vehicles to derive unique locations from
 * @param onFilter - Callback function called when filters change, receives filter state
 */
interface AvailabilityFiltersProps {
  vehicles: Vehicle[]
  onFilter: (filters: FilterState) => void
}

export default function AvailabilityFilters({ vehicles, onFilter }: AvailabilityFiltersProps) {
  const [status, setStatus] = useState<VehicleStatus | 'All'>('All')
  const [location, setLocation] = useState<string>('All')
  const [query, setQuery] = useState<string>('')

  // Get unique locations from vehicles array
  const uniqueLocations = Array.from(
    new Set(vehicles.map((vehicle) => vehicle.location))
  ).sort()

  // Get all possible statuses
  const allStatuses: VehicleStatus[] = [
    'Available',
    'On Hire',
    'In Workshop',
    'Awaiting Valet',
    'Awaiting Allocation',
  ]

  // Call onFilter whenever any filter changes
  useEffect(() => {
    onFilter({ status, location, query })
  }, [status, location, query, onFilter])

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Dropdown */}
        <div className="flex-1 sm:flex-initial sm:w-48">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as VehicleStatus | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="flex-1 sm:flex-initial sm:w-48">
          <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location-filter"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="All">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="flex-1">
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Search (VIN / Registration / Model)
          </label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search by VIN, registration, or model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}




