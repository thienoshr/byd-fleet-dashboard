'use client'

import { useState, useMemo } from 'react'
import ExportButtons from '@/components/ExportButtons'
import { agreementsFull, vehicles, suppliers, invoices, purchaseOrders, buybackAgreements } from '@/lib/dummyData'

/**
 * Reports page
 * Allows users to export summary reports in CSV and PDF formats
 */
type ReportType = 'summary' | 'vehicles' | 'agreements' | 'contract-metrics' | 'utilization-analysis' | 'financial' | 'compliance' | 'supplier-performance' | 'partners' | 'utilisation' | 'fleet-availability' | 'drivers' | 'health' | 'vor' | 'analytics'

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('summary')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="mt-2 text-gray-600">
          <p>Generate and export summary reports</p>
          <p>Select a report and generate as CSV or PDF</p>
        </div>
      </div>

      <div className="card">
        {/* Report Type Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Select Report
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setReportType('summary')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'summary'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setReportType('vehicles')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'vehicles'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setReportType('agreements')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'agreements'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Agreements
            </button>
            <button
              onClick={() => setReportType('contract-metrics')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'contract-metrics'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Contract Metrics
            </button>
            <button
              onClick={() => setReportType('utilization-analysis')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'utilization-analysis'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Utilization Analysis
            </button>
            <button
              onClick={() => setReportType('financial')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'financial'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Financial
            </button>
            <button
              onClick={() => setReportType('compliance')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'compliance'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Compliance
            </button>
            <button
              onClick={() => setReportType('supplier-performance')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'supplier-performance'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Supplier Performance
            </button>
            <button
              onClick={() => setReportType('partners')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'partners'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Partners
            </button>
            <button
              onClick={() => setReportType('utilisation')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'utilisation'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Utilisation
            </button>
            <button
              onClick={() => setReportType('fleet-availability')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'fleet-availability'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fleet Availability
            </button>
            <button
              onClick={() => setReportType('drivers')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'drivers'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setReportType('health')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'health'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vehicle Health
            </button>
            <button
              onClick={() => setReportType('vor')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'vor'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              VOR
            </button>
            <button
              onClick={() => setReportType('analytics')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                reportType === 'analytics'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Report Preview/Analytics */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Report Preview & Analytics
          </h3>
          {reportType === 'contract-metrics' && <ContractMetricsReport />}
          {reportType === 'utilization-analysis' && <UtilizationAnalysisReport />}
          {reportType === 'financial' && <FinancialReport />}
          {reportType === 'compliance' && <ComplianceReport />}
          {reportType === 'supplier-performance' && <SupplierPerformanceReport />}
          {reportType === 'summary' && <CustomReportBuilder />}
          {reportType === 'analytics' && <AnalyticsReport />}
        </div>

        {/* Export Options */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Export Options
          </h3>
          <ExportButtons reportType={reportType as any} />
        </div>
      </div>
    </div>
  )
}

// Contract Metrics Report Component
function ContractMetricsReport() {
  const metrics = useMemo(() => {
    const totalContracts = agreementsFull.length
    const activeContracts = agreementsFull.filter(a => a.status === 'On track').length
    const expiredContracts = agreementsFull.filter(a => {
      const endDate = new Date(a.endAt)
      return endDate < new Date()
    }).length
    
    const totalPenalties = agreementsFull.reduce((sum: number, a) => {
      if ((a as any).penalties) {
        return sum + (a as any).penalties.reduce((pSum: number, p: any) => pSum + p.amount, 0)
      }
      return sum
    }, 0)

    const totalBreaches = agreementsFull.reduce((sum: number, a) => {
      if ((a as any).breaches) {
        return sum + (a as any).breaches.length
      }
      return sum
    }, 0)

    const avgContractDuration = agreementsFull.reduce((sum, a) => {
      const start = new Date(a.startAt)
      const end = new Date(a.endAt)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0) / totalContracts

    return {
      totalContracts,
      activeContracts,
      expiredContracts,
      totalPenalties,
      totalBreaches,
      avgContractDuration: Math.round(avgContractDuration)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Contracts</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalContracts}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Active Contracts</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.activeContracts}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Expired Contracts</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.expiredContracts}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600">Total Penalties</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(metrics.totalPenalties)}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">Total Breaches</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalBreaches}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Avg Contract Duration</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.avgContractDuration} days</p>
        </div>
      </div>
    </div>
  )
}

