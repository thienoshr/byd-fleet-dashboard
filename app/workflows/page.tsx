'use client'

import { useState, useMemo } from 'react'
import { agreementsFull, suppliers, buybackAgreements } from '@/lib/dummyData'

export interface Workflow {
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

export interface WorkflowStep {
  id: string
  name: string
  type: 'automated' | 'manual' | 'approval' | 'notification'
  action: string
  conditions?: string[]
  assignTo?: string
  order: number
}

// Sample workflows
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

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows)
  const [typeFilter, setTypeFilter] = useState<'all' | 'contract_processing' | 'supplier_onboarding' | 'buyback_processing' | 'penalty_processing' | 'breach_resolution' | 'document_renewal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesType = typeFilter === 'all' || wf.type === typeFilter
      const matchesStatus = statusFilter === 'all' || wf.status === statusFilter
      return matchesType && matchesStatus
    })
  }, [typeFilter, statusFilter, workflows])

  const selectedWorkflowData = selectedWorkflow
    ? workflows.find((wf) => wf.id === selectedWorkflow)
    : null

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' }
          : wf
      )
    )
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Automated Workflows</h1>
        <p className="mt-2 text-gray-600">Manage automated workflows for contract processing, supplier onboarding, and more</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
            {(['all', 'contract_processing', 'supplier_onboarding', 'buyback_processing', 'penalty_processing', 'breach_resolution', 'document_renewal'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  typeFilter === type
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
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  statusFilter === status
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

      {/* Workflows List */}
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
                    <span className="font-medium text-gray-900">{formatDate(workflow.lastRun)}</span>
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
                <button
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    workflow.status === 'active'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {workflow.status === 'active' ? 'Pause' : 'Activate'}
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
                {/* Workflow Info */}
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
                      <p className="text-gray-900">{formatDate(selectedWorkflowData.lastRun)}</p>
                    </div>
                  )}
                </div>

                {/* Triggers */}
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

                {/* Workflow Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Workflow Steps</h3>
                  <div className="space-y-3">
                    {selectedWorkflowData.steps.map((step, index) => (
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
  )
}


