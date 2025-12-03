'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import { vehiclesWithRisk, agreements, vehicles, partners, utilisation, agreementsFull, invoices, purchaseOrders, suppliers, buybackAgreements } from '@/lib/dummyData'

/**
 * Export data to CSV format
 * @param reportType - Type of report to export
 */
export async function exportToCSV(reportType: 'summary' | 'vehicles' | 'agreements' | 'partners' | 'utilisation' | 'fleet-availability' | 'drivers' | 'health' | 'vor' | 'analytics' | 'contract-metrics' | 'utilization-analysis' | 'financial' | 'compliance' | 'supplier-performance') {
  try {
    let csvData = ''
    let headers: string[] = []
    let rows: any[] = []

    if (reportType === 'summary') {
      // Calculate summary metrics
      const vehiclesOverdue = vehiclesWithRisk.filter((v) => v.days_overdue > 0).length
      const contractsExpiringSoon = agreements.filter((a) => {
        const endDate = new Date(a.end_date)
        const today = new Date()
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0 && a.status === 'Signed'
      }).length
      const highRiskVehicles = vehiclesWithRisk.filter((v) => v.risk_level === 'High').length

      headers = ['Metric', 'Value']
      rows = [
        ['Average Part Lead Time (days)', '5'],
        ['Vehicles Overdue', vehiclesOverdue.toString()],
        ['Contracts Expiring Soon', contractsExpiringSoon.toString()],
        ['High-Risk Vehicles', highRiskVehicles.toString()],
      ]
        } else if (reportType === 'vehicles') {
          // Format date helper
          const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return '—'
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear().toString().slice(-2)
            return `${day}/${month}/${year}`
          }
          
          headers = ['VIN', 'Registration', 'Rental Partner', 'Part Status', 'Days Overdue', 'Contract Expiry', 'Risk Level', 'Risk Score']
      rows = vehiclesWithRisk.map((v) => [
        v.vin,
        v.registration,
        v.rental_partner,
        v.part_status,
        v.days_overdue.toString(),
        formatDate(v.contract_expiry),
        v.risk_level,
        v.risk_score.toString(),
      ])
    } else if (reportType === 'agreements') {
      // Format date helper
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }
      
      headers = ['Contract Number', 'VIN', 'Registration', 'Rental Partner', 'Driver Name', 'Driver License', 'Driver Phone', 'Start Date', 'End Date', 'Status']
      rows = agreements.map((a) => [
        a.contract_number,
        a.vin,
        a.registration,
        a.rental_partner,
        a.driverName || '',
        a.driverLicense || '',
        a.driverPhone || '',
        formatDate(a.start_date),
        formatDate(a.end_date),
        a.status,
      ])
    } else if (reportType === 'partners') {
      headers = ['Partner ID', 'Average Lead Time (hours)', 'SLA Percentage', 'Open Jobs']
      rows = partners.map((p) => [
        p.id,
        p.avgLeadTimeHours.toString(),
        p.slaPercent.toString(),
        p.openJobs.toString(),
      ])
    } else if (reportType === 'utilisation') {
      headers = ['Date', 'Utilisation (%)']
      rows = utilisation.map((u) => [
        u.date,
        u.utilisation.toString(),
      ])
        } else if (reportType === 'fleet-availability') {
          // Format date helper
          const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return '—'
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear().toString().slice(-2)
            return `${day}/${month}/${year}`
          }
          
          headers = ['VIN', 'Registration', 'Model', 'Location', 'Availability Status', 'Next Available Date', 'Rental Partner']
      rows = vehicles.map((v) => [
        v.vin,
        v.registration,
        v.model,
        v.location,
        v.availability_status,
        v.next_available_date ? formatDate(v.next_available_date) : 'N/A',
        v.rental_partner,
      ])
    } else if (reportType === 'drivers') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      headers = ['Driver Name', 'Driver License', 'Driver Phone', 'Contract Number', 'Vehicle Registration', 'Customer', 'Start Date', 'End Date', 'Status']
      rows = agreementsFull
        .filter((a) => a.driverName) // Only include agreements with driver info
        .map((a) => {
          const vehicle = vehicles.find((v) => v.id === a.vehicleId)
          return [
            a.driverName || '',
            a.driverLicense || '',
            a.driverPhone || '',
            a.agreementId,
            vehicle?.registration || '',
            a.customer,
            formatDate(a.startAt),
            formatDate(a.endAt),
            a.status,
          ]
        })
    } else if (reportType === 'health') {
      // Format date helper
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }
      
      headers = ['VIN', 'Registration', 'Model', 'Health Score', 'Battery Health (%)', 'Last OTA Update', 'MOT Expiry', 'Fault Codes']
      rows = vehicles.map((v) => [
        v.vin,
        v.registration,
        v.model,
        v.health.healthScore.toString(),
        v.health.batteryHealth.toString(),
        formatDate(v.health.lastOta),
        formatDate(v.health.motExpiry),
        v.health.faultCodes.join(', ') || 'None',
      ])
    } else if (reportType === 'vor') {
      // Format date helper
      const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'N/A'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes} on ${day}/${month}/${year}`
      }

      // Format duration helper
      const formatDuration = (seconds: number | null | undefined): string => {
        if (!seconds) return '—'
        const totalHours = Math.floor(seconds / 3600)
        const days = Math.floor(totalHours / 24)
        const hours = totalHours % 24
        const months = Math.floor(days / 30)
        const remainingDays = days % 30
        
        if (months > 0) {
          return `${months}m ${remainingDays}d ${hours}h`
        } else if (days > 0) {
          return `${days}d ${hours}h`
        }
        return `${hours}h`
      }

      // Get time in current stage
      const getTimeInStage = (v: typeof vehicles[0]): number | null => {
        const ts = v.stage_timestamps || {}
        if (v.availability_status === 'In Workshop') {
          const workshopIn = ts.workshopInAt || ts.inspectedAt
          if (workshopIn) {
            return Math.floor((Date.now() - new Date(workshopIn).getTime()) / 1000)
          }
        } else if (ts.partsRequestedAt && v.availability_status !== 'Available') {
          if (ts.partsRequestedAt) {
            return Math.floor((Date.now() - new Date(ts.partsRequestedAt).getTime()) / 1000)
          }
        } else if (v.availability_status === 'Awaiting Valet') {
          if (ts.returnedAt) {
            return Math.floor((Date.now() - new Date(ts.returnedAt).getTime()) / 1000)
          }
        }
        return null
      }

      // Filter VOR vehicles
      const vorVehicles = vehicles.filter((v) => {
        const ts = v.stage_timestamps || {}
        return v.availability_status === 'In Workshop' ||
               (ts.partsRequestedAt && v.availability_status !== 'Available') ||
               v.availability_status === 'Awaiting Valet' ||
               v.availability_status === 'Awaiting Documents' ||
               v.availability_status === 'Awaiting Allocation'
      })

      headers = [
        'VIN',
        'Registration',
        'Model',
        'Location',
        'Rental Partner',
        'Status',
        'Time in Stage',
        'Current Progress',
        'Returned At',
        'Inspected At',
        'Workshop In At',
        'Parts Requested At',
        'Parts Depot',
        'Part Name',
        'Part Number',
        'Parts Order Date',
        'Parts ETA',
        'Workshop ETA',
        'Last Update',
        'VOR Update'
      ]

      rows = vorVehicles.map((v) => {
        const ts = v.stage_timestamps || {}
        const timeInStage = getTimeInStage(v)
        
        return [
          v.vin,
          v.registration,
          v.model,
          v.location,
          v.rental_partner,
          v.availability_status,
          formatDuration(timeInStage),
          v.currentProgress || 'N/A',
          formatDate(ts.returnedAt),
          formatDate(ts.inspectedAt),
          formatDate(ts.workshopInAt),
          formatDate(ts.partsRequestedAt),
          v.partsInfo?.depot || 'N/A',
          v.partsInfo?.partName || 'N/A',
          v.partsInfo?.partNumber || 'N/A',
          formatDate(v.partsInfo?.orderDate),
          formatDate(v.partsInfo?.eta),
          formatDate(v.workshopEta),
          formatDate(v.lastUpdate),
          formatDate(v.vorUpdate),
        ]
      })
    } else if (reportType === 'analytics') {
      // Calculate comprehensive analytics data
      const totalContracts = agreementsFull.length
      const activeContracts = agreementsFull.filter(a => a.stage !== 'Closed' && a.status !== 'Overdue').length
      const closedContracts = agreementsFull.filter(a => a.stage === 'Closed').length
      const overdueContracts = agreementsFull.filter(a => a.status === 'Overdue').length
      
      const totalRevenue = (invoices as any[]).filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.amount, 0)
      const totalExpenses = (purchaseOrders as any[]).reduce((sum: number, po: any) => sum + po.amount, 0)
      const netProfit = totalRevenue - totalExpenses
      
      const totalInvoices = (invoices as any[]).length
      const paidInvoices = (invoices as any[]).filter((i: any) => i.status === 'paid').length
      const pendingInvoices = (invoices as any[]).filter((i: any) => i.status === 'sent' || i.status === 'draft').length
      const overdueInvoices = (invoices as any[]).filter((i: any) => i.status === 'overdue').length
      
      const totalPOs = (purchaseOrders as any[]).length
      const deliveredPOs = (purchaseOrders as any[]).filter((po: any) => po.status === 'delivered').length
      
      // Compliance metrics
      const compliantContracts = agreementsFull.filter(a => {
        if ((a as any).breaches) {
          return (a as any).breaches.every((b: any) => b.resolved)
        }
        return true
      }).length
      const complianceRate = totalContracts > 0 ? Math.round((compliantContracts / totalContracts) * 100) : 100
      
      // Penalties and breaches
      const totalPenalties = agreementsFull.reduce((sum: number, a) => {
        if ((a as any).penalties) {
          return sum + (a as any).penalties.reduce((pSum: number, p: any) => pSum + p.amount, 0)
        }
        return sum
      }, 0)
      const pendingPenalties = agreementsFull.reduce((sum: number, a) => {
        if ((a as any).penalties) {
          return sum + (a as any).penalties.filter((p: any) => p.status === 'pending').reduce((pSum: number, p: any) => pSum + p.amount, 0)
        }
        return sum
      }, 0)
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
      
      // Contract duration metrics
      const avgContractDuration = agreementsFull.reduce((sum, a) => {
        const start = new Date(a.startAt)
        const end = new Date(a.endAt)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return sum + days
      }, 0) / totalContracts || 0
      
      // Vehicle utilization
      const totalVehicles = vehicles.length
      const availableVehicles = vehicles.filter(v => v.availability_status === 'Available').length
      const onHireVehicles = vehicles.filter(v => v.availability_status === 'On Hire').length
      const inWorkshopVehicles = vehicles.filter(v => v.availability_status === 'In Workshop').length
      const utilizationRate = totalVehicles > 0 ? Math.round((onHireVehicles / totalVehicles) * 100) : 0
      
      // Supplier metrics
      const totalSuppliers = suppliers.length
      const activeSuppliers = suppliers.filter(s => s.onboardingStatus === 'completed').length
      
      // Buyback metrics
      const totalBuybacks = buybackAgreements.length
      const completedBuybacks = buybackAgreements.filter(b => b.status === 'completed').length
      const totalBuybackValue = buybackAgreements.reduce((sum, b) => sum + b.buybackPrice, 0)
      
      // Format currency helper
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
      }
      
      // Create comprehensive analytics report
      headers = ['Category', 'Metric', 'Value']
      rows = [
        // Contract Overview
        ['Contracts', 'Total Contracts', totalContracts.toString()],
        ['Contracts', 'Active Contracts', activeContracts.toString()],
        ['Contracts', 'Closed Contracts', closedContracts.toString()],
        ['Contracts', 'Overdue Contracts', overdueContracts.toString()],
        ['Contracts', 'Average Contract Duration (days)', Math.round(avgContractDuration).toString()],
        
        // Financial Overview
        ['Financial', 'Total Revenue', formatCurrency(totalRevenue)],
        ['Financial', 'Total Expenses', formatCurrency(totalExpenses)],
        ['Financial', 'Net Profit', formatCurrency(netProfit)],
        ['Financial', 'Profit Margin (%)', totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100).toString() : '0'],
        
        // Invoice Metrics
        ['Invoices', 'Total Invoices', totalInvoices.toString()],
        ['Invoices', 'Paid Invoices', paidInvoices.toString()],
        ['Invoices', 'Pending Invoices', pendingInvoices.toString()],
        ['Invoices', 'Overdue Invoices', overdueInvoices.toString()],
        
        // Purchase Order Metrics
        ['Purchase Orders', 'Total Purchase Orders', totalPOs.toString()],
        ['Purchase Orders', 'Delivered Purchase Orders', deliveredPOs.toString()],
        ['Purchase Orders', 'Total PO Value', formatCurrency(totalExpenses)],
        
        // Compliance & Risk
        ['Compliance', 'Compliance Rate (%)', complianceRate.toString()],
        ['Compliance', 'Compliant Contracts', compliantContracts.toString()],
        ['Compliance', 'Total Penalties', formatCurrency(totalPenalties)],
        ['Compliance', 'Pending Penalties', formatCurrency(pendingPenalties)],
        ['Compliance', 'Total Breaches', totalBreaches.toString()],
        ['Compliance', 'Unresolved Breaches', unresolvedBreaches.toString()],
        
        // Vehicle Metrics
        ['Vehicles', 'Total Vehicles', totalVehicles.toString()],
        ['Vehicles', 'Available Vehicles', availableVehicles.toString()],
        ['Vehicles', 'On Hire Vehicles', onHireVehicles.toString()],
        ['Vehicles', 'In Workshop Vehicles', inWorkshopVehicles.toString()],
        ['Vehicles', 'Utilization Rate (%)', utilizationRate.toString()],
        
        // Supplier Metrics
        ['Suppliers', 'Total Suppliers', totalSuppliers.toString()],
        ['Suppliers', 'Active Suppliers', activeSuppliers.toString()],
        
        // Buyback Metrics
        ['Buybacks', 'Total Buybacks', totalBuybacks.toString()],
        ['Buybacks', 'Completed Buybacks', completedBuybacks.toString()],
        ['Buybacks', 'Total Buyback Value', formatCurrency(totalBuybackValue)],
      ]
    }

    // Generate CSV string
    csvData = Papa.unparse([headers, ...rows])

    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('CSV export error:', error)
    throw error
  }
}

/**
 * Export data to PDF format
 * @param reportType - Type of report to export
 */
export async function exportToPDF(reportType: 'summary' | 'vehicles' | 'agreements' | 'partners' | 'utilisation' | 'fleet-availability' | 'drivers' | 'health' | 'vor' | 'invoices' | 'purchase-orders' | 'reconciliation' | 'penalties' | 'analytics' | 'contract-metrics' | 'utilization-analysis' | 'financial' | 'compliance' | 'supplier-performance') {
  try {
    // Create PDF
    const doc = new jsPDF()
    
    // Add title
    const titleMap: Record<string, string> = {
      'summary': 'Summary Report',
      'vehicles': 'Vehicle Report',
      'agreements': 'Agreement Report',
      'partners': 'Partner SLA Report',
      'utilisation': 'Utilisation Report',
      'fleet-availability': 'Fleet Availability Report',
      'drivers': 'Driver Report',
      'health': 'Vehicle Health Report',
      'vor': 'VOR (Vehicle Off Road) Report',
      'analytics': 'Analytics Report',
    }
    const title = titleMap[reportType] || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`
    doc.setFontSize(18)
    doc.text(title, 14, 20)
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
    
    // Prepare data based on report type
    if (reportType === 'summary') {
      // Calculate summary metrics
      const vehiclesOverdue = vehiclesWithRisk.filter((v) => v.days_overdue > 0).length
      const contractsExpiringSoon = agreements.filter((a) => {
        const endDate = new Date(a.end_date)
        const today = new Date()
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0 && a.status === 'Signed'
      }).length
      const highRiskVehicles = vehiclesWithRisk.filter((v) => v.risk_level === 'High').length

      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Average Part Lead Time (days)', '5'],
          ['Vehicles Overdue', vehiclesOverdue.toString()],
          ['Contracts Expiring Soon', contractsExpiringSoon.toString()],
          ['High-Risk Vehicles', highRiskVehicles.toString()],
        ],
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'vehicles') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      autoTable(doc, {
        head: [['VIN', 'Registration', 'Rental Partner', 'Part Status', 'Days Overdue', 'Contract Expiry', 'Risk Level', 'Risk Score']],
        body: vehiclesWithRisk.map((v) => [
          v.vin,
          v.registration,
          v.rental_partner,
          v.part_status,
          v.days_overdue.toString(),
          formatDate(v.contract_expiry),
          v.risk_level,
          v.risk_score.toString(),
        ]),
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'agreements') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      autoTable(doc, {
        head: [['Contract Number', 'VIN', 'Registration', 'Rental Partner', 'Driver Name', 'Driver License', 'Driver Phone', 'Start Date', 'End Date', 'Status']],
        body: agreements.map((a) => [
          a.contract_number,
          a.vin,
          a.registration,
          a.rental_partner,
          a.driverName || '',
          a.driverLicense || '',
          a.driverPhone || '',
          formatDate(a.start_date),
          formatDate(a.end_date),
          a.status,
        ]),
        startY: 40,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'partners') {
      autoTable(doc, {
        head: [['Partner ID', 'Average Lead Time (hours)', 'SLA Percentage', 'Open Jobs']],
        body: partners.map((p) => [
          p.id,
          p.avgLeadTimeHours.toString(),
          p.slaPercent.toString() + '%',
          p.openJobs.toString(),
        ]),
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'utilisation') {
      autoTable(doc, {
        head: [['Date', 'Utilisation (%)']],
        body: utilisation.map((u) => [
          u.date,
          u.utilisation.toString() + '%',
        ]),
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'fleet-availability') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      autoTable(doc, {
        head: [['VIN', 'Registration', 'Model', 'Location', 'Availability Status', 'Next Available Date', 'Rental Partner']],
        body: vehicles.map((v) => [
          v.vin,
          v.registration,
          v.model,
          v.location,
          v.availability_status,
          v.next_available_date ? formatDate(v.next_available_date) : 'N/A',
          v.rental_partner,
        ]),
        startY: 40,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'drivers') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      autoTable(doc, {
        head: [['Driver Name', 'Driver License', 'Driver Phone', 'Contract Number', 'Vehicle Registration', 'Customer', 'Start Date', 'End Date', 'Status']],
        body: agreementsFull
          .filter((a) => a.driverName)
          .map((a) => {
            const vehicle = vehicles.find((v) => v.id === a.vehicleId)
            return [
              a.driverName || '',
              a.driverLicense || '',
              a.driverPhone || '',
              a.agreementId,
              vehicle?.registration || '',
              a.customer,
              formatDate(a.startAt),
              formatDate(a.endAt),
              a.status,
            ]
          }),
        startY: 40,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'health') {
      // Format date helper
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        return `${day}/${month}/${year}`
      }
      
      autoTable(doc, {
        head: [['VIN', 'Registration', 'Model', 'Health Score', 'Battery Health (%)', 'Last OTA Update', 'MOT Expiry', 'Fault Codes']],
        body: vehicles.map((v) => [
          v.vin,
          v.registration,
          v.model,
          v.health.healthScore.toString(),
          v.health.batteryHealth.toString() + '%',
          formatDate(v.health.lastOta),
          formatDate(v.health.motExpiry),
          v.health.faultCodes.join(', ') || 'None',
        ]),
        startY: 40,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    } else if (reportType === 'vor') {
      // Format date helper
      const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'N/A'
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(-2)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes} on ${day}/${month}/${year}`
      }

      // Format duration helper
      const formatDuration = (seconds: number | null | undefined): string => {
        if (!seconds) return '—'
        const totalHours = Math.floor(seconds / 3600)
        const days = Math.floor(totalHours / 24)
        const hours = totalHours % 24
        const months = Math.floor(days / 30)
        const remainingDays = days % 30
        
        if (months > 0) {
          return `${months}m ${remainingDays}d ${hours}h`
        } else if (days > 0) {
          return `${days}d ${hours}h`
        }
        return `${hours}h`
      }

      // Get time in current stage
      const getTimeInStage = (v: typeof vehicles[0]): number | null => {
        const ts = v.stage_timestamps || {}
        if (v.availability_status === 'In Workshop') {
          const workshopIn = ts.workshopInAt || ts.inspectedAt
          if (workshopIn) {
            return Math.floor((Date.now() - new Date(workshopIn).getTime()) / 1000)
          }
        } else if (ts.partsRequestedAt && v.availability_status !== 'Available') {
          if (ts.partsRequestedAt) {
            return Math.floor((Date.now() - new Date(ts.partsRequestedAt).getTime()) / 1000)
          }
        } else if (v.availability_status === 'Awaiting Valet') {
          if (ts.returnedAt) {
            return Math.floor((Date.now() - new Date(ts.returnedAt).getTime()) / 1000)
          }
        }
        return null
      }

      // Filter VOR vehicles
      const vorVehicles = vehicles.filter((v) => {
        const ts = v.stage_timestamps || {}
        return v.availability_status === 'In Workshop' ||
               (ts.partsRequestedAt && v.availability_status !== 'Available') ||
               v.availability_status === 'Awaiting Valet' ||
               v.availability_status === 'Awaiting Documents' ||
               v.availability_status === 'Awaiting Allocation'
      })

      // Create main table with key information
      autoTable(doc, {
        head: [['VIN', 'Registration', 'Model', 'Status', 'Time in Stage', 'Location', 'Partner']],
        body: vorVehicles.map((v) => {
          const timeInStage = getTimeInStage(v)
          return [
            v.vin,
            v.registration,
            v.model,
            v.availability_status,
            formatDuration(timeInStage),
            v.location,
            v.rental_partner,
          ]
        }),
        startY: 40,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
      })

      // Add detailed information for each vehicle on new pages
      let currentY = (doc as any).lastAutoTable.finalY + 20
      
      vorVehicles.forEach((v, index) => {
        if (index > 0 && currentY > 250) {
          doc.addPage()
          currentY = 20
        }

        const ts = v.stage_timestamps || {}
        const timeInStage = getTimeInStage(v)

        // Vehicle header
        doc.setFontSize(12)
        doc.text(`${v.model} - ${v.registration} (${v.vin})`, 14, currentY)
        currentY += 10

        // Details table
        const details = [
          ['Status', v.availability_status],
          ['Time in Stage', formatDuration(timeInStage)],
          ['Current Progress', v.currentProgress || 'N/A'],
          ['Location', v.location],
          ['Rental Partner', v.rental_partner],
          ['Returned At', formatDate(ts.returnedAt)],
          ['Inspected At', formatDate(ts.inspectedAt)],
          ['Workshop In At', formatDate(ts.workshopInAt)],
          ['Parts Requested At', formatDate(ts.partsRequestedAt)],
        ]

        if (v.partsInfo) {
          details.push(
            ['Parts Depot', v.partsInfo.depot || 'N/A'],
            ['Part Name', v.partsInfo.partName || 'N/A'],
            ['Part Number', v.partsInfo.partNumber || 'N/A'],
            ['Parts Order Date', formatDate(v.partsInfo.orderDate)],
            ['Parts ETA', formatDate(v.partsInfo.eta)]
          )
        }

        if (v.workshopEta) {
          details.push(['Workshop ETA', formatDate(v.workshopEta)])
        }

        if (v.lastUpdate) {
          details.push(['Last Update', formatDate(v.lastUpdate)])
        }

        if (v.vorUpdate) {
          details.push(['VOR Update', formatDate(v.vorUpdate)])
        }

        autoTable(doc, {
          head: [['Field', 'Value']],
          body: details,
          startY: currentY,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [200, 200, 200] },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 120 },
          },
        })

        currentY = (doc as any).lastAutoTable.finalY + 15
      })
    } else if (reportType === 'analytics') {
      // Calculate comprehensive analytics data
      const totalContracts = agreementsFull.length
      const activeContracts = agreementsFull.filter(a => a.stage !== 'Closed' && a.status !== 'Overdue').length
      const closedContracts = agreementsFull.filter(a => a.stage === 'Closed').length
      const overdueContracts = agreementsFull.filter(a => a.status === 'Overdue').length
      
      const totalRevenue = (invoices as any[]).filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.amount, 0)
      const totalExpenses = (purchaseOrders as any[]).reduce((sum: number, po: any) => sum + po.amount, 0)
      const netProfit = totalRevenue - totalExpenses
      
      const totalInvoices = (invoices as any[]).length
      const paidInvoices = (invoices as any[]).filter((i: any) => i.status === 'paid').length
      const pendingInvoices = (invoices as any[]).filter((i: any) => i.status === 'sent' || i.status === 'draft').length
      const overdueInvoices = (invoices as any[]).filter((i: any) => i.status === 'overdue').length
      
      const totalPOs = (purchaseOrders as any[]).length
      const deliveredPOs = (purchaseOrders as any[]).filter((po: any) => po.status === 'delivered').length
      
      // Compliance metrics
      const compliantContracts = agreementsFull.filter(a => {
        if ((a as any).breaches) {
          return (a as any).breaches.every((b: any) => b.resolved)
        }
        return true
      }).length
      const complianceRate = totalContracts > 0 ? Math.round((compliantContracts / totalContracts) * 100) : 100
      
      // Penalties and breaches
      const totalPenalties = agreementsFull.reduce((sum: number, a) => {
        if ((a as any).penalties) {
          return sum + (a as any).penalties.reduce((pSum: number, p: any) => pSum + p.amount, 0)
        }
        return sum
      }, 0)
      const pendingPenalties = agreementsFull.reduce((sum: number, a) => {
        if ((a as any).penalties) {
          return sum + (a as any).penalties.filter((p: any) => p.status === 'pending').reduce((pSum: number, p: any) => pSum + p.amount, 0)
        }
        return sum
      }, 0)
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
      
      // Contract duration metrics
      const avgContractDuration = agreementsFull.reduce((sum, a) => {
        const start = new Date(a.startAt)
        const end = new Date(a.endAt)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return sum + days
      }, 0) / totalContracts || 0
      
      // Vehicle utilization
      const totalVehicles = vehicles.length
      const availableVehicles = vehicles.filter(v => v.availability_status === 'Available').length
      const onHireVehicles = vehicles.filter(v => v.availability_status === 'On Hire').length
      const inWorkshopVehicles = vehicles.filter(v => v.availability_status === 'In Workshop').length
      const utilizationRate = totalVehicles > 0 ? Math.round((onHireVehicles / totalVehicles) * 100) : 0
      
      // Supplier metrics
      const totalSuppliers = suppliers.length
      const activeSuppliers = suppliers.filter(s => s.onboardingStatus === 'completed').length
      
      // Buyback metrics
      const totalBuybacks = buybackAgreements.length
      const completedBuybacks = buybackAgreements.filter(b => b.status === 'completed').length
      const totalBuybackValue = buybackAgreements.reduce((sum, b) => sum + b.buybackPrice, 0)
      
      // Format currency helper
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
      }
      
      let currentY = 40
      
      // Contract Overview Section
      doc.setFontSize(14)
      doc.text('Contract Overview', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Total Contracts', totalContracts.toString()],
          ['Active Contracts', activeContracts.toString()],
          ['Closed Contracts', closedContracts.toString()],
          ['Overdue Contracts', overdueContracts.toString()],
          ['Average Contract Duration (days)', Math.round(avgContractDuration).toString()],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Financial Overview Section
      doc.setFontSize(14)
      doc.text('Financial Overview', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Total Revenue', formatCurrency(totalRevenue)],
          ['Total Expenses', formatCurrency(totalExpenses)],
          ['Net Profit', formatCurrency(netProfit)],
          ['Profit Margin (%)', totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100).toString() + '%' : '0%'],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Invoice Metrics Section
      doc.setFontSize(14)
      doc.text('Invoice Metrics', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Total Invoices', totalInvoices.toString()],
          ['Paid Invoices', paidInvoices.toString()],
          ['Pending Invoices', pendingInvoices.toString()],
          ['Overdue Invoices', overdueInvoices.toString()],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Purchase Order Metrics Section
      doc.setFontSize(14)
      doc.text('Purchase Order Metrics', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Total Purchase Orders', totalPOs.toString()],
          ['Delivered Purchase Orders', deliveredPOs.toString()],
          ['Total PO Value', formatCurrency(totalExpenses)],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Compliance & Risk Section
      doc.setFontSize(14)
      doc.text('Compliance & Risk', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Compliance Rate (%)', complianceRate.toString() + '%'],
          ['Compliant Contracts', compliantContracts.toString()],
          ['Total Penalties', formatCurrency(totalPenalties)],
          ['Pending Penalties', formatCurrency(pendingPenalties)],
          ['Total Breaches', totalBreaches.toString()],
          ['Unresolved Breaches', unresolvedBreaches.toString()],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Vehicle Metrics Section
      doc.setFontSize(14)
      doc.text('Vehicle Metrics', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Total Vehicles', totalVehicles.toString()],
          ['Available Vehicles', availableVehicles.toString()],
          ['On Hire Vehicles', onHireVehicles.toString()],
          ['In Workshop Vehicles', inWorkshopVehicles.toString()],
          ['Utilization Rate (%)', utilizationRate.toString() + '%'],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 20
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      // Supplier & Buyback Metrics Section
      doc.setFontSize(14)
      doc.text('Supplier & Buyback Metrics', 14, currentY)
      currentY += 10
      
      autoTable(doc, {
        head: [['Category', 'Metric', 'Value']],
        body: [
          ['Suppliers', 'Total Suppliers', totalSuppliers.toString()],
          ['Suppliers', 'Active Suppliers', activeSuppliers.toString()],
          ['Buybacks', 'Total Buybacks', totalBuybacks.toString()],
          ['Buybacks', 'Completed Buybacks', completedBuybacks.toString()],
          ['Buybacks', 'Total Buyback Value', formatCurrency(totalBuybackValue)],
        ],
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      })
    }
    
    // Save PDF
    doc.save(`${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (error) {
    console.error('PDF export error:', error)
    throw error
  }
}




