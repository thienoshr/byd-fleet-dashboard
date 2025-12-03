'use client'

import { useState, useEffect } from 'react'

interface HelpSection {
  id: string
  title: string
  content: string
  icon: string
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    content: `
      <h3 class="font-semibold mb-2">Welcome to BYD Fleet Dashboard</h3>
      <p class="mb-3">This dashboard helps you manage your fleet operations efficiently. Here's how to get started:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>Use the navigation bar to access different sections</li>
        <li>Press <kbd class="px-1.5 py-0.5 bg-gray-100 rounded">⌘K</kbd> or <kbd class="px-1.5 py-0.5 bg-gray-100 rounded">Ctrl+K</kbd> for quick search</li>
        <li>Check notifications in the top right corner</li>
        <li>Customize your dashboard in Settings</li>
      </ul>
    `,
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '📊',
    content: `
      <h3 class="font-semibold mb-2">Dashboard Overview</h3>
      <p class="mb-3">The Dashboard provides a high-level overview of your fleet:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li><strong>KPI Cards:</strong> Key metrics at a glance</li>
        <li><strong>Performance KPIs:</strong> Total fleet, utilisation, and open agreements</li>
        <li><strong>Utilisation Chart:</strong> Weekly fleet utilisation trends</li>
        <li><strong>Summary Statistics:</strong> Fleet status, agreements, and risk overview</li>
      </ul>
    `,
  },
  {
    id: 'operations',
    title: 'Operations Console',
    icon: '⚙️',
    content: `
      <h3 class="font-semibold mb-2">Operations Console</h3>
      <p class="mb-3">The Operations page provides detailed operational tools:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li><strong>Bottleneck Detector:</strong> Identifies vehicles stuck in workflows</li>
        <li><strong>Agreement Tracker:</strong> Visual workflow progress for agreements</li>
        <li><strong>SLA Partner Tracker:</strong> Monitor partner performance</li>
        <li><strong>Turnaround Timer:</strong> Track vehicle turnaround times</li>
        <li><strong>Quick Actions:</strong> Common operational tasks</li>
        <li><strong>Fleet Map:</strong> Visual vehicle locations</li>
      </ul>
    `,
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    icon: '🚗',
    content: `
      <h3 class="font-semibold mb-2">Vehicle Management</h3>
      <p class="mb-3">Manage your vehicle fleet:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>View all vehicles with VIN, registration, and status</li>
        <li>Search by VIN or registration</li>
        <li>Sort by any column</li>
        <li>View risk scores and part status</li>
        <li>Export vehicle data as CSV or PDF</li>
      </ul>
    `,
  },
  {
    id: 'agreements',
    title: 'Agreements',
    icon: '📄',
    content: `
      <h3 class="font-semibold mb-2">Agreement Management</h3>
      <p class="mb-3">Track rental agreements and contracts:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>View all agreements with contract details</li>
        <li>Track workflow progress visually</li>
        <li>Search by contract ID, registration, or driver</li>
        <li>Sort by various fields</li>
        <li>View driver information (name, license, phone)</li>
        <li>Export agreement data</li>
      </ul>
    `,
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: '📈',
    content: `
      <h3 class="font-semibold mb-2">Report Generation</h3>
      <p class="mb-3">Generate and export reports:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>Select from 9 report types</li>
        <li>Export as CSV or PDF</li>
        <li>View export history</li>
        <li>All data is included in exports</li>
      </ul>
      <p class="mt-3"><strong>Available Reports:</strong> Summary, Vehicles, Agreements, Partners, Utilisation, Fleet Availability, Drivers, Vehicle Health, VOR</p>
    `,
  },
  {
    id: 'fleet-availability',
    title: 'Fleet Availability',
    icon: '📍',
    content: `
      <h3 class="font-semibold mb-2">Fleet Availability</h3>
      <p class="mb-3">Monitor vehicle availability:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>View vehicle availability status</li>
        <li>Filter by status, location, and model</li>
        <li>Search by VIN, registration, or model</li>
        <li>Click on vehicles to view detailed health information</li>
        <li>View weekly utilisation trends</li>
      </ul>
    `,
  },
  {
    id: 'communications',
    title: 'Communications',
    icon: '📧',
    content: `
      <h3 class="font-semibold mb-2">Email Communications</h3>
      <p class="mb-3">Send automated emails to customers and partners:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>5 email templates available</li>
        <li>Auto-fill variables with fleet data</li>
        <li>Live preview of email content</li>
        <li>Send emails or copy to clipboard</li>
      </ul>
      <p class="mt-3"><strong>Templates:</strong> Overdue Return, Vehicle Ready, Allocation Confirmed, Repair Complete, Contract Expiry Reminder</p>
    `,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: '🔔',
    content: `
      <h3 class="font-semibold mb-2">Notification System</h3>
      <p class="mb-3">Stay informed about important events:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>Automatic alerts for critical bottlenecks</li>
        <li>Warnings for overdue agreements</li>
        <li>Contract expiry reminders</li>
        <li>High-risk vehicle notifications</li>
        <li>Click notifications to navigate to relevant pages</li>
        <li>Mark notifications as read</li>
      </ul>
    `,
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    icon: '⌨️',
    content: `
      <h3 class="font-semibold mb-2">Keyboard Shortcuts</h3>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li><kbd class="px-1.5 py-0.5 bg-gray-100 rounded">⌘K</kbd> or <kbd class="px-1.5 py-0.5 bg-gray-100 rounded">Ctrl+K</kbd>: Open quick search</li>
        <li><kbd class="px-1.5 py-0.5 bg-gray-100 rounded">ESC</kbd>: Close modals and dialogs</li>
        <li><kbd class="px-1.5 py-0.5 bg-gray-100 rounded">↑</kbd>/<kbd class="px-1.5 py-0.5 bg-gray-100 rounded">↓</kbd>: Navigate search results</li>
        <li><kbd class="px-1.5 py-0.5 bg-gray-100 rounded">Enter</kbd>: Select search result</li>
      </ul>
    `,
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'help'>('settings')
  const [selectedHelpSection, setSelectedHelpSection] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('notifications')
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    
    // Threshold Settings
    bottleneckWorkshopHours: 48,
    bottleneckPartsHours: 72,
    bottleneckValetHours: 3,
    contractExpiryDays: 30,
    
    // Display Settings
    itemsPerPage: 25,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Export Settings
    defaultExportFormat: 'CSV',
    includeHeaders: true,
    autoDownload: false,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fleetSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  // Update active category based on scroll position
  useEffect(() => {
    if (activeTab !== 'settings') return

    const handleScroll = () => {
      const sections = ['notifications', 'thresholds', 'display', 'export']
      const scrollPosition = window.scrollY + 200 // Offset for better detection

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTab])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('fleetSettings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = {
        emailNotifications: true,
        criticalAlerts: true,
        warningAlerts: true,
        infoAlerts: false,
        bottleneckWorkshopHours: 48,
        bottleneckPartsHours: 72,
        bottleneckValetHours: 3,
        contractExpiryDays: 30,
        itemsPerPage: 25,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        defaultExportFormat: 'CSV',
        includeHeaders: true,
        autoDownload: false,
      }
      setSettings(defaults)
      localStorage.setItem('fleetSettings', JSON.stringify(defaults))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your preferences and get help using the dashboard
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'help'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Help
          </button>
        </nav>
      </div>

      {activeTab === 'settings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Categories */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Categories
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveCategory('notifications')
                    document.getElementById('notifications')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeCategory === 'notifications'
                      ? 'font-medium text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => {
                    setActiveCategory('thresholds')
                    document.getElementById('thresholds')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeCategory === 'thresholds'
                      ? 'font-medium text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Thresholds
                </button>
                <button
                  onClick={() => {
                    setActiveCategory('display')
                    document.getElementById('display')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeCategory === 'display'
                      ? 'font-medium text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Display
                </button>
                <button
                  onClick={() => {
                    setActiveCategory('export')
                    document.getElementById('export')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeCategory === 'export'
                      ? 'font-medium text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Export
                </button>
              </nav>
            </div>
          </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <div id="notifications" className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive email alerts for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Critical Alerts</label>
                    <p className="text-xs text-gray-500">Critical bottlenecks and urgent issues</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.criticalAlerts}
                      onChange={(e) => handleSettingChange('criticalAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Warning Alerts</label>
                    <p className="text-xs text-gray-500">Warnings and important notices</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.warningAlerts}
                      onChange={(e) => handleSettingChange('warningAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Info Alerts</label>
                    <p className="text-xs text-gray-500">General information and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.infoAlerts}
                      onChange={(e) => handleSettingChange('infoAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Settings */}
          <div id="thresholds" className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Threshold Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop Service Delay Threshold (hours)
                </label>
                <input
                  type="number"
                  value={settings.bottleneckWorkshopHours}
                  onChange={(e) => handleSettingChange('bottleneckWorkshopHours', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Vehicles in workshop longer than this will trigger alerts</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parts Service Delay Threshold (hours)
                </label>
                <input
                  type="number"
                  value={settings.bottleneckPartsHours}
                  onChange={(e) => handleSettingChange('bottleneckPartsHours', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Vehicles awaiting parts longer than this will trigger alerts</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valet Service Delay Threshold (hours)
                </label>
                <input
                  type="number"
                  value={settings.bottleneckValetHours}
                  onChange={(e) => handleSettingChange('bottleneckValetHours', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Vehicles awaiting valet longer than this will trigger warnings</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Expiry Warning (days)
                </label>
                <input
                  type="number"
                  value={settings.contractExpiryDays}
                  onChange={(e) => handleSettingChange('contractExpiryDays', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Show warning when contracts expire within this many days</p>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div id="display" className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Per Page
                </label>
                <select
                  value={settings.itemsPerPage}
                  onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="24h">24 Hour</option>
                  <option value="12h">12 Hour (AM/PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div id="export" className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Export Format
                </label>
                <select
                  value={settings.defaultExportFormat}
                  onChange={(e) => handleSettingChange('defaultExportFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Include Headers</label>
                  <p className="text-xs text-gray-500">Include column headers in exports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeHeaders}
                    onChange={(e) => handleSettingChange('includeHeaders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto Download</label>
                  <p className="text-xs text-gray-500">Automatically download exports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoDownload}
                    onChange={(e) => handleSettingChange('autoDownload', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Help Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Topics
              </h3>
              <nav className="space-y-1">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedHelpSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedHelpSection === section.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Help Content */}
          <div className="lg:col-span-2">
            <div className="card">
              {selectedHelpSection ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: helpSections.find((s) => s.id === selectedHelpSection)?.content || '',
                  }}
                />
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Welcome to Help</h3>
                  <p className="text-gray-600">
                    Select a topic from the sidebar to learn more about using the dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

