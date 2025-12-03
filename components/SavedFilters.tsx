'use client'

import { useState, useEffect } from 'react'

export interface SavedFilter {
  id: string
  name: string
  filters: Record<string, any>
  createdAt: string
}

interface SavedFiltersProps {
  onLoadFilter: (filters: Record<string, any>) => void
  currentFilters: Record<string, any>
  filterType: string // e.g., 'vehicles', 'agreements', 'fleet-availability'
}

export default function SavedFilters({ onLoadFilter, currentFilters, filterType }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    loadSavedFilters()
  }, [filterType])

  const loadSavedFilters = () => {
    const key = `savedFilters_${filterType}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved filters:', e)
      }
    }
  }

  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      alert('Please enter a name for this filter')
      return
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...currentFilters },
      createdAt: new Date().toISOString(),
    }

    const updated = [...savedFilters, newFilter]
    setSavedFilters(updated)
    const key = `savedFilters_${filterType}`
    localStorage.setItem(key, JSON.stringify(updated))
    setFilterName('')
    setShowSaveDialog(false)
  }

  const loadFilter = (filter: SavedFilter) => {
    onLoadFilter(filter.filters)
  }

  const deleteFilter = (id: string) => {
    if (confirm('Are you sure you want to delete this saved filter?')) {
      const updated = savedFilters.filter((f) => f.id !== id)
      setSavedFilters(updated)
      const key = `savedFilters_${filterType}`
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Saved Filters</label>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          + Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            placeholder="Filter name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={saveCurrentFilter}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false)
                setFilterName('')
              }}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedFilters.length === 0 ? (
        <p className="text-xs text-gray-500">No saved filters</p>
      ) : (
        <div className="space-y-1">
          {savedFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => loadFilter(filter)}
                className="flex-1 text-left text-sm text-gray-700 hover:text-primary-600"
              >
                {filter.name}
              </button>
              <button
                onClick={() => deleteFilter(filter.id)}
                className="text-xs text-red-600 hover:text-red-700 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



