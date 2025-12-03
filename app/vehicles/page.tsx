'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import VehicleTable from '@/components/VehicleTable'
import { vehiclesWithRisk, vehicles as comprehensiveVehicles, agreementsFull } from '@/lib/dummyData'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import VehicleInfoPanel from '@/components/VehicleInfoPanel'
import VehicleUtilizationPanel from '@/components/VehicleUtilizationPanel'
import VehicleMaintenancePanel from '@/components/VehicleMaintenancePanel'
import VehicleLocationPanel from '@/components/VehicleLocationPanel'
import VehicleCompliancePanel from '@/components/VehicleCompliancePanel'

type TabType = 'overview' | 'health' | 'utilization' | 'maintenance' | 'location' | 'compliance'
type RentalStatusFilter = 'all' | 'available' | 'on-hire' | 'reserved'

export default function VehiclesPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [rentalStatusFilter, setRentalStatusFilter] = useState<RentalStatusFilter>('all')

  // Close modal when clicking navigation links
  useEffect(() => {
    if (!selectedVehicleId) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      const nav = target.closest('nav')
      
      if (link && nav) {
        setSelectedVehicleId(null)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [selectedVehicleId])

  // Reset to overview tab when vehicle changes
  useEffect(() => {
    if (selectedVehicleId) {
      setActiveTab('overview')
    }
  }, [selectedVehicleId])

  // Get rental status for a vehicle
  const getRentalStatus = useCallback((vehicleId: string): 'available' | 'on-hire' | 'reserved' => {
    try {
      const now = new Date()
      // Normalize vehicle ID - handle both "BYD-V001" and "V001" formats
      const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
      
      // Find active agreement (currently on hire)
      const activeAgreement = agreementsFull
        .filter((a) => {
          const aId = a.vehicleId.startsWith('BYD-') ? a.vehicleId : `BYD-${a.vehicleId}`
          return aId === normalizedId || a.vehicleId === vehicleId
        })
        .filter((a) => {
          try {
            const endDate = new Date(a.endAt)
            const startDate = new Date(a.startAt)
            return endDate > now && 
                   startDate <= now &&
                   a.stage !== 'Vehicle Returned' && 
                   a.stage !== 'Closed' &&
                   a.stage !== 'Charges Finalised'
          } catch {
            return false
          }
        })
        .sort((a, b) => {
          try {
            return new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
          } catch {
            return 0
          }
        })[0]

      if (activeAgreement) return 'on-hire'

      // Find upcoming reservation
      const upcomingAgreement = agreementsFull
        .filter((a) => {
          const aId = a.vehicleId.startsWith('BYD-') ? a.vehicleId : `BYD-${a.vehicleId}`
          return aId === normalizedId || a.vehicleId === vehicleId
        })
        .filter((a) => {
          try {
            const startDate = new Date(a.startAt)
            return startDate > now && a.stage !== 'Closed'
          } catch {
            return false
          }
        })
        .sort((a, b) => {
          try {
            return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
          } catch {
            return 0
          }
        })[0]

      if (upcomingAgreement) return 'reserved'
      return 'available'
    } catch (error) {
      console.error('Error getting rental status:', error)
      return 'available'
    }
  }, [])

  // Filter vehicles by rental status
  const filteredVehicles = useMemo(() => {
    if (rentalStatusFilter === 'all') return vehiclesWithRisk
    
    return vehiclesWithRisk.filter((vehicle) => {
      const status = getRentalStatus(vehicle.vehicle_id)
      return status === rentalStatusFilter
    })
  }, [vehiclesWithRisk, rentalStatusFilter, getRentalStatus])

  const selectedVehicle = selectedVehicleId 
    ? comprehensiveVehicles.find(v => v.id === selectedVehicleId)
    : null

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'utilization', label: 'Utilization', icon: '📊' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'compliance', label: 'Compliance', icon: '✅' }
  ]

  const renderTabContent = () => {
    if (!selectedVehicle) return null
    
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <VehicleInfoPanel vehicle={selectedVehicle} />
            <VehicleHealthPanel vehicle={selectedVehicle} />
          </div>
        )
      case 'health':
        return <VehicleHealthPanel vehicle={selectedVehicle} />
      case 'utilization':
        return <VehicleUtilizationPanel vehicle={selectedVehicle} />
      case 'maintenance':
        return <VehicleMaintenancePanel vehicle={selectedVehicle} />
      case 'location':
        return <VehicleLocationPanel vehicle={selectedVehicle} />
      case 'compliance':
        return <VehicleCompliancePanel vehicle={selectedVehicle} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
        <p className="mt-2 text-gray-600">View and manage all vehicles in the fleet</p>
      </div>

      {/* Rental Status Toggle Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Rental Status:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRentalStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  rentalStatusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRentalStatusFilter('available')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  rentalStatusFilter === 'available'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setRentalStatusFilter('on-hire')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  rentalStatusFilter === 'on-hire'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On Hire
              </button>
              <button
                onClick={() => setRentalStatusFilter('reserved')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  rentalStatusFilter === 'reserved'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reserved
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            Showing {filteredVehicles.length} of {vehiclesWithRisk.length} vehicles
          </div>
        </div>
      </div>

      <VehicleTable 
        vehiclesWithRisk={filteredVehicles}
        onSelectVehicle={setSelectedVehicleId}
      />

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedVehicleId(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedVehicle.registration} • {selectedVehicle.model}</p>
                </div>
                <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
                <div className="flex space-x-1 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="btn-primary">Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
