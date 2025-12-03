/**
 * Date formatting utilities
 * Provides consistent date formatting across the application
 */

/**
 * Format date to dd/mm/yy format
 * @param dateString - ISO date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string in dd/mm/yy format
 */
export function formatDate(dateString: string | Date | null | undefined, includeTime: boolean = false): string {
  if (!dateString) return '—'
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  if (isNaN(date.getTime())) return '—'
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  
  let formatted = `${day}/${month}/${year}`
  
  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    formatted += ` ${hours}:${minutes}`
  }
  
  return formatted
}

/**
 * Format date to dd/mm/yyyy format (full year)
 * @param dateString - ISO date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string in dd/mm/yyyy format
 */
export function formatDateFullYear(dateString: string | Date | null | undefined, includeTime: boolean = false): string {
  if (!dateString) return '—'
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  if (isNaN(date.getTime())) return '—'
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  
  let formatted = `${day}/${month}/${year}`
  
  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    formatted += ` ${hours}:${minutes}`
  }
  
  return formatted
}



