'use client'

import { useState, useEffect } from 'react'

export interface DashboardWidget {
  id: string
  name: string
  enabled: boolean
  order: number
}

interface DashboardCustomizerProps {
  widgets: DashboardWidget[]
  onWidgetsChange: (widgets: DashboardWidget[]) => void
}

export default function DashboardCustomizer({ widgets, onWidgetsChange }: DashboardCustomizerProps) {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalWidgets(widgets)
  }, [widgets])

  const handleToggle = (id: string) => {
    const updated = localWidgets.map((w) =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    )
    setLocalWidgets(updated)
    onWidgetsChange(updated)
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = localWidgets.findIndex((w) => w.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localWidgets.length) return

    const updated = [...localWidgets]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    updated[index].order = index
    updated[newIndex].order = newIndex

    setLocalWidgets(updated)
    onWidgetsChange(updated)
  }

  const handleReset = () => {
    if (confirm('Reset dashboard to default layout?')) {
      const defaultWidgets = widgets.map((w, i) => ({ ...w, enabled: true, order: i }))
      setLocalWidgets(defaultWidgets)
      onWidgetsChange(defaultWidgets)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
        aria-label="Customize Dashboard"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[10005]"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-[10006] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-900">Customize Dashboard</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {localWidgets
            .sort((a, b) => a.order - b.order)
            .map((widget, index) => (
              <div
                key={widget.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={widget.enabled}
                  onChange={() => handleToggle(widget.id)}
                  className="cursor-pointer"
                />
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {widget.name}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(widget.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(widget.id, 'down')}
                    disabled={index === localWidgets.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  )
}



