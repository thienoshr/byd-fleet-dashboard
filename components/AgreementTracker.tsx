'use client'

import React from 'react'
import { agreementsFull } from '@/lib/dummyData'

const WORKFLOW = [
  { key: 'reservationCreatedAt', label: 'Created' },
  { key: 'preparedAt', label: 'Prepared' },
  { key: 'signedAt', label: 'Signed' },
  { key: 'collectedAt', label: 'Collected' },
  { key: 'returnedAt', label: 'Returned' },
  { key: 'damageCheckCompletedAt', label: 'Damage Check' },
  { key: 'closedAt', label: 'Closed' },
] as const

type WorkflowKey = typeof WORKFLOW[number]['key']

function stageStatus(ts?: string | null): 'done' | 'pending' {
  return ts ? 'done' : 'pending'
}

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Not completed'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid date'
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes} on ${day}/${month}/${year}`
}

export default function AgreementTracker() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Rental Agreement Tracker</h3>
      <div className="space-y-4">
        {agreementsFull.map((ag) => {
          const timestamps = ag.timestamps || {}
          return (
            <div key={ag.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">
                    {ag.customer} — {ag.agreementId}
                  </div>
                  <div className="text-sm text-gray-600">
                    Vehicle: {ag.vehicleId} • Stage: {ag.stage} • Status: {ag.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {(() => {
                    const date = new Date(ag.createdAt)
                    if (isNaN(date.getTime())) return '—'
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear().toString().slice(-2)
                    return `${day}/${month}/${year}`
                  })()}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                  {WORKFLOW.map((w) => {
                    const done = timestamps[w.key as WorkflowKey]
                    const status = stageStatus(done)
                    const timestamp = formatDateTime(done)

                    return (
                      <div key={w.key} className="flex items-center flex-shrink-0 group relative">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              status === 'done'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {status === 'done' ? '✓' : '—'}
                          </div>
                          <div className="ml-2 text-xs text-gray-600">{w.label}</div>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="font-semibold mb-1">{w.label}</div>
                          <div className="text-gray-300">{timestamp}</div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}







