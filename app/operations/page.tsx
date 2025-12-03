'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import BottleneckDetector from '@/components/BottleneckDetector'
import AgreementTracker from '@/components/AgreementTracker'
import SlaPartnerTracker from '@/components/SlaPartnerTracker'
import TurnaroundTimer from '@/components/TurnaroundTimer'
import VehicleHealthPanel from '@/components/VehicleHealthPanel'
import QuickActionsSidebar from '@/components/QuickActionsSidebar'
import PerformanceKpis from '@/components/PerformanceKpis'
import FleetMap from '@/components/FleetMap'
import VehicleTable from '@/components/VehicleTable'
import VehicleInfoPanel from '@/components/VehicleInfoPanel'
import VehicleUtilizationPanel from '@/components/VehicleUtilizationPanel'
import VehicleMaintenancePanel from '@/components/VehicleMaintenancePanel'
import VehicleLocationPanel from '@/components/VehicleLocationPanel'
import VehicleCompliancePanel from '@/components/VehicleCompliancePanel'
import VehicleRecallAlert from '@/components/VehicleRecallAlert'
import AvailabilityTable from '@/modules/fleet-availability/components/AvailabilityTable'
import AvailabilityFilters, { type FilterState } from '@/modules/fleet-availability/components/AvailabilityFilters'
import { vehicles } from '@/lib/dummyData'
import { vehicles as fleetAvailabilityVehicles } from '@/modules/fleet-availability/schema'
import { vehiclesWithRisk, vehicles as comprehensiveVehicles, agreementsFull } from '@/lib/dummyData'
import type { Vehicle } from '@/lib/dummyData'
import type { Vehicle as FleetAvailabilityVehicle } from '@/modules/fleet-availability/schema'
import type { AgreementFull } from '@/lib/dummyData'

