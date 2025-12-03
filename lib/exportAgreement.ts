'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import type { AgreementFull } from '@/lib/dummyData'
import type { Vehicle } from '@/lib/dummyData'

/**
 * Export a single agreement as PDF
 * @param agreement - The agreement to export
 * @param vehicle - The vehicle associated with the agreement
 */
export function exportAgreementPDF(agreement: AgreementFull, vehicle: Vehicle) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text('RENTAL AGREEMENT', 14, 20)
  
  // Agreement details
  doc.setFontSize(12)
  let yPos = 35
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }
  
  // Contract/Agreement Information Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Contract & Agreement Information', 14, yPos)
  yPos += 10
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Contract ID:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(agreement.agreementId, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Customer:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(agreement.customer, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Stage:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(agreement.stage, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Status:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(agreement.status, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Assigned To:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(agreement.assignedTo, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Created At:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDateTime(agreement.createdAt), 60, yPos)
  yPos += 7
  
  if (agreement.startAt) {
    doc.setFont('helvetica', 'bold')
    doc.text('Start Date:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(agreement.startAt), 60, yPos)
    yPos += 7
  }
  
  if (agreement.endAt) {
    doc.setFont('helvetica', 'bold')
    doc.text('End Date:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(agreement.endAt), 60, yPos)
    yPos += 7
  }

  // Driver Information
  if (agreement.driverName || agreement.driverLicense || agreement.driverPhone) {
    yPos += 5
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Driver Information', 14, yPos)
    yPos += 10
    
    doc.setFontSize(12)
    if (agreement.driverName) {
      doc.setFont('helvetica', 'bold')
      doc.text('Driver Name:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(agreement.driverName, 60, yPos)
      yPos += 7
    }
    
    if (agreement.driverLicense) {
      doc.setFont('helvetica', 'bold')
      doc.text('Driver License:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(agreement.driverLicense, 60, yPos)
      yPos += 7
    }
    
    if (agreement.driverPhone) {
      doc.setFont('helvetica', 'bold')
      doc.text('Driver Phone:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(agreement.driverPhone, 60, yPos)
      yPos += 7
    }
  }

  // Timestamps
  if (agreement.timestamps) {
    yPos += 5
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Agreement Timestamps', 14, yPos)
    yPos += 10
    
    doc.setFontSize(12)
    if (agreement.timestamps.reservationCreatedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Reservation Created:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.reservationCreatedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.preparedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Prepared At:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.preparedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.signedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Signed At:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.signedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.collectedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Collected At:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.collectedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.returnedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Returned At:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.returnedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.damageCheckCompletedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Damage Check Completed:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.damageCheckCompletedAt), 60, yPos)
      yPos += 7
    }
    
    if (agreement.timestamps.closedAt) {
      doc.setFont('helvetica', 'bold')
      doc.text('Closed At:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDateTime(agreement.timestamps.closedAt), 60, yPos)
      yPos += 7
    }
  }

  // Notes
  if (agreement.notes) {
    yPos += 5
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes', 14, yPos)
    yPos += 10
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(agreement.notes, 180)
    doc.text(notesLines, 14, yPos)
    yPos += notesLines.length * 7
  }
  
  yPos += 5
  
  // Vehicle Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Vehicle Information', 14, yPos)
  yPos += 10
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Model:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.model, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Registration:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.registration, 60, yPos)
  yPos += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('VIN:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.vin, 60, yPos)
  yPos += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Location:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.location, 60, yPos)
  yPos += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Rental Partner:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.rental_partner, 60, yPos)
  yPos += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Availability Status:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(vehicle.availability_status, 60, yPos)
  yPos += 7

  // Vehicle Health Information
  if (vehicle.health) {
    yPos += 5
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Vehicle Health', 14, yPos)
    yPos += 10
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Health Score:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(vehicle.health.healthScore.toString(), 60, yPos)
    yPos += 7
    
    doc.setFont('helvetica', 'bold')
    doc.text('Battery Health:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${vehicle.health.batteryHealth}%`, 60, yPos)
    yPos += 7
    
    doc.setFont('helvetica', 'bold')
    doc.text('Last OTA:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(vehicle.health.lastOta), 60, yPos)
    yPos += 7
    
    doc.setFont('helvetica', 'bold')
    doc.text('MOT Expiry:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(vehicle.health.motExpiry), 60, yPos)
    yPos += 7
    
    if (vehicle.health.faultCodes && vehicle.health.faultCodes.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Fault Codes:', 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(vehicle.health.faultCodes.join(', '), 60, yPos)
      yPos += 7
    }
  }
  
  // Save PDF
  doc.save(`agreement-${agreement.agreementId}-${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Export a single agreement as CSV
 * @param agreement - The agreement to export
 * @param vehicle - The vehicle associated with the agreement
 */
export function exportAgreementCSV(agreement: AgreementFull, vehicle: Vehicle) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }
  
  const data = [
    // Contract & Agreement Information
    ['Section', 'Field', 'Value'],
    ['Contract & Agreement', 'Contract ID', agreement.agreementId],
    ['Contract & Agreement', 'Customer', agreement.customer],
    ['Contract & Agreement', 'Stage', agreement.stage],
    ['Contract & Agreement', 'Status', agreement.status],
    ['Contract & Agreement', 'Assigned To', agreement.assignedTo],
    ['Contract & Agreement', 'Created At', formatDateTime(agreement.createdAt)],
    ['Contract & Agreement', 'Start Date', agreement.startAt ? formatDate(agreement.startAt) : ''],
    ['Contract & Agreement', 'End Date', agreement.endAt ? formatDate(agreement.endAt) : ''],
    
    // Driver Information
    ['Driver', 'Driver Name', agreement.driverName || ''],
    ['Driver', 'Driver License', agreement.driverLicense || ''],
    ['Driver', 'Driver Phone', agreement.driverPhone || ''],
    
    // Timestamps
    ['Timestamps', 'Reservation Created', agreement.timestamps?.reservationCreatedAt ? formatDateTime(agreement.timestamps.reservationCreatedAt) : ''],
    ['Timestamps', 'Prepared At', agreement.timestamps?.preparedAt ? formatDateTime(agreement.timestamps.preparedAt) : ''],
    ['Timestamps', 'Signed At', agreement.timestamps?.signedAt ? formatDateTime(agreement.timestamps.signedAt) : ''],
    ['Timestamps', 'Collected At', agreement.timestamps?.collectedAt ? formatDateTime(agreement.timestamps.collectedAt) : ''],
    ['Timestamps', 'Returned At', agreement.timestamps?.returnedAt ? formatDateTime(agreement.timestamps.returnedAt) : ''],
    ['Timestamps', 'Damage Check Completed', agreement.timestamps?.damageCheckCompletedAt ? formatDateTime(agreement.timestamps.damageCheckCompletedAt) : ''],
    ['Timestamps', 'Closed At', agreement.timestamps?.closedAt ? formatDateTime(agreement.timestamps.closedAt) : ''],
    
    // Notes
    ['Notes', 'Notes', agreement.notes || ''],
    
    // Vehicle Information
    ['Vehicle', 'Model', vehicle.model],
    ['Vehicle', 'Registration', vehicle.registration],
    ['Vehicle', 'VIN', vehicle.vin],
    ['Vehicle', 'Location', vehicle.location],
    ['Vehicle', 'Rental Partner', vehicle.rental_partner],
    ['Vehicle', 'Availability Status', vehicle.availability_status],
    
    // Vehicle Health
    ['Vehicle Health', 'Health Score', vehicle.health?.healthScore?.toString() || ''],
    ['Vehicle Health', 'Battery Health', vehicle.health?.batteryHealth ? `${vehicle.health.batteryHealth}%` : ''],
    ['Vehicle Health', 'Last OTA', vehicle.health?.lastOta ? formatDate(vehicle.health.lastOta) : ''],
    ['Vehicle Health', 'MOT Expiry', vehicle.health?.motExpiry ? formatDate(vehicle.health.motExpiry) : ''],
    ['Vehicle Health', 'Fault Codes', vehicle.health?.faultCodes?.join(', ') || 'None'],
  ]
  
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `agreement-${agreement.agreementId}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

