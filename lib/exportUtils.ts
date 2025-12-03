'use client'

import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export data to CSV format using PapaParse
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file (without extension)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Convert data to CSV with proper formatting
  const csv = Papa.unparse(data, {
    header: true,
    skipEmptyLines: true,
  })

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export table to PDF using jsPDF
 * @param tableId - ID of the HTML table element to export
 * @param filename - Name of the PDF file (without extension)
 * @param title - Optional title for the PDF
 */
export function exportToPDF(
  tableId: string,
  filename: string,
  title?: string
): void {
  const table = document.getElementById(tableId)
  if (!table) {
    alert('Table not found')
    return
  }

  const doc = new jsPDF()

  // Add title if provided
  if (title) {
    doc.setFontSize(18)
    doc.text(title, 14, 20)
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
  }

  // Extract table data
  const headers: string[] = []
  const rows: (string | number)[][] = []

  // Get headers
  const headerRow = table.querySelector('thead tr')
  if (headerRow) {
    headerRow.querySelectorAll('th').forEach((th) => {
      // Remove sort icons and get clean text
      const text = th.textContent?.trim() || ''
      headers.push(text.replace(/[↕↑↓]/g, '').trim())
    })
  }

  // Get rows
  table.querySelectorAll('tbody tr').forEach((tr) => {
    const row: (string | number)[] = []
    tr.querySelectorAll('td').forEach((td) => {
      // Get text content, handling nested elements like badges and formatted text
      let text = ''
      
      // Check for badge/span elements first (for status, risk badges)
      const badge = td.querySelector('span')
      if (badge) {
        text = badge.textContent?.trim() || ''
      } else {
        // For cells with nested divs (like driver info), collect all text
        const nestedDivs = td.querySelectorAll('div')
        if (nestedDivs.length > 0) {
          // Collect text from all divs and join with newlines or spaces
          const parts: string[] = []
          nestedDivs.forEach((div) => {
            const divText = div.textContent?.trim()
            if (divText) {
              parts.push(divText)
            }
          })
          // If we have parts, join them; otherwise fall back to full text
          text = parts.length > 0 ? parts.join(' | ') : td.textContent?.trim() || td.innerText?.trim() || ''
        } else {
          // Get all text content, including nested text nodes
          text = td.textContent?.trim() || td.innerText?.trim() || ''
        }
      }
      
      // Clean up any extra whitespace and newlines
      text = text.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim()
      row.push(text)
    })
    // Only add row if it has content and matches header count
    if (row.length > 0 && row.length === headers.length && row.some(cell => cell !== '')) {
      rows.push(row)
    }
  })

  // Add table to PDF
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: title ? 40 : 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  })

  // Save PDF
  doc.save(`${filename}.pdf`)
}