type TabType = 'overview' | 'health' | 'utilization' | 'maintenance' | 'location' | 'compliance'

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet-availability' | 'vehicles' | 'vor' | 'workflows'>('dashboard')
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>(vehicles)
  
  // Fleet Availability state
  const [filteredFleetVehicles, setFilteredFleetVehicles] = useState<FleetAvailabilityVehicle[]>(fleetAvailabilityVehicles)
  const [selectedFleetVehicleId, setSelectedFleetVehicleId] = useState<string | null>(null)
  
  // Vehicles state
  const [rentalStatusFilter, setRentalStatusFilter] = useState<'all' | 'available' | 'on-hire' | 'reserved'>('all')
  const [vehicleDetailTab, setVehicleDetailTab] = useState<TabType>('overview')
  
  // VOR state
  const [vorSearchTerm, setVorSearchTerm] = useState('')
  const [vorFilterStage, setVorFilterStage] = useState<'all' | string>('all')
  const [selectedVorVehicleId, setSelectedVorVehicleId] = useState<string | null>(null)
  
  // Workflows state
  const [workflowTypeFilter, setWorkflowTypeFilter] = useState<'all' | 'contract_processing' | 'supplier_onboarding' | 'buyback_processing' | 'penalty_processing' | 'breach_resolution' | 'document_renewal'>('all')
  const [workflowStatusFilter, setWorkflowStatusFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const selectedVehicle = localVehicles.find((v) => v.id === selectedVehicleId) || null

  const handleAction = (action: string, payload: Record<string, any>) => {
    if (action === 'requestParts') {
      setLocalVehicles((prev) =>
        prev.map((v) =>
          v.id === payload.vehicleId
            ? {
                ...v,
                availability_status: 'In Workshop',
                stage_timestamps: {
                  ...v.stage_timestamps,
                  partsRequestedAt: new Date().toISOString(),
                },
              }
            : v
        )
      )
    }
  }

  // Fleet Availability handlers
  const handleFleetFilterChange = (filters: FilterState) => {
    let filtered = [...fleetAvailabilityVehicles]

    if (filters.status !== 'All') {
      filtered = filtered.filter((v) => v.availability_status === filters.status)
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter((v) => v.location === filters.location)
    }

    if (filters.query) {
      const searchLower = filters.query.toLowerCase()
      filtered = filtered.filter(
        (v) =>
          v.vin.toLowerCase().includes(searchLower) ||
          v.registration.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower)
      )
    }

    setFilteredFleetVehicles(filtered)
  }

  const getComprehensiveVehicle = (vehicleId: string) => {
    const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
    return comprehensiveVehicles.find((v) => v.id === normalizedId || v.id === vehicleId) || null
  }

  const getActiveAgreement = (vehicleId: string): AgreementFull | null => {
    const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
    const now = new Date()
    return agreementsFull
      .filter((a) => a.vehicleId === normalizedId || a.vehicleId === vehicleId)
      .filter((a) => {
        const endDate = new Date(a.endAt)
        const startDate = new Date(a.startAt)
        return endDate > now && 
               startDate <= now &&
               a.stage !== 'Vehicle Returned' && 
               a.stage !== 'Closed' &&
               a.stage !== 'Charges Finalised'
      })
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0] || null
  }

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

  const selectedFleetVehicle = selectedFleetVehicleId 
    ? filteredFleetVehicles.find(v => v.id === selectedFleetVehicleId) || null
    : null
  const compFleetVehicle = selectedFleetVehicleId ? getComprehensiveVehicle(selectedFleetVehicleId) : null
  const activeFleetAgreement = selectedFleetVehicleId ? getActiveAgreement(selectedFleetVehicleId) : null

  // Vehicles handlers
  const getRentalStatus = useCallback((vehicleId: string): 'available' | 'on-hire' | 'reserved' => {
    try {
      const now = new Date()
      const normalizedId = vehicleId.startsWith('BYD-') ? vehicleId : `BYD-${vehicleId}`
      
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

  const filteredVehicles = useMemo(() => {
    if (rentalStatusFilter === 'all') return vehiclesWithRisk
    
    return vehiclesWithRisk.filter((vehicle) => {
      const status = getRentalStatus(vehicle.vehicle_id)
      return status === rentalStatusFilter
    })
  }, [vehiclesWithRisk, rentalStatusFilter, getRentalStatus])

  const selectedVehicleData = selectedVehicleId 
    ? comprehensiveVehicles.find(v => v.id === selectedVehicleId)
    : null

  const vehicleTabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'utilization', label: 'Utilization', icon: '📊' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'compliance', label: 'Compliance', icon: '✅' }
  ]

  const renderVehicleTabContent = () => {
    if (!selectedVehicleData) return null
    
    switch (vehicleDetailTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <VehicleInfoPanel vehicle={selectedVehicleData} />
            <VehicleHealthPanel vehicle={selectedVehicleData} />
          </div>
        )
      case 'health':
        return <VehicleHealthPanel vehicle={selectedVehicleData} />
      case 'utilization':
        return <VehicleUtilizationPanel vehicle={selectedVehicleData} />
      case 'maintenance':
        return <VehicleMaintenancePanel vehicle={selectedVehicleData} />
      case 'location':
        return <VehicleLocationPanel vehicle={selectedVehicleData} />
      case 'compliance':
        return <VehicleCompliancePanel vehicle={selectedVehicleData} />
      default:
        return null
    }
  }

  // VOR handlers
  const vorVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const ts = v.stage_timestamps || {}
      const isVor = v.availability_status === 'In Workshop' ||
                   (ts.partsRequestedAt && v.availability_status !== 'Available') ||
                   v.availability_status === 'Awaiting Valet' ||
                   v.availability_status === 'Awaiting Documents' ||
                   v.availability_status === 'Awaiting Allocation'
      if (!isVor) return false

      if (vorSearchTerm) {
        const query = vorSearchTerm.toLowerCase()
        const matches = 
          v.model.toLowerCase().includes(query) ||
          v.registration.toLowerCase().includes(query) ||
          v.vin.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query) ||
          v.rental_partner.toLowerCase().includes(query)
        if (!matches) return false
      }

      if (vorFilterStage !== 'all') {
        if (vorFilterStage === 'In Workshop' && v.availability_status !== 'In Workshop') return false
        if (vorFilterStage === 'Awaiting Parts' && !(ts.partsRequestedAt && v.availability_status !== 'Available')) return false
        if (vorFilterStage === 'Awaiting Valet' && v.availability_status !== 'Awaiting Valet') return false
        if (vorFilterStage === 'Awaiting Documents' && v.availability_status !== 'Awaiting Documents') return false
      }

      return true
    })
  }, [vorSearchTerm, vorFilterStage])

  const selectedVorVehicle = selectedVorVehicleId 
    ? vehicles.find(v => v.id === selectedVorVehicleId)
    : null

  const getTimeInStage = (vehicle: Vehicle): number | null => {
    const ts = vehicle.stage_timestamps || {}
    if (vehicle.availability_status === 'In Workshop') {
      const workshopIn = ts.workshopInAt || ts.inspectedAt
      if (workshopIn) {
        return Math.floor((Date.now() - new Date(workshopIn).getTime()) / 1000)
      }
    } else if (ts.partsRequestedAt && vehicle.availability_status !== 'Available') {
      return Math.floor((Date.now() - new Date(ts.partsRequestedAt).getTime()) / 1000)
    }
    return null
  }

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return '—'
    const totalHours = Math.floor(seconds / 3600)
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    
    if (months > 0) {
      return `${months}m ${remainingDays}d ${hours}h`
    } else if (days > 0) {
      return `${days}d ${hours}h`
    }
    return `${hours}h`
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  const capitalizeProgress = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Workflows data
  interface Workflow {
    id: string
    name: string
    description: string
    type: 'contract_processing' | 'supplier_onboarding' | 'buyback_processing' | 'penalty_processing' | 'breach_resolution' | 'document_renewal'
    status: 'active' | 'paused' | 'draft'
    triggers: string[]
    steps: WorkflowStep[]
    createdAt: string
    lastRun?: string
    runCount: number
  }

  interface WorkflowStep {
    id: string
    name: string
    type: 'automated' | 'manual' | 'approval' | 'notification'
    action: string
    conditions?: string[]
    assignTo?: string
    order: number
  }

  const sampleWorkflows: Workflow[] = [
    {
      id: 'wf-001',
      name: 'Contract Processing Workflow',
      description: 'Automated workflow for processing new rental contracts',
      type: 'contract_processing',
      status: 'active',
      triggers: ['New agreement created', 'Agreement signed'],
      steps: [
        {
          id: 'step-1',
          name: 'Validate Contract Details',
          type: 'automated',
          action: 'Validate customer information, vehicle availability, and terms',
          order: 1
        },
        {
          id: 'step-2',
          name: 'Generate Contract Document',
          type: 'automated',
          action: 'Generate PDF contract document',
          order: 2
        },
        {
          id: 'step-3',
          name: 'Send for Signature',
          type: 'automated',
          action: 'Send contract to customer for e-signature',
          order: 3
        },
        {
          id: 'step-4',
          name: 'Manager Approval',
          type: 'approval',
          action: 'Require manager approval for contracts over £10,000',
          conditions: ['Contract value > £10,000'],
          assignTo: 'Operations Manager',
          order: 4
        },
        {
          id: 'step-5',
          name: 'Notify Operations Team',
          type: 'notification',
          action: 'Notify operations team to prepare vehicle',
          order: 5
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      lastRun: '2025-01-20T14:30:00Z',
      runCount: 45
    },
    {
      id: 'wf-002',
      name: 'Supplier Onboarding Workflow',
      description: 'Automated workflow for onboarding new suppliers',
      type: 'supplier_onboarding',
      status: 'active',
      triggers: ['New supplier created'],
      steps: [
        {
          id: 'step-1',
          name: 'Request Required Documents',
          type: 'automated',
          action: 'Send email requesting legal documents, insurance, certifications',
          order: 1
        },
        {
          id: 'step-2',
          name: 'Document Verification',
          type: 'manual',
          action: 'Review and verify submitted documents',
          assignTo: 'Compliance Team',
          order: 2
        },
        {
          id: 'step-3',
          name: 'Background Check',
          type: 'automated',
          action: 'Run automated background check',
          order: 3
        },
        {
          id: 'step-4',
          name: 'Compliance Approval',
          type: 'approval',
          action: 'Require compliance team approval',
          assignTo: 'Compliance Manager',
          order: 4
        },
        {
          id: 'step-5',
          name: 'Create Supplier Account',
          type: 'automated',
          action: 'Create supplier account and send welcome email',
          order: 5
        }
      ],
      createdAt: '2024-02-01T09:00:00Z',
      lastRun: '2025-01-20T11:15:00Z',
      runCount: 12
    },
    {
      id: 'wf-003',
      name: 'Penalty Processing Workflow',
      description: 'Automated workflow for processing contract penalties',
      type: 'penalty_processing',
      status: 'active',
      triggers: ['Mileage overage detected', 'Late return detected', 'Damage detected'],
      steps: [
        {
          id: 'step-1',
          name: 'Calculate Penalty Amount',
          type: 'automated',
          action: 'Calculate penalty based on contract terms',
          order: 1
        },
        {
          id: 'step-2',
          name: 'Create Penalty Record',
          type: 'automated',
          action: 'Create penalty record in system',
          order: 2
        },
        {
          id: 'step-3',
          name: 'Generate Invoice',
          type: 'automated',
          action: 'Generate penalty invoice',
          order: 3
        },
        {
          id: 'step-4',
          name: 'Send Notification',
          type: 'notification',
          action: 'Notify customer of penalty',
          order: 4
        },
        {
          id: 'step-5',
          name: 'Manager Review',
          type: 'approval',
          action: 'Require manager review for penalties over £500',
          conditions: ['Penalty amount > £500'],
          assignTo: 'Finance Manager',
          order: 5
        }
      ],
      createdAt: '2024-03-10T10:00:00Z',
      lastRun: '2025-01-19T16:45:00Z',
      runCount: 28
    },
    {
      id: 'wf-004',
      name: 'Document Renewal Reminder',
      description: 'Automated workflow for document renewal reminders',
      type: 'document_renewal',
      status: 'active',
      triggers: ['Document expiring in 30 days', 'Document expiring in 7 days'],
      steps: [
        {
          id: 'step-1',
          name: 'Check Document Expiry',
          type: 'automated',
          action: 'Check all documents for upcoming expiry',
          order: 1
        },
        {
          id: 'step-2',
          name: 'Send Reminder Email',
          type: 'notification',
          action: 'Send reminder email to supplier/contact',
          order: 2
        },
        {
          id: 'step-3',
          name: 'Update Status',
          type: 'automated',
          action: 'Update document status to pending_renewal',
          order: 3
        }
      ],
      createdAt: '2024-04-01T09:00:00Z',
      lastRun: '2025-01-20T08:00:00Z',
      runCount: 156
    }
  ]

  const [workflows] = useState<Workflow[]>(sampleWorkflows)

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesType = workflowTypeFilter === 'all' || wf.type === workflowTypeFilter
      const matchesStatus = workflowStatusFilter === 'all' || wf.status === workflowStatusFilter
      return matchesType && matchesStatus
    })
  }, [workflowTypeFilter, workflowStatusFilter, workflows])

  const selectedWorkflowData = selectedWorkflow
    ? workflows.find((wf) => wf.id === selectedWorkflow)
    : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatWorkflowDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Reset vehicle detail tab when vehicle changes
  useEffect(() => {
    if (selectedVehicleId) {
      setVehicleDetailTab('overview')
    }
  }, [selectedVehicleId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
        <p className="mt-2 text-gray-600">Operational dashboard and fleet management tools</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('fleet-availability')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fleet-availability'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fleet Availability
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('vor')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vor'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            VOR
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workflows'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workflows
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PerformanceKpis />
            <BottleneckDetector />
            <AgreementTracker />
            <SlaPartnerTracker />
            <TurnaroundTimer />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <QuickActionsSidebar onAction={handleAction} />
            <FleetMap vehicles={localVehicles} onVehicleSelect={setSelectedVehicleId} />
          </div>
        </div>
      )}

      {/* Fleet Availability Tab */}
      {activeTab === 'fleet-availability' && (
        <div className="space-y-6">
          <AvailabilityFilters vehicles={fleetAvailabilityVehicles} onFilter={handleFleetFilterChange} />
          <AvailabilityTable 
            vehicles={filteredFleetVehicles} 
            onSelect={(vehicleId) => setSelectedFleetVehicleId(vehicleId)}
          />

          {/* Vehicle Details Modal */}
          {selectedFleetVehicle && compFleetVehicle && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedFleetVehicleId(null)} />
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                      <p className="text-sm text-gray-500 mt-1">{compFleetVehicle.registration} • {compFleetVehicle.model}</p>
                    </div>
                    <button id="close-modal" onClick={() => setSelectedFleetVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center">×</button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                      {activeFleetAgreement ? (
                        <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Agreement Information</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1.5">Contract ID</label>
                              <p className="text-sm text-gray-900 font-mono font-semibold">{activeFleetAgreement.agreementId}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1.5">Customer</label>
                              <p className="text-sm text-gray-900 font-medium">{activeFleetAgreement.customer}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1.5">Stage</label>
                              <p className="mt-0.5">
                                <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {activeFleetAgreement.stage}
                                </span>
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1.5">Created At</label>
                              <p className="text-sm text-gray-900">{formatDateTime(activeFleetAgreement.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-600">No active agreement for this vehicle</div>
                        </div>
                      )}
                      {compFleetVehicle.recall && (
                        <div>
                          <VehicleRecallAlert vehicle={compFleetVehicle} />
                        </div>
                      )}
                      <div>
                        <VehicleHealthPanel vehicle={compFleetVehicle} />
                      </div>
                    </div>
                  </div>
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button id="close-modal" onClick={() => setSelectedFleetVehicleId(null)} className="btn-primary">Close</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
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
          {selectedVehicleData && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedVehicleId(null)} />
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                      <p className="text-sm text-gray-500 mt-1">{selectedVehicleData.registration} • {selectedVehicleData.model}</p>
                    </div>
                    <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                  </div>
                  <div className="border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
                    <div className="flex space-x-1 min-w-max">
                      {vehicleTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setVehicleDetailTab(tab.id)}
                          className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                            vehicleDetailTab === tab.id
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
                  <div className="flex-1 overflow-y-auto p-6">
                    {renderVehicleTabContent()}
                  </div>
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="btn-primary">Close</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VOR Tab */}
      {activeTab === 'vor' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={vorSearchTerm}
                onChange={(e) => setVorSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={vorFilterStage}
                onChange={(e) => setVorFilterStage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stages</option>
                <option value="In Workshop">In Workshop</option>
                <option value="Awaiting Parts">Awaiting Parts</option>
                <option value="Awaiting Valet">Awaiting Valet</option>
                <option value="Awaiting Documents">Awaiting Documents</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Progress</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vorVehicles.map((v) => {
                    const timeInStage = getTimeInStage(v)
                    const duration = formatDuration(timeInStage)
                    const isCritical = timeInStage && ((v.availability_status === 'In Workshop' && timeInStage > 48 * 3600) || (v.stage_timestamps?.partsRequestedAt && timeInStage > 72 * 3600))
                    return (
                      <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-semibold">{v.registration}</td>
                        <td className="py-3 px-4 text-gray-900">{v.model}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            v.availability_status === 'In Workshop' ? 'bg-red-100 text-red-800' :
                            v.availability_status === 'Awaiting Parts' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {v.availability_status}
                          </span>
                        </td>
                        <td className={`py-3 px-4 font-semibold ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                          {duration}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {v.currentProgress ? capitalizeProgress(v.currentProgress) : '—'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{v.location}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedVorVehicleId(v.id)}
                            className="px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold transition-colors text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* VOR Vehicle Details Modal */}
          {selectedVorVehicle && (
            <div className="fixed inset-0 z-[50] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto z-[60]">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">VOR Vehicle Details - {selectedVorVehicle.model} ({selectedVorVehicle.registration})</h2>
                  <button id="close-modal" onClick={() => setSelectedVorVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">VOR Status & Timeline</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedVorVehicle.availability_status === 'In Workshop' ? 'bg-red-100 text-red-800' :
                            selectedVorVehicle.availability_status === 'Awaiting Parts' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedVorVehicle.availability_status}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Time in Current Stage:</span>
                          <span className={`ml-2 font-semibold ${getTimeInStage(selectedVorVehicle) && ((selectedVorVehicle.availability_status === 'In Workshop' && getTimeInStage(selectedVorVehicle)! > 48 * 3600) || (selectedVorVehicle.stage_timestamps?.partsRequestedAt && getTimeInStage(selectedVorVehicle)! > 72 * 3600)) ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDuration(getTimeInStage(selectedVorVehicle))}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Current Progress:</span>
                          <span className="ml-2 text-gray-900">{selectedVorVehicle.currentProgress ? capitalizeProgress(selectedVorVehicle.currentProgress) : '—'}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Location:</span>
                          <span className="ml-2 text-gray-900">{selectedVorVehicle.location}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Rental Partner:</span>
                          <span className="ml-2 text-gray-900">{selectedVorVehicle.rental_partner}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Returned At:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.stage_timestamps?.returnedAt)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Inspected At:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.stage_timestamps?.inspectedAt)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Workshop In At:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.stage_timestamps?.workshopInAt)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Parts Requested At:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.stage_timestamps?.partsRequestedAt)}</span>
                        </div>
                        {selectedVorVehicle.workshopEta && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Workshop ETA:</span>
                            <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.workshopEta)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedVorVehicle.partsInfo && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Depot:</span>
                          <span className="ml-2 text-gray-900">{selectedVorVehicle.partsInfo.depot || '—'}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Part Name:</span>
                          <span className="ml-2 text-gray-900">{selectedVorVehicle.partsInfo.partName || '—'}</span>
                        </div>
                        {selectedVorVehicle.partsInfo.partNumber && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Part Number:</span>
                            <span className="ml-2 text-gray-900 font-mono">{selectedVorVehicle.partsInfo.partNumber}</span>
                          </div>
                        )}
                        {selectedVorVehicle.partsInfo.orderDate && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Order Date:</span>
                            <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.partsInfo.orderDate)}</span>
                          </div>
                        )}
                        {selectedVorVehicle.partsInfo.eta && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Parts ETA:</span>
                            <span className="ml-2 text-gray-900">{formatDate(selectedVorVehicle.partsInfo.eta)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedVorVehicle.recall && (
                    <div className="border-t border-gray-200 pt-6">
                      <VehicleRecallAlert vehicle={selectedVorVehicle} />
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-6">
                    <VehicleHealthPanel vehicle={selectedVorVehicle} />
                  </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                  <button id="close-modal" onClick={() => setSelectedVorVehicleId(null)} className="btn-primary">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
                {(['all', 'contract_processing', 'supplier_onboarding', 'buyback_processing', 'penalty_processing', 'breach_resolution', 'document_renewal'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWorkflowTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      workflowTypeFilter === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All' : getTypeLabel(type)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 py-2">Status:</span>
                {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setWorkflowStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      workflowStatusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkflows.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No workflows found
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{getTypeLabel(workflow.type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium text-gray-900">{workflow.steps.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Runs:</span>
                      <span className="font-medium text-gray-900">{workflow.runCount}</span>
                    </div>
                    {workflow.lastRun && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Last Run:</span>
                        <span className="font-medium text-gray-900">{formatWorkflowDate(workflow.lastRun)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedWorkflow(workflow.id)}
                      className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Workflow Detail Modal */}
          {selectedWorkflowData && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
                onClick={() => setSelectedWorkflow(null)}
              />
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                <div
                  className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedWorkflowData.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedWorkflowData.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWorkflow(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedWorkflowData.status)}`}>
                            {selectedWorkflowData.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Type</label>
                        <p className="text-gray-900 font-medium">{getTypeLabel(selectedWorkflowData.type)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Runs</label>
                        <p className="text-gray-900 font-semibold text-lg">{selectedWorkflowData.runCount}</p>
                      </div>
                      {selectedWorkflowData.lastRun && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Last Run</label>
                          <p className="text-gray-900">{formatWorkflowDate(selectedWorkflowData.lastRun)}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Triggers</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkflowData.triggers.map((trigger, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Workflow Steps</h3>
                      <div className="space-y-3">
                        {selectedWorkflowData.steps.map((step) => (
                          <div key={step.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                                {step.order}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">{step.name}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    step.type === 'automated' ? 'bg-green-100 text-green-800' :
                                    step.type === 'manual' ? 'bg-yellow-100 text-yellow-800' :
                                    step.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {step.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{step.action}</p>
                                {step.conditions && step.conditions.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Conditions:</p>
                                    {step.conditions.map((condition, idx) => (
                                      <span key={idx} className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded mr-2">
                                        {condition}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {step.assignTo && (
                                  <p className="text-xs text-gray-600 mt-2">
                                    <span className="font-medium">Assigned to:</span> {step.assignTo}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Vehicle Details Modal (for Dashboard) */}
      {selectedVehicle && activeTab === 'dashboard' && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedVehicleId(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                <button id="close-modal" onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
              </div>
              <div className="p-6">
                <VehicleHealthPanel vehicle={selectedVehicle} />
              </div>
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
