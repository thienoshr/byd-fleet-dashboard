import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

/**
 * API route for exporting reports
 * Supports CSV and PDF formats for different report types
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'summary'
  const format = searchParams.get('format') || 'csv'

  const db = getDb()

  try {
    if (format === 'csv') {
      // Return CSV data
      let csvData = ''
      let headers: string[] = []
      let rows: any[] = []

      if (type === 'summary') {
        // Summary report
        const avgLeadTime = db
          .prepare('SELECT AVG(lead_time_days) as avg FROM parts WHERE lead_time_days IS NOT NULL')
          .get() as { avg: number | null }
        const overdueCount = db
          .prepare('SELECT COUNT(*) as count FROM vehicles WHERE days_overdue > 0')
          .get() as { count: number }
        const expiringCount = db
          .prepare(`
            SELECT COUNT(*) as count 
            FROM agreements 
            WHERE status = 'Signed' 
            AND end_date <= date('now', '+30 days') 
            AND end_date >= date('now')
          `)
          .get() as { count: number }
        const highRiskCount = db
          .prepare("SELECT COUNT(*) as count FROM vehicles WHERE risk_flag = 'High'")
          .get() as { count: number }

        headers = ['Metric', 'Value']
        rows = [
          ['Average Part Lead Time (days)', Math.round(avgLeadTime.avg || 0)],
          ['Vehicles Overdue', overdueCount.count],
          ['Contracts Expiring Soon', expiringCount.count],
          ['High-Risk Vehicles', highRiskCount.count],
        ]
      } else if (type === 'vehicles') {
        // Vehicle report
        headers = ['Vehicle ID', 'Registration', 'Rental Partner', 'Part Status', 'Days Overdue', 'Contract Expiry', 'Risk Flag']
        const vehicles = db
          .prepare('SELECT * FROM vehicles ORDER BY risk_flag DESC, days_overdue DESC')
          .all() as any[]
        rows = vehicles.map((v) => [
          v.vehicle_id,
          v.registration,
          v.rental_partner,
          v.part_status,
          v.days_overdue,
          v.contract_expiry || 'N/A',
          v.risk_flag,
        ])
      } else if (type === 'agreements') {
        // Agreement report
        headers = ['Contract Number', 'Vehicle ID', 'Rental Partner', 'Start Date', 'End Date', 'Status']
        const agreements = db
          .prepare('SELECT * FROM agreements ORDER BY end_date ASC')
          .all() as any[]
        rows = agreements.map((a) => [
          a.contract_number,
          a.vehicle_id,
          a.rental_partner,
          a.start_date,
          a.end_date,
          a.status,
        ])
      }

      // Generate CSV string
      csvData = [headers, ...rows].map((row) => row.map((cell: string | number) => `"${cell}"`).join(',')).join('\n')

      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-report-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else if (format === 'pdf') {
      // Return JSON data for PDF generation (handled client-side)
      let data: any = {}

      if (type === 'summary') {
        const avgLeadTime = db
          .prepare('SELECT AVG(lead_time_days) as avg FROM parts WHERE lead_time_days IS NOT NULL')
          .get() as { avg: number | null }
        const overdueCount = db
          .prepare('SELECT COUNT(*) as count FROM vehicles WHERE days_overdue > 0')
          .get() as { count: number }
        const expiringCount = db
          .prepare(`
            SELECT COUNT(*) as count 
            FROM agreements 
            WHERE status = 'Signed' 
            AND end_date <= date('now', '+30 days') 
            AND end_date >= date('now')
          `)
          .get() as { count: number }
        const highRiskCount = db
          .prepare("SELECT COUNT(*) as count FROM vehicles WHERE risk_flag = 'High'")
          .get() as { count: number }

        data.summary = [
          ['Average Part Lead Time (days)', Math.round(avgLeadTime.avg || 0)],
          ['Vehicles Overdue', overdueCount.count],
          ['Contracts Expiring Soon', expiringCount.count],
          ['High-Risk Vehicles', highRiskCount.count],
        ]
      } else if (type === 'vehicles') {
        data.vehicles = db
          .prepare('SELECT * FROM vehicles ORDER BY risk_flag DESC, days_overdue DESC')
          .all()
      } else if (type === 'agreements') {
        data.agreements = db
          .prepare('SELECT * FROM agreements ORDER BY end_date ASC')
          .all()
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}




