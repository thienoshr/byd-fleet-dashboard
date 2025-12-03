'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Invoice } from '@/lib/dummyData'

/**
 * Export a single invoice as PDF
 * @param invoice - The invoice to export
 */
export function exportInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text('INVOICE', 14, 20)
  
  // Invoice details
  doc.setFontSize(12)
  let yPos = 35
  
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Number:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.invoiceNumber, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Supplier:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.supplierName, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Type:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.type, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Status:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.status, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Issue Date:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(invoice.issueDate).toLocaleDateString('en-US'), 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Due Date:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(invoice.dueDate).toLocaleDateString('en-US'), 60, yPos)
  yPos += 7
  
  if (invoice.paidDate) {
    doc.setFont('helvetica', 'bold')
    doc.text('Paid Date:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(new Date(invoice.paidDate).toLocaleDateString('en-US'), 60, yPos)
    yPos += 7
  }
  
  if (invoice.purchaseOrderId) {
    doc.setFont('helvetica', 'bold')
    doc.text('Purchase Order:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.purchaseOrderId, 60, yPos)
    yPos += 7
  }
  
  yPos += 5
  
  // Line items table
  autoTable(doc, {
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: invoice.lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      `£${item.unitPrice.toFixed(2)}`,
      `£${item.total.toFixed(2)}`,
    ]),
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] },
  })
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Amount:', 120, finalY)
  doc.text(`£${invoice.amount.toFixed(2)}`, 160, finalY)
  
  // Notes
  if (invoice.notes) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Notes:', 14, finalY + 15)
    const splitNotes = doc.splitTextToSize(invoice.notes, 180)
    doc.text(splitNotes, 14, finalY + 22)
  }
  
  // Save PDF
  doc.save(`invoice-${invoice.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`)
}



