'use client'

import { useState } from 'react'

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
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    content: `
      <h3 class="font-semibold mb-2">System Settings</h3>
      <p class="mb-3">Customize your dashboard experience:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li><strong>Notifications:</strong> Configure email and alert preferences</li>
        <li><strong>Thresholds:</strong> Set bottleneck and expiry thresholds</li>
        <li><strong>Display:</strong> Configure items per page, date/time formats</li>
        <li><strong>Export:</strong> Set default export format and options</li>
        <li>All settings are saved automatically</li>
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

export default function HelpPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help</h1>
        <p className="mt-2 text-gray-600">
          Learn how to use the BYD Fleet Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Topics
            </h3>
            <nav className="space-y-1">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedSection === section.id
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

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Welcome to Help</h3>
            <p className="text-gray-600">
              Select a topic from the sidebar to learn more about using the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



