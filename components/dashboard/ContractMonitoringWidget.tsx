'use client'

import { useMemo } from 'react'
import { agreementsFull, buybackAgreements } from '@/lib/dummyData'
import Link from 'next/link'

export default function ContractMonitoringWidget() {
  const contractMetrics = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    // Contracts expiring soon (30 days)
    const expiringSoon = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate <= thirtyDaysFromNow && endDate >= today && a.status !== 'Overdue' && a.stage !== 'Closed'
    })

    // Contracts expiring very soon (7 days) - urgent
    const expiringUrgent = agreementsFull.filter((a) => {
      const endDate = new Date(a.endAt)
      return endDate <= sevenDaysFromNow && endDate >= today && a.status !== 'Overdue' && a.stage !== 'Closed'
    })

    // Return dates coming up (14 days)
    const returnDatesUpcoming = agreementsFull.filter((a) => {
      if (!a.timestamps.returnedAt) {
        const endDate = new Date(a.endAt)
        const daysUntilReturn = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilReturn <= 14 && daysUntilReturn >= 0
      }
      return false
    })

    // Return dates urgent (7 days)
    const returnDatesUrgent = agreementsFull.filter((a) => {
      if (!a.timestamps.returnedAt) {
        const endDate = new Date(a.endAt)
        const daysUntilReturn = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilReturn <= 7 && daysUntilReturn >= 0
      }
      return false
    })

    // Total penalties
    const totalPenalties = agreementsFull.reduce((sum, a) => {
      if (a.penalties) {
        return sum + a.penalties.filter(p => p.status === 'pending').reduce((pSum, p) => pSum + p.amount, 0)
      }
      return sum
    }, 0)

    // Total paid penalties
    const paidPenalties = agreementsFull.reduce((sum, a) => {
      if (a.penalties) {
        return sum + a.penalties.filter(p => p.status === 'paid').reduce((pSum, p) => pSum + p.amount, 0)
      }
      return sum
    }, 0)

    // Total breaches
    const unresolvedBreaches = agreementsFull.reduce((sum, a) => {
      if (a.breaches) {
        return sum + a.breaches.filter(b => !b.resolved).length
      }
      return sum
    }, 0)

    // Critical breaches
    const criticalBreaches = agreementsFull.reduce((sum, a) => {
      if (a.breaches) {
        return sum + a.breaches.filter(b => !b.resolved && b.severity === 'critical').length
      }
      return sum
    }, 0)

    // Compliance status
    const compliantContracts = agreementsFull.filter((a) => {
      if (a.breaches) {
        return a.breaches.every(b => b.resolved)
      }
      return true
    }).length

    const totalContracts = agreementsFull.length
    const compliancePercent = totalContracts > 0 ? Math.round((compliantContracts / totalContracts) * 100) : 100

    // Mileage overages
    const mileageOverages = agreementsFull.filter((a) => {
      if (a.mileageOverage && a.mileageOverage > 0) {
        return true
      }
      if (a.mileageLimit && a.currentMileage && a.mileageAtStart) {
        const used = a.currentMileage - a.mileageAtStart
        const remaining = a.mileageLimit - used
        return remaining < 0 || (remaining / a.mileageLimit) < 0.1 // Less than 10% remaining
      }
      return false
    }).length

    return {
      expiringSoon: expiringSoon.length,
      expiringUrgent: expiringUrgent.length,
      expiringSoonList: expiringSoon.slice(0, 5),
      returnDatesUpcoming: returnDatesUpcoming.length,
      returnDatesUrgent: returnDatesUrgent.length,
      returnDatesList: returnDatesUpcoming.slice(0, 5),
      totalPenalties: totalPenalties,
      paidPenalties: paidPenalties,
      unresolvedBreaches,
      criticalBreaches,
      compliancePercent,
      compliantContracts,
      totalContracts,
      mileageOverages
    }
  }, [])

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contract Monitoring</h3>
        <Link href="/agreements" className="text-xs text-primary-600 hover:text-primary-700">
          View All →
        </Link>
      </div>
      
      <div className="space-y-4">
        {/* Contract Expiration Alerts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Contracts Expiring (30 days)</span>
            <div className="flex items-center gap-2">
              {contractMetrics.expiringUrgent > 0 && (
                <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                  {contractMetrics.expiringUrgent} URGENT
                </span>
              )}
              <span className={`text-lg font-bold ${contractMetrics.expiringSoon > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {contractMetrics.expiringSoon}
              </span>
            </div>
          </div>
          {contractMetrics.expiringSoon > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                ⚠️ {contractMetrics.expiringSoon} contract{contractMetrics.expiringSoon > 1 ? 's' : ''} need attention
              </div>
              {contractMetrics.expiringSoonList.length > 0 && (
                <div className="text-xs space-y-1">
                  {contractMetrics.expiringSoonList.map((agreement) => {
                    const endDate = new Date(agreement.endAt)
                    const daysUntil = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={agreement.id} className="flex items-center justify-between p-1.5 bg-white rounded border border-yellow-200">
                        <span className="text-gray-700">{agreement.agreementId} - {agreement.customer}</span>
                        <span className={`font-semibold ${daysUntil <= 7 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {daysUntil}d
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Return Date Reminders */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Returns Due (14 days)</span>
            <div className="flex items-center gap-2">
              {contractMetrics.returnDatesUrgent > 0 && (
                <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                  {contractMetrics.returnDatesUrgent} URGENT
                </span>
              )}
              <span className={`text-lg font-bold ${contractMetrics.returnDatesUpcoming > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                {contractMetrics.returnDatesUpcoming}
              </span>
            </div>
          </div>
          {contractMetrics.returnDatesUpcoming > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                📅 {contractMetrics.returnDatesUpcoming} vehicle{contractMetrics.returnDatesUpcoming > 1 ? 's' : ''} due for return
              </div>
              {contractMetrics.returnDatesList.length > 0 && (
                <div className="text-xs space-y-1">
                  {contractMetrics.returnDatesList.map((agreement) => {
                    const endDate = new Date(agreement.endAt)
                    const daysUntil = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={agreement.id} className="flex items-center justify-between p-1.5 bg-white rounded border border-blue-200">
                        <span className="text-gray-700">{agreement.agreementId} - {agreement.customer}</span>
                        <span className={`font-semibold ${daysUntil <= 7 ? 'text-red-600' : 'text-blue-600'}`}>
                          {daysUntil}d
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compliance Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Compliance Status</span>
            <span className={`text-lg font-bold ${
              contractMetrics.compliancePercent >= 90 ? 'text-green-600' :
              contractMetrics.compliancePercent >= 70 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {contractMetrics.compliancePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                contractMetrics.compliancePercent >= 90 ? 'bg-green-500' :
                contractMetrics.compliancePercent >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${contractMetrics.compliancePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {contractMetrics.compliantContracts} of {contractMetrics.totalContracts} contracts compliant
          </p>
        </div>

        {/* Penalty Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Penalties</span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Pending</p>
                <span className={`text-lg font-bold ${contractMetrics.totalPenalties > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(contractMetrics.totalPenalties)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Paid</p>
                <span className="text-sm font-semibold text-green-600">
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(contractMetrics.paidPenalties)}
                </span>
              </div>
            </div>
          </div>
          {contractMetrics.totalPenalties > 0 && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ⚠️ Outstanding penalties require attention
            </div>
          )}
        </div>

        {/* Breaches Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Unresolved Breaches</span>
            <div className="flex items-center gap-2">
              {contractMetrics.criticalBreaches > 0 && (
                <span className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded">
                  {contractMetrics.criticalBreaches} CRITICAL
                </span>
              )}
              <span className={`text-lg font-bold ${contractMetrics.unresolvedBreaches > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {contractMetrics.unresolvedBreaches}
              </span>
            </div>
          </div>
          {contractMetrics.unresolvedBreaches > 0 && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              🚨 {contractMetrics.unresolvedBreaches} breach{contractMetrics.unresolvedBreaches > 1 ? 'es' : ''} need resolution
              {contractMetrics.criticalBreaches > 0 && ` (${contractMetrics.criticalBreaches} critical)`}
            </div>
          )}
        </div>

        {/* Mileage Overage Alerts */}
        {contractMetrics.mileageOverages > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Mileage Overages</span>
              <span className="text-lg font-bold text-orange-600">
                {contractMetrics.mileageOverages}
              </span>
            </div>
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ {contractMetrics.mileageOverages} contract{contractMetrics.mileageOverages > 1 ? 's' : ''} with mileage issues
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

