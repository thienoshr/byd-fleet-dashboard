// Analytics Report Component - Integrated from Analytics page
import { useState, useMemo } from 'react'
import { agreementsFull, invoices, purchaseOrders } from '@/lib/dummyData'

export function AnalyticsReport() {
  const [dateRange, setDateRange] = useState<'last30' | 'last90' | 'last365' | 'all'>('last90')
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'forecasting' | 'performance'>('overview')

  const analytics = useMemo(() => {
    const totalContracts = agreementsFull.length
    const activeContracts = agreementsFull.filter(a => a.stage !== 'Closed' && a.status !== 'Overdue').length
    const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = purchaseOrders.reduce((sum, po) => sum + po.amount, 0)
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


