'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { vehicles, agreementsFull } from '@/lib/dummyData'
import type { Vehicle } from '@/lib/dummyData'
import SearchModal from './SearchModal'

interface SearchResult {
  id: string
  type: 'vehicle' | 'agreement' | 'page' | 'location'
  title: string
  subtitle: string
  url?: string
  data?: any // For modal data
}

interface QuickSearchProps {
  onStateChange?: (isOpen: boolean) => void
}

export default function QuickSearch({ onStateChange }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [modalData, setModalData] = useState<{ type: 'vehicle' | 'agreement' | 'location'; data: any } | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsOpen(false)
    setQuery('')
  }, [])

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(isOpen)
  }, [isOpen, onStateChange])

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          requestAnimationFrame(() => {
            setTimeout(() => inputRef.current?.focus(), 0)
          })
        }
      }
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    // Search locations first (if query matches a location name)
    const uniqueLocations = Array.from(new Set(vehicles.map(v => v.location)))
    const matchingLocation = uniqueLocations.find(loc => 
      loc.toLowerCase().includes(lowerQuery)
    )

    if (matchingLocation) {
      const locationVehicles = vehicles.filter(v => v.location === matchingLocation)
      if (locationVehicles.length > 0) {
        searchResults.push({
          id: `location-${matchingLocation}`,
          type: 'location',
          title: `${matchingLocation} Hub`,
          subtitle: `${locationVehicles.length} vehicle${locationVehicles.length !== 1 ? 's' : ''} at this location`,
          data: locationVehicles,
        })
      }
    }

    // Search vehicles - comprehensive search across all relevant fields
    vehicles
      .filter(
        (v) => {
          const searchableText = [
            v.vin,
            v.registration,
            v.model,
            v.location,
            v.rental_partner,
            v.id,
            v.availability_status,
            v.risk_level,
            v.part_status,
            v.currentProgress || '',
            v.partsInfo?.depot || '',
            v.partsInfo?.partName || '',
            v.partsInfo?.partNumber || '',
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          
          return searchableText.includes(lowerQuery)
        }
      )
      .slice(0, 5)
      .forEach((v) => {
        // Get driver info for subtitle
        const agreement = agreementsFull
          .filter((a) => a.vehicleId === v.id)
          .filter((a) => {
            const endDate = new Date(a.endAt)
            const now = new Date()
            return endDate > now && 
                   a.stage !== 'Vehicle Returned' && 
                   a.stage !== 'Closed'
          })
          .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0]

        let subtitle = `VIN: ${v.vin} • ${v.location} • ${v.rental_partner}`
        if (agreement && agreement.driverName) {
          subtitle = `${agreement.driverName} • ${agreement.customer} • ${v.location}`
        }

        searchResults.push({
          id: `vehicle-${v.id}`,
          type: 'vehicle',
          title: `${v.model} - ${v.registration}`,
          subtitle,
          data: v,
        })
      })

    // Search agreements - comprehensive search including driver info
    agreementsFull
      .filter(
        (a) => {
          const searchableText = [
            a.agreementId,
            a.customer,
            a.vehicleId,
            a.driverName || '',
            a.driverLicense || '',
            a.driverPhone || '',
            a.stage,
            a.status,
            a.assignedTo,
            a.notes,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          
          return searchableText.includes(lowerQuery)
        }
      )
      .slice(0, 5)
      .forEach((a) => {
        const vehicle = vehicles.find(v => v.id === a.vehicleId)
        const driverInfo = a.driverName 
          ? `${a.driverName}${a.driverPhone ? ` • ${a.driverPhone}` : ''}`
          : a.customer
        const subtitle = vehicle 
          ? `${driverInfo} • ${vehicle.model} - ${vehicle.registration} • ${a.stage}`
          : `${driverInfo} • ${a.stage}`
        
        searchResults.push({
          id: `agreement-${a.id}`,
          type: 'agreement',
          title: `Agreement ${a.agreementId}`,
          subtitle,
          data: a,
        })
      })

    // Search pages
    const pages = [
      { title: 'Dashboard', url: '/dashboard' },
      { title: 'Operations', url: '/operations' },
      { title: 'Vehicles', url: '/vehicles' },
      { title: 'Agreements', url: '/agreements' },
      { title: 'Reports', url: '/reports' },
      { title: 'Fleet Availability', url: '/fleet-availability' },
      { title: 'Communications', url: '/communications' },
      { title: 'Settings', url: '/settings' },
      { title: 'VOR', url: '/vor' },
      { title: 'Export History', url: '/export-history' },
      { title: 'Help', url: '/help' },
    ]

    pages
      .filter((p) => p.title.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach((p) => {
        searchResults.push({
          id: `page-${p.url}`,
          type: 'page',
          title: p.title,
          subtitle: 'Navigate to page',
          url: p.url,
        })
      })

    setResults(searchResults)
    setSelectedIndex(0)
  }, [query])

  const handleSelect = useCallback((result: SearchResult) => {
    if (!result) return
    
    try {
      if (result.type === 'page' && result.url) {
        // Navigate to page
        router.push(result.url)
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(0)
      } else if (result.type === 'vehicle' || result.type === 'agreement' || result.type === 'location') {
        // Show modal - ensure data exists
        if (result.data) {
          setModalData({ type: result.type, data: result.data })
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
        } else {
          console.warn('Search result missing data:', result)
        }
      }
    } catch (error) {
      console.error('Error handling search result selection:', error)
    }
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, handleSelect])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'vehicle':
        return '🚗'
      case 'agreement':
        return '📄'
      case 'location':
        return '📍'
      case 'page':
        return '🔗'
      default:
        return '🔍'
    }
  }

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(true)
    // Focus input after dropdown is rendered
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.quick-search-container')) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, handleClose])

  return (
    <div className="relative quick-search-container">
      {/* Search Icon Button - Always visible */}
      <button
        onClick={handleOpen}
        className="flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
        aria-label="Quick Search"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Dropdown Panel - Appears below icon when open */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[500px] bg-byd-dark shadow-2xl border border-white/20 rounded-lg z-[10005]">
          {/* Search Input in Dropdown */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <svg
              className="w-5 h-5 text-white flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 outline-none bg-transparent text-white placeholder-white/70"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleClose()
                }
              }}
            />
            <button
              onClick={handleClose}
              className="flex items-center justify-center p-1 text-white hover:text-white hover:bg-white/20 rounded transition-colors flex-shrink-0"
              aria-label="Close search"
              type="button"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div ref={resultsRef}>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(result)
                    }}
                    onMouseDown={(e) => {
                      // Prevent input blur when clicking result
                      e.preventDefault()
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer ${
                      index === selectedIndex ? 'bg-white/20' : ''
                    }`}
                    type="button"
                    aria-label={`Select ${result.title}`}
                  >
                    <span className="text-xl flex-shrink-0">{getResultIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{result.title}</div>
                      <div className="text-sm text-white/70 truncate">{result.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="px-4 py-8 text-center text-white/70">
                <p>No results found for "{query}"</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {modalData && (
        <SearchModal
          type={modalData.type}
          data={modalData.data}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  )
}

