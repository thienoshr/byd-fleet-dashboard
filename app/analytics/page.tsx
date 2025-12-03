'use client'

import { useState, useMemo } from 'react'
import { agreementsFull, vehicles, invoices, purchaseOrders, suppliers, buybackAgreements } from '@/lib/dummyData'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'forecasting' | 'performance'>('overview')
  const [dateRange, setDateRange] = useState<'last30' | 'last90' | 'last365' | 'all'>('last90')

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalContracts = agreementsFull.length
    const activeContracts = agreementsFull.filter(a => a.stage !== 'Closed' && a.status !== 'Overdue').length
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = purchaseOrders.reduce((sum, po) => sum + po.amount, 0)
    const netProfit = totalRevenue - totalExpenses

    // Contract trends
    const contractsByMonth = agreementsFull.reduce((acc, a) => {
      const month = new Date(a.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Revenue trends
    const revenueByMonth = invoices.filter(i => i.status === 'paid').reduce((acc, i) => {
      const month = new Date(i.issueDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + i.amount
      return acc
    }, {} as Record<string, number>)

    // Utilization trends
    const utilizationByMonth = vehicles.reduce((acc, v) => {
      const month = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      if (!acc[month]) {
        acc[month] = { total: 0, onHire: 0 }
      }
      acc[month].total++
      if (v.availability_status === 'On Hire') {
        acc[month].onHire++
      }
      return acc
    }, {} as Record<string, { total: number; onHire: number }>)

    // Forecasting
    const avgContractValue = totalRevenue / totalContracts || 0
    const avgContractDuration = agreementsFull.reduce((sum, a) => {
      const start = new Date(a.startAt)
      const end = new Date(a.endAt)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    }, 0) / totalContracts

    // Performance metrics
    const complianceRate = agreementsFull.filter(a => {
      if (a.breaches) {
        return a.breaches.every(b => b.resolved)
      }
      return true
    }).length / totalContracts * 100

    const avgPenaltyAmount = agreementsFull.reduce((sum, a) => {
      if (a.penalties) {
        return sum + a.penalties.reduce((pSum, p) => pSum + p.amount, 0)
      }
      return sum
    }, 0) / agreementsFull.filter(a => a.penalties && a.penalties.length > 0).length || 0

    return {
      overview: {
        totalContracts,
        activeContracts,
        totalRevenue,
        totalExpenses,
        netProfit,
        complianceRate: Math.round(complianceRate),
        avgPenaltyAmount: Math.round(avgPenaltyAmount)
      },
      trends: {
        contractsByMonth,
        revenueByMonth,
        utilizationByMonth
      },
      forecasting: {
        avgContractValue: Math.round(avgContractValue),
        avgContractDuration: Math.round(avgContractDuration),
        projectedRevenue: Math.round(avgContractValue * activeContracts * 0.8), // 80% utilization assumption
        projectedExpenses: Math.round(totalExpenses * 1.1) // 10% increase assumption
      },
      performance: {
        complianceRate: Math.round(complianceRate),
        avgPenaltyAmount: Math.round(avgPenaltyAmount),
        supplierPerformance: suppliers.reduce((acc, s) => {
          if (s.performance) {
            acc.avgLeadTime += s.performance.avgLeadTimeHours || 0
            acc.avgSLA += s.performance.slaPercent || 0
            acc.avgOnTime += s.performance.onTimeDelivery || 0
            acc.count++
          }
          return acc
        }, { avgLeadTime: 0, avgSLA: 0, avgOnTime: 0, count: 0 })
      }
    }
  }, [dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="mt-2 text-gray-600">Comprehensive analytics, trends, and forecasting for fleet management</p>
      </div>

      {/* Date Range Selector */}
      <div className="card">
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
      </div>

      {/* Tabs */}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalContracts}</p>
              <p className="text-xs text-gray-500 mt-2">{analytics.overview.activeContracts} active</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-2">From paid invoices</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(analytics.overview.totalExpenses)}</p>
              <p className="text-xs text-gray-500 mt-2">Purchase orders</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <p className={`text-3xl font-bold ${analytics.overview.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(analytics.overview.netProfit)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Revenue - Expenses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Compliance Rate</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.complianceRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full ${
                    analytics.overview.complianceRate >= 90 ? 'bg-green-500' :
                    analytics.overview.complianceRate >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${analytics.overview.complianceRate}%` }}
                />
              </div>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Avg Penalty Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.overview.avgPenaltyAmount)}</p>
              <p className="text-xs text-gray-500 mt-2">Per contract with penalties</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Active Contracts</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.overview.activeContracts}</p>
              <p className="text-xs text-gray-500 mt-2">Of {analytics.overview.totalContracts} total</p>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Trends</h3>
            <div className="space-y-2">
              {Object.entries(analytics.trends.contractsByMonth).map(([month, count]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{month}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(analytics.trends.contractsByMonth))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <div className="space-y-2">
              {Object.entries(analytics.trends.revenueByMonth).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{month}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(revenue / Math.max(...Object.values(analytics.trends.revenueByMonth))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-24 text-right">{formatCurrency(revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Forecasting Tab */}
      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Contract Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.forecasting.avgContractValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Projected Revenue (Next Period)</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.forecasting.projectedRevenue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on {analytics.overview.activeContracts} active contracts</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Forecast</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Projected Expenses (Next Period)</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.forecasting.projectedExpenses)}</p>
                  <p className="text-xs text-gray-500 mt-1">10% increase assumption</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Contract Duration</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.forecasting.avgContractDuration} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Projected Net Profit</p>
                <p className={`text-2xl font-bold ${analytics.forecasting.projectedRevenue - analytics.forecasting.projectedExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(analytics.forecasting.projectedRevenue - analytics.forecasting.projectedExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Performance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Compliance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.performance.complianceRate}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      analytics.performance.complianceRate >= 90 ? 'bg-green-500' :
                      analytics.performance.complianceRate >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${analytics.performance.complianceRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Performance</h3>
              <div className="space-y-3">
                {analytics.performance.supplierPerformance.count > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Lead Time</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(analytics.performance.supplierPerformance.avgLeadTime / analytics.performance.supplierPerformance.count)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg SLA %</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(analytics.performance.supplierPerformance.avgSLA / analytics.performance.supplierPerformance.count)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg On-Time Delivery</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(analytics.performance.supplierPerformance.avgOnTime / analytics.performance.supplierPerformance.count)}%
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                  <p className={`text-2xl font-bold ${analytics.overview.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.overview.totalRevenue > 0
                      ? `${Math.round((analytics.overview.netProfit / analytics.overview.totalRevenue) * 100)}%`
                      : '0%'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Penalty per Contract</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.performance.avgPenaltyAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


