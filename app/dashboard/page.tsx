'use client'

import { useMemo, useState, useEffect } from 'react'
import KpiCard from '@/components/KpiCard'
import PerformanceKpis from '@/components/PerformanceKpis'
import DashboardCustomizer, { type DashboardWidget } from '@/components/DashboardCustomizer'
import { vehiclesWithRisk, agreements, vehicles, utilisation } from '@/lib/dummyData'
import UtilisationChart from '@/modules/fleet-availability/components/UtilisationChart'

// Essential operational widgets
import VorSummaryWidget from '@/components/dashboard/VorSummaryWidget'
import ServiceDelaysSummaryWidget from '@/components/dashboard/ServiceDelaysSummaryWidget'
import ContractMonitoringWidget from '@/components/dashboard/ContractMonitoringWidget'
import ActivityLog from '@/components/ActivityLog'

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: 'performance-kpis', name: 'Performance KPIs', enabled: true, order: 0 },
    { id: 'kpi-cards', name: 'KPI Cards', enabled: true, order: 1 },
    { id: 'contract-monitoring', name: 'Contract Monitoring', enabled: true, order: 2 },
    { id: 'utilisation-chart', name: 'Utilisation Chart', enabled: true, order: 3 },
    { id: 'summary-stats', name: 'Summary Statistics', enabled: true, order: 4 },
    { id: 'vor-summary', name: 'VOR Summary', enabled: true, order: 5 },
    { id: 'service-delays-summary', name: 'Service Delays Summary', enabled: true, order: 6 },
    { id: 'activity-log', name: 'Activity Log', enabled: false, order: 7 },
  ])

  // Load saved widget configuration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardWidgets')
      if (saved) {
        try {
          setWidgets(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to load dashboard widgets:', e)
        }
      }
    }
  }, [])

  // Save widget configuration
  const handleWidgetsChange = (newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardWidgets', JSON.stringify(newWidgets))
    }
  }

  // Calculate KPIs from data
  const kpis = useMemo(() => {
    const vehiclesOverdue = vehiclesWithRisk.filter((v) => v.days_overdue > 0).length
    const contractsExpiringSoon = agreements.filter((a) => {
      const endDate = new Date(a.end_date)
      const today = new Date()
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0 && a.status === 'Signed'
    }).length
    const highRiskVehicles = vehiclesWithRisk.filter(
      (v) => v.risk_level === 'High'
    ).length
    const fleetAvailability = vehicles.filter(
      (v) => v.availability_status === 'Available'
    ).length

    return {
      avgPartLeadTime: 5, // Dummy value as requested
      vehiclesOverdue,
      contractsExpiringSoon,
      highRiskVehicles,
      fleetAvailability,
    }
  }, [])


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of fleet risk metrics and key performance indicators
        </p>
      </div>

      {/* Performance KPIs - Quick Overview */}
      {widgets.find((w) => w.id === 'performance-kpis')?.enabled && <PerformanceKpis />}

      {/* Detailed KPI Cards Grid */}
      {widgets.find((w) => w.id === 'kpi-cards')?.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard
          title="Avg Part Lead Time"
          value={`${kpis.avgPartLeadTime} days`}
          description="Average delivery time for parts"
          icon="⏱️"
          color="blue"
        />
        <KpiCard
          title="Vehicles Overdue"
          value={kpis.vehiclesOverdue}
          description="Vehicles with overdue parts"
          icon="⚠️"
          color="red"
        />
        <KpiCard
          title="Contracts Expiring Soon"
          value={kpis.contractsExpiringSoon}
          description="Contracts expiring within 30 days"
          icon="📅"
          color="yellow"
        />
        <KpiCard
          title="High-Risk Vehicles"
          value={kpis.highRiskVehicles}
          description="Vehicles flagged as high risk"
          icon="🚨"
          color="orange"
        />
        <KpiCard
          title="Fleet Availability"
          value={kpis.fleetAvailability}
          description="Vehicles currently available"
          icon="🚗"
          color="green"
        />
        </div>
      )}

      {/* Contract Monitoring */}
      {widgets.find((w) => w.id === 'contract-monitoring')?.enabled && (
        <div>
          <ContractMonitoringWidget />
        </div>
      )}

      {/* Overview Charts */}
      {widgets.find((w) => w.id === 'utilisation-chart')?.enabled && (
        <div>
          <UtilisationChart data={utilisation} />
        </div>
      )}

      {/* Summary Statistics */}
      {widgets.find((w) => w.id === 'summary-stats')?.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fleet Status Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Vehicles</span>
              <span className="font-semibold">{vehicles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">On Hire</span>
              <span className="font-semibold text-orange-600">
                {vehicles.filter((v) => v.availability_status === 'On Hire').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Workshop</span>
              <span className="font-semibold text-red-600">
                {vehicles.filter((v) => v.availability_status === 'In Workshop').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">
                {vehicles.filter((v) => v.availability_status === 'Available').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Agreements Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Agreements</span>
              <span className="font-semibold">{agreements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">
                {agreements.filter((a) => a.status === 'Signed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                {agreements.filter((a) => a.status === 'Pending').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overdue</span>
              <span className="font-semibold text-red-600">
                {agreements.filter((a) => a.status === 'Overdue').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Low Risk</span>
              <span className="font-semibold text-green-600">
                {vehiclesWithRisk.filter((v) => v.risk_level === 'Low').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medium Risk</span>
              <span className="font-semibold text-yellow-600">
                {vehiclesWithRisk.filter((v) => v.risk_level === 'Medium').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High Risk</span>
              <span className="font-semibold text-red-600">
                {vehiclesWithRisk.filter((v) => v.risk_level === 'High').length}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Avg Risk Score</span>
              <span className="font-semibold">
                {(
                  vehiclesWithRisk.reduce((sum, v) => sum + v.risk_score, 0) /
                  vehiclesWithRisk.length
                ).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Essential Operational Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {widgets.find((w) => w.id === 'vor-summary')?.enabled && <VorSummaryWidget />}
        {widgets.find((w) => w.id === 'service-delays-summary')?.enabled && <ServiceDelaysSummaryWidget />}
      </div>

      {/* Activity Log Widget */}
      {widgets.find((w) => w.id === 'activity-log')?.enabled && (
        <div className="card">
          <ActivityLog />
        </div>
      )}

      {/* Dashboard Customizer */}
      <DashboardCustomizer widgets={widgets} onWidgetsChange={handleWidgetsChange} />
    </div>
  )
}