// Utilization Analysis Report Component
function UtilizationAnalysisReport() {
  const analysis = useMemo(() => {
    const totalVehicles = vehicles.length
    const available = vehicles.filter(v => v.availability_status === 'Available').length
    const onHire = vehicles.filter(v => v.availability_status === 'On Hire').length
    const inWorkshop = vehicles.filter(v => v.availability_status === 'In Workshop').length
    
    const utilizationRate = totalVehicles > 0 ? Math.round((onHire / totalVehicles) * 100) : 0
    const availabilityRate = totalVehicles > 0 ? Math.round((available / totalVehicles) * 100) : 0

    return {
      totalVehicles,
      available,
      onHire,
      inWorkshop,
      utilizationRate,
      availabilityRate
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Vehicles</p>
          <p className="text-2xl font-bold text-gray-900">{analysis.totalVehicles}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-gray-900">{analysis.available}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600">On Hire</p>
          <p className="text-2xl font-bold text-gray-900">{analysis.onHire}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">In Workshop</p>
          <p className="text-2xl font-bold text-gray-900">{analysis.inWorkshop}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Utilization Rate</p>
          <p className="text-3xl font-bold text-gray-900">{analysis.utilizationRate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${analysis.utilizationRate}%` }}
            />
          </div>
        </div>
        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-600">Availability Rate</p>
          <p className="text-3xl font-bold text-gray-900">{analysis.availabilityRate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: `${analysis.availabilityRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Financial Report Component
function FinancialReport() {
  const financials = useMemo(() => {
    const totalInvoices = (invoices as any[]).length
    const paidInvoices = (invoices as any[]).filter((i: any) => i.status === 'paid').length
    const pendingInvoices = (invoices as any[]).filter((i: any) => i.status === 'sent' || i.status === 'draft').length
    const overdueInvoices = (invoices as any[]).filter((i: any) => i.status === 'overdue').length
    
    const totalInvoiceAmount = (invoices as any[]).reduce((sum: number, i: any) => sum + i.amount, 0)
    const paidAmount = (invoices as any[]).filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.amount, 0)
    const pendingAmount = (invoices as any[]).filter((i: any) => i.status === 'sent' || i.status === 'draft').reduce((sum: number, i: any) => sum + i.amount, 0)
    
    const totalPOs = (purchaseOrders as any[]).length
    const totalPOAmount = (purchaseOrders as any[]).reduce((sum: number, po: any) => sum + po.amount, 0)

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalInvoiceAmount,
      paidAmount,
      pendingAmount,
      totalPOs,
      totalPOAmount
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Invoice Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{financials.totalInvoices}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-gray-900">{financials.paidInvoices}</p>
            <p className="text-xs text-gray-600 mt-1">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(financials.paidAmount)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{financials.pendingInvoices}</p>
            <p className="text-xs text-gray-600 mt-1">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(financials.pendingAmount)}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-gray-900">{financials.overdueInvoices}</p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Purchase Orders Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">Total POs</p>
            <p className="text-2xl font-bold text-gray-900">{financials.totalPOs}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-600">Total PO Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(financials.totalPOAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compliance Report Component
function ComplianceReport() {
  const compliance = useMemo(() => {
    const totalContracts = agreementsFull.length
    const compliantContracts = agreementsFull.filter((a) => {
      if ((a as any).breaches) {
        return (a as any).breaches.every((b: any) => b.resolved)
      }
      return true
    }).length
    
    const totalBreaches = agreementsFull.reduce((sum: number, a) => {
      if ((a as any).breaches) {
        return sum + (a as any).breaches.length
      }
      return sum
    }, 0)

    const unresolvedBreaches = agreementsFull.reduce((sum: number, a) => {
      if ((a as any).breaches) {
        return sum + (a as any).breaches.filter((b: any) => !b.resolved).length
      }
      return sum
    }, 0)

    const complianceRate = totalContracts > 0 ? Math.round((compliantContracts / totalContracts) * 100) : 100

    const suppliersCompliant = (suppliers as any[]).filter((s: any) => s.complianceStatus === 'compliant').length
    const suppliersTotal = (suppliers as any[]).length
    const supplierComplianceRate = suppliersTotal > 0 ? Math.round((suppliersCompliant / suppliersTotal) * 100) : 100

    return {
      totalContracts,
      compliantContracts,
      complianceRate,
      totalBreaches,
      unresolvedBreaches,
      suppliersCompliant,
      suppliersTotal,
      supplierComplianceRate
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Contract Compliance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Total Contracts</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.totalContracts}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Compliant</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.compliantContracts}</p>
          </div>
          <div className={`p-4 rounded-lg border ${
            compliance.complianceRate >= 90 ? 'bg-green-50 border-green-200' :
            compliance.complianceRate >= 70 ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <p className="text-sm text-gray-600">Compliance Rate</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.complianceRate}%</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Unresolved Breaches</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.unresolvedBreaches}</p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Supplier Compliance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">Compliant Suppliers</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.suppliersCompliant} / {compliance.suppliersTotal}</p>
          </div>
          <div className={`p-4 rounded-lg border ${
            compliance.supplierComplianceRate >= 90 ? 'bg-green-50 border-green-200' :
            compliance.supplierComplianceRate >= 70 ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <p className="text-sm text-gray-600">Supplier Compliance Rate</p>
            <p className="text-2xl font-bold text-gray-900">{compliance.supplierComplianceRate}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Supplier Performance Report Component
function SupplierPerformanceReport() {
  const performance = useMemo(() => {
    const suppliersList = suppliers as any[]
    const avgLeadTime = suppliersList.reduce((sum: number, s: any) => {
      return sum + (s.performance?.avgLeadTimeHours || 0)
    }, 0) / suppliersList.length

    const avgSLA = suppliersList.reduce((sum: number, s: any) => {
      return sum + (s.performance?.slaPercent || 0)
    }, 0) / suppliersList.length

    const totalOrders = suppliersList.reduce((sum: number, s: any) => {
      return sum + (s.performance?.totalOrders || 0)
    }, 0)

    const avgOnTimeDelivery = suppliersList.reduce((sum: number, s: any) => {
      return sum + (s.performance?.onTimeDelivery || 0)
    }, 0) / suppliersList.length

    return {
      totalSuppliers: suppliersList.length,
      avgLeadTime: Math.round(avgLeadTime),
      avgSLA: Math.round(avgSLA),
      totalOrders,
      avgOnTimeDelivery: Math.round(avgOnTimeDelivery)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Suppliers</p>
          <p className="text-2xl font-bold text-gray-900">{performance.totalSuppliers}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Avg Lead Time</p>
          <p className="text-2xl font-bold text-gray-900">{performance.avgLeadTime}h</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Avg SLA %</p>
          <p className="text-2xl font-bold text-gray-900">{performance.avgSLA}%</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{performance.totalOrders}</p>
        </div>
        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-600">On-Time Delivery</p>
          <p className="text-2xl font-bold text-gray-900">{performance.avgOnTimeDelivery}%</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Supplier Performance Breakdown</h4>
        <div className="space-y-2">
          {suppliers.map((supplier: any) => (
            <div key={supplier.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{supplier.companyName}</p>
                <p className="text-xs text-gray-600 capitalize">{supplier.type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {supplier.performance?.avgLeadTimeHours && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Lead Time</p>
                    <p className="font-semibold">{supplier.performance.avgLeadTimeHours}h</p>
                  </div>
                )}
                {supplier.performance?.slaPercent && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600">SLA</p>
                    <p className="font-semibold">{supplier.performance.slaPercent}%</p>
                  </div>
                )}
                {supplier.performance?.onTimeDelivery && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600">On-Time</p>
                    <p className="font-semibold">{supplier.performance.onTimeDelivery}%</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Custom Report Builder Component
function CustomReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<'all' | 'last30' | 'last90' | 'last365' | 'custom'>('last30')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [groupBy, setGroupBy] = useState<'none' | 'customer' | 'vehicle' | 'supplier' | 'month'>('none')

  const availableMetrics = [
    { id: 'contracts', label: 'Contract Count', category: 'Contracts' },
    { id: 'penalties', label: 'Penalties Amount', category: 'Financial' },
    { id: 'breaches', label: 'Breaches Count', category: 'Compliance' },
    { id: 'mileage', label: 'Mileage Usage', category: 'Vehicles' },
    { id: 'utilization', label: 'Utilization Rate', category: 'Vehicles' },
    { id: 'invoices', label: 'Invoice Amount', category: 'Financial' },
    { id: 'purchase-orders', label: 'Purchase Order Value', category: 'Financial' },
    { id: 'supplier-performance', label: 'Supplier Performance', category: 'Suppliers' },
    { id: 'compliance-rate', label: 'Compliance Rate', category: 'Compliance' },
  ]

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  const generateReport = () => {
    // In a real app, this would generate the actual report
    alert(`Generating custom report with:\n- Metrics: ${selectedMetrics.join(', ')}\n- Date Range: ${dateRange}\n- Group By: ${groupBy}`)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">Custom Report Builder</h4>
        <p className="text-sm text-gray-600">Select metrics, date range, and grouping options to create a custom report</p>
      </div>

      {/* Metric Selection */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Select Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedMetrics.includes(metric.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => toggleMetric(metric.id)}
                  className="w-4 h-4 text-primary-600"
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">{metric.label}</p>
                  <p className="text-xs text-gray-500">{metric.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Date Range</h4>
        <div className="flex flex-wrap gap-3">
          {(['all', 'last30', 'last90', 'last365', 'custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                dateRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' :
               range === 'last30' ? 'Last 30 Days' :
               range === 'last90' ? 'Last 90 Days' :
               range === 'last365' ? 'Last Year' :
               'Custom'}
            </button>
          ))}
        </div>
        {dateRange === 'custom' && (
          <div className="mt-3 flex gap-3">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="End Date"
            />
          </div>
        )}
      </div>

      {/* Group By */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Group By</h4>
        <div className="flex flex-wrap gap-3">
          {(['none', 'customer', 'vehicle', 'supplier', 'month'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setGroupBy(option)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                groupBy === option
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option === 'none' ? 'No Grouping' :
               option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={generateReport}
          disabled={selectedMetrics.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedMetrics.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          Generate Report
        </button>
      </div>
    </div>
  )
}

// Analytics Report Component
function AnalyticsReport() {
  const [dateRange, setDateRange] = useState<'last30' | 'last90' | 'last365' | 'all'>('last90')
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'forecasting' | 'performance'>('overview')

  const analytics = useMemo(() => {
    const totalContracts = agreementsFull.length
    const activeContracts = agreementsFull.filter(a => a.stage !== 'Closed' && a.status !== 'Overdue').length
    const totalRevenue = (invoices as any[]).filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.amount, 0)
    const totalExpenses = (purchaseOrders as any[]).reduce((sum: number, po: any) => sum + po.amount, 0)
    const netProfit = totalRevenue - totalExpenses

    const complianceRate = agreementsFull.filter(a => {
      if ((a as any).breaches) {
        return (a as any).breaches.every((b: any) => b.resolved)
      }
      return true
    }).length / totalContracts * 100

    return {
      totalContracts,
      activeContracts,
      totalRevenue,
      totalExpenses,
      netProfit,
      complianceRate: Math.round(complianceRate)
    }
  }, [dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        {(['last30', 'last90', 'last365', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              dateRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === 'last30' ? 'Last 30 Days' :
             range === 'last90' ? 'Last 90 Days' :
             range === 'last365' ? 'Last Year' :
             'All Time'}
          </button>
        ))}
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {(['overview', 'trends', 'forecasting', 'performance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Contracts</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalContracts}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(analytics.totalExpenses)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
            <p className={`text-3xl font-bold ${analytics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(analytics.netProfit)}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Trends</h3>
          <p className="text-gray-600">Trend analysis and charts would be displayed here</p>
        </div>
      )}

      {activeTab === 'forecasting' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecasting</h3>
          <p className="text-gray-600">Revenue and expense forecasting would be displayed here</p>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <p className="text-gray-600">Performance metrics and KPIs would be displayed here</p>
        </div>
      )}
    </div>
  )
}




