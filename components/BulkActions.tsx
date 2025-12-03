'use client'

import { useState } from 'react'

export interface BulkAction {
  id: string
  label: string
  icon?: string
  action: (selectedIds: string[]) => void | Promise<void>
  requiresConfirmation?: boolean
  confirmationMessage?: string
  variant?: 'primary' | 'secondary' | 'danger'
}

interface BulkActionsProps {
  selectedIds: string[]
  actions: BulkAction[]
  onClearSelection?: () => void
}

export default function BulkActions({ selectedIds, actions, onClearSelection }: BulkActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState<BulkAction | null>(null)

  if (selectedIds.length === 0) return null

  const handleAction = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setShowConfirmDialog(action)
    } else {
      await action.action(selectedIds)
      onClearSelection?.()
    }
  }

  const confirmAction = async () => {
    if (showConfirmDialog) {
      await showConfirmDialog.action(selectedIds)
      onClearSelection?.()
      setShowConfirmDialog(null)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="text-sm font-medium text-gray-700">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : action.variant === 'primary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
          {onClearSelection && (
            <button
              onClick={onClearSelection}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={() => setShowConfirmDialog(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
              <p className="text-gray-700 mb-6">
                {showConfirmDialog.confirmationMessage ||
                  `Are you sure you want to ${showConfirmDialog.label.toLowerCase()} ${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''}?`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showConfirmDialog.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
