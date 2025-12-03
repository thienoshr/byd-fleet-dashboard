'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { agreementsFull, vehicles } from '@/lib/dummyData'

type EmailTemplate = 'overdueReturn' | 'vehicleReady' | 'allocationConfirmed' | 'repairComplete' | 'contractExpiryReminder'

interface EmailTemplateData {
  template: EmailTemplate
  recipient: string
  cc: string
  subject: string
  body: string
  variables: Record<string, string>
}

interface EmailHistoryEntry {
  id: string
  timestamp: string
  direction: 'sent' | 'received'
  from: string
  to: string
  subject: string
  body: string
  template?: string
  status?: 'sent' | 'delivered' | 'read' | 'failed'
  agentName?: string // Agent who sent the email
  folder?: 'inbox' | 'sent' | 'spam' | 'history' | 'drafts' | 'archive' | 'trash' // Email folder
  isRead?: boolean // For inbox emails
  isStarred?: boolean // Starred/important emails
  isArchived?: boolean // Archived emails
  isDeleted?: boolean // Deleted emails
  priority?: 'high' | 'normal' | 'low' // Email priority
  hasAttachments?: boolean // Whether email has attachments
  replyTo?: string // Reply-to address
  threadId?: string // For email threading
}

// Mock email history data
const mockEmailHistory: EmailHistoryEntry[] = [
  {
    id: 'email-1',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    direction: 'sent',
    from: 'Mike Davis',
    to: 'Company Alpha',
    subject: 'Vehicle Ready for Collection',
    body: 'Dear Company Alpha,\n\nWe are pleased to inform you that your vehicle is ready for collection.\n\nVehicle Details:\n- Registration: AB12 CDE\n- Model: BYD Atto 3\n\nCollection Details:\n- Location: London Heathrow\n- Collection Date: February 7, 2025\n\nPlease contact us to arrange a convenient collection time.\n\nBest regards,\nBYD Fleet Management',
    template: 'vehicleReady',
    status: 'delivered',
    agentName: 'Mike Davis',
  },
  {
    id: 'email-2',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    direction: 'sent',
    from: 'Sarah Johnson',
    to: 'Beta Rentals',
    subject: 'Vehicle Return Overdue - Action Required',
    body: 'Dear Beta Rentals,\n\nThis is to inform you that the return of vehicle FG34 HIJ under contract C-002 is overdue.\n\nReturn Date: January 10, 2025\nDays Overdue: 28\n\nPlease arrange for the immediate return of the vehicle or contact us to discuss an extension.\n\nBest regards,\nBYD Fleet Management',
    template: 'overdueReturn',
    status: 'read',
    agentName: 'Sarah Johnson',
  },
  {
    id: 'email-3',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    direction: 'received',
    from: 'Gamma Corp',
    to: 'Operations Team',
    subject: 'Re: Vehicle Allocation Confirmed',
    body: 'Thank you for confirming the vehicle allocation. We will collect the vehicle on the scheduled date.\n\nBest regards,\nGamma Corp',
    status: 'read',
    folder: 'inbox',
    isRead: true,
    isStarred: true,
    priority: 'high',
  },
  {
    id: 'email-4',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    direction: 'sent',
    from: 'John Smith',
    to: 'Delta Services',
    subject: 'Vehicle Allocation Confirmed',
    body: 'Dear Delta Services,\n\nYour vehicle allocation has been confirmed.\n\nVehicle Details:\n- Registration: BYD-007\n- Model: BYD Seal U\n\nRental Period:\n- Start Date: November 2, 2024\n- End Date: November 30, 2025\n\nCollection Location: London Heathrow\n\nBest regards,\nBYD Fleet Management',
    template: 'allocationConfirmed',
    status: 'delivered',
    agentName: 'John Smith',
  },
  {
    id: 'email-5',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    direction: 'sent',
    from: 'Mike Davis',
    to: 'Epsilon Ltd',
    subject: 'Contract Expiry Reminder',
    body: 'Dear Epsilon Ltd,\n\nThis is a reminder that your rental contract is due to expire soon.\n\nContract Details:\n- Contract Number: C-005\n- Vehicle: BYD-010\n- Expiry Date: February 20, 2025\n- Days Until Expiry: 13\n\nPlease contact us to discuss renewal options or arrange for vehicle return.\n\nBest regards,\nBYD Fleet Management',
    template: 'contractExpiryReminder',
    status: 'sent',
    agentName: 'Mike Davis',
  },
  {
    id: 'email-6',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    direction: 'received',
    from: 'Company Alpha',
    to: 'Operations Team',
    subject: 'Re: Vehicle Ready for Collection',
    body: 'Thank you for the notification. We will arrange collection on February 8, 2025.\n\nBest regards,\nCompany Alpha',
    status: 'read',
    folder: 'inbox',
    isRead: true,
  },
  {
    id: 'email-11',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    direction: 'sent',
    from: 'Sarah Johnson',
    to: 'Customer Service',
    subject: 'Draft: Monthly Review',
    body: 'This is a draft email that I started writing...',
    status: 'sent',
    folder: 'drafts',
    agentName: 'Sarah Johnson',
  },
  {
    id: 'email-12',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    direction: 'received',
    from: 'Old Customer',
    to: 'Operations Team',
    subject: 'Old Inquiry',
    body: 'This is an old email that has been archived.',
    status: 'read',
    folder: 'archive',
    isRead: true,
    isArchived: true,
  },
]

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
}

interface Coworker {
  id: string
  name: string
  role: string
  avatar?: string
  isOnline: boolean
}

interface Contact {
  id: string
  name: string
  phone: string
  type: 'customer' | 'coworker' | 'partner' | 'supplier'
  company?: string
  role?: string
}

interface CallHistoryEntry {
  id: string
  contactId: string
  contactName: string
  phone: string
  type: 'outgoing' | 'incoming' | 'missed'
  duration?: number // in seconds
  timestamp: string
  notes?: string
  vehicleRegistration?: string
  contractId?: string
  caseId?: string
  relatedContactId?: string
  transcript?: string
  recordingUrl?: string
  agentName?: string // Agent who made/received the call
}

interface CallTranscript {
  fullText: string
  segments: Array<{
    speaker: 'agent' | 'customer'
    text: string
    timestamp: number
  }>
  extractedEntities: {
    vehicleRegistrations: string[]
    contractIds: string[]
    caseIds: string[]
    keyPoints: string[]
  }
}

// Mock coworkers
const mockCoworkers: Coworker[] = [
  { id: 'user-1', name: 'Mike Davis', role: 'Operations Manager', isOnline: true },
  { id: 'user-2', name: 'Sarah Johnson', role: 'Fleet Coordinator', isOnline: true },
  { id: 'user-3', name: 'John Smith', role: 'Service Technician', isOnline: false },
  { id: 'user-4', name: 'Emma Wilson', role: 'Customer Relations', isOnline: true },
  { id: 'user-5', name: 'David Taylor', role: 'Fleet Analyst', isOnline: false },
]

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    senderName: 'Mike Davis',
    message: 'Hey team, just wanted to update everyone that the BYD-V001 is ready for collection.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    senderName: 'Sarah Johnson',
    message: 'Thanks Mike! I\'ll notify the customer right away.',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'msg-3',
    senderId: 'user-4',
    senderName: 'Emma Wilson',
    message: 'Great coordination team! The customer has been informed.',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    senderName: 'Mike Davis',
    message: 'Also, we have a vehicle coming in for service tomorrow. Can someone check the parts availability?',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
]

const currentUserId = 'user-2' // Current logged-in user

// Mock contacts for calling
const mockContacts: Contact[] = [
  // Customers
  { id: 'cust-1', name: 'Company Alpha', phone: '+44 20 7123 4567', type: 'customer', company: 'Company Alpha' },
  { id: 'cust-2', name: 'Beta Rentals', phone: '+44 20 7123 4568', type: 'customer', company: 'Beta Rentals' },
  { id: 'cust-3', name: 'Gamma Corp', phone: '+44 20 7123 4569', type: 'customer', company: 'Gamma Corp' },
  { id: 'cust-4', name: 'Delta Services', phone: '+44 20 7123 4570', type: 'customer', company: 'Delta Services' },
  { id: 'cust-5', name: 'Epsilon Ltd', phone: '+44 20 7123 4571', type: 'customer', company: 'Epsilon Ltd' },
  // Coworkers
  { id: 'coworker-1', name: 'Mike Davis', phone: '+44 20 7123 5001', type: 'coworker', role: 'Operations Manager' },
  { id: 'coworker-2', name: 'Sarah Johnson', phone: '+44 20 7123 5002', type: 'coworker', role: 'Fleet Coordinator' },
  { id: 'coworker-3', name: 'John Smith', phone: '+44 20 7123 5003', type: 'coworker', role: 'Service Technician' },
  { id: 'coworker-4', name: 'Emma Wilson', phone: '+44 20 7123 5004', type: 'coworker', role: 'Customer Relations' },
  { id: 'coworker-5', name: 'David Taylor', phone: '+44 20 7123 5005', type: 'coworker', role: 'Fleet Analyst' },
  // Partners
  { id: 'partner-1', name: 'Partner A', phone: '+44 20 7123 6001', type: 'partner', company: 'Partner A' },
  { id: 'partner-2', name: 'Partner B', phone: '+44 20 7123 6002', type: 'partner', company: 'Partner B' },
  { id: 'partner-3', name: 'Partner C', phone: '+44 20 7123 6003', type: 'partner', company: 'Partner C' },
  // Suppliers
  { id: 'supplier-1', name: 'Parts Supplier Ltd', phone: '+44 20 7123 7001', type: 'supplier', company: 'Parts Supplier Ltd' },
  { id: 'supplier-2', name: 'Vehicle Services Co', phone: '+44 20 7123 7002', type: 'supplier', company: 'Vehicle Services Co' },
  { id: 'supplier-3', name: 'Fleet Maintenance UK', phone: '+44 20 7123 7003', type: 'supplier', company: 'Fleet Maintenance UK' },
]

// Mock call history
const mockCallHistory: CallHistoryEntry[] = [
  {
    id: 'call-1',
    contactId: 'cust-1',
    contactName: 'Company Alpha',
    phone: '+44 20 7123 4567',
    type: 'outgoing',
    duration: 245,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    notes: 'Discussed vehicle collection for BYD-V001. Customer confirmed pickup time.',
    vehicleRegistration: 'AB12 CDE',
    contractId: 'C-001',
    caseId: 'CASE-001',
    agentName: 'Sarah Johnson',
  },
  {
    id: 'call-2',
    contactId: 'partner-1',
    contactName: 'Partner A',
    phone: '+44 20 7123 6001',
    type: 'incoming',
    duration: 180,
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    notes: 'Parts delivery update for vehicle FG34 HIJ',
    vehicleRegistration: 'FG34 HIJ',
    agentName: 'Mike Davis',
  },
  {
    id: 'call-3',
    contactId: 'cust-2',
    contactName: 'Beta Rentals',
    phone: '+44 20 7123 4568',
    type: 'missed',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Missed call - return to customer regarding overdue vehicle',
    contractId: 'C-002',
  },
]

export default function CommunicationsPage() {
  // Get current agent name
  const currentAgentName = mockCoworkers.find(c => c.id === currentUserId)?.name || 'Unknown Agent'
  const [activeTab, setActiveTab] = useState<'email' | 'chat' | 'calls'>('email')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [emailData, setEmailData] = useState<EmailTemplateData | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [emailHistory, setEmailHistory] = useState<EmailHistoryEntry[]>(mockEmailHistory)
  const [emailFilter, setEmailFilter] = useState<'all' | 'inbox' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash' | 'starred' | 'history'>('inbox')
  const [emailSearch, setEmailSearch] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [viewingEmail, setViewingEmail] = useState<EmailHistoryEntry | null>(null)
  const [replyingTo, setReplyingTo] = useState<EmailHistoryEntry | null>(null)
  const [forwardingEmail, setForwardingEmail] = useState<EmailHistoryEntry | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState('')
  const [callHistory, setCallHistory] = useState<CallHistoryEntry[]>(mockCallHistory)
  const [selectedContactType, setSelectedContactType] = useState<'all' | 'customer' | 'coworker' | 'partner' | 'supplier'>('all')
  const [contactSearch, setContactSearch] = useState('')
  const [dialNumber, setDialNumber] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editingCallNote, setEditingCallNote] = useState<string | null>(null)
  const [callNote, setCallNote] = useState('')
  const [callVehicleReg, setCallVehicleReg] = useState('')
  const [callContractId, setCallContractId] = useState('')
  const [callCaseId, setCallCaseId] = useState('')
  const [callFilter, setCallFilter] = useState<'all' | 'outgoing' | 'incoming' | 'missed'>('all')
  const [callSearch, setCallSearch] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [currentCallTranscript, setCurrentCallTranscript] = useState<CallTranscript | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [activeCallId, setActiveCallId] = useState<string | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current)
      }
    }
  }, [])

  const templates = {
    overdueReturn: {
      name: 'Overdue Return',
      subject: 'Vehicle Return Overdue - Action Required',
      defaultRecipient: '',
      variables: {
        vehicleRegistration: '',
        contractNumber: '',
        customerName: '',
        returnDate: '',
        daysOverdue: '',
      },
    },
    vehicleReady: {
      name: 'Vehicle Ready',
      subject: 'Vehicle Ready for Collection',
      defaultRecipient: '',
      variables: {
        vehicleRegistration: '',
        vehicleModel: '',
        customerName: '',
        location: '',
        collectionDate: '',
      },
    },
    allocationConfirmed: {
      name: 'Allocation Confirmed',
      subject: 'Vehicle Allocation Confirmed',
      defaultRecipient: '',
      variables: {
        vehicleRegistration: '',
        vehicleModel: '',
        customerName: '',
        startDate: '',
        endDate: '',
        location: '',
      },
    },
    repairComplete: {
      name: 'Repair Complete',
      subject: 'Vehicle Repair Completed',
      defaultRecipient: '',
      variables: {
        vehicleRegistration: '',
        vehicleModel: '',
        customerName: '',
        repairDescription: '',
        completionDate: '',
        location: '',
      },
    },
    contractExpiryReminder: {
      name: 'Contract Expiry Reminder',
      subject: 'Contract Expiry Reminder',
      defaultRecipient: '',
      variables: {
        contractNumber: '',
        customerName: '',
        expiryDate: '',
        daysUntilExpiry: '',
        vehicleRegistration: '',
      },
    },
  }

  const generateEmailBody = (template: EmailTemplate, vars: Record<string, string>): string => {
    switch (template) {
      case 'overdueReturn':
        return `Dear ${vars.customerName || '[Customer Name]'},

This is to inform you that the return of vehicle ${vars.vehicleRegistration || '[Registration]'} under contract ${vars.contractNumber || '[Contract Number]'} is overdue.

Return Date: ${vars.returnDate || '[Return Date]'}
Days Overdue: ${vars.daysOverdue || '[Days]'}

Please arrange for the immediate return of the vehicle or contact us to discuss an extension.

If you have any questions, please contact our operations team.

Best regards,
BYD Fleet Management`

      case 'vehicleReady':
        return `Dear ${vars.customerName || '[Customer Name]'},

We are pleased to inform you that your vehicle is ready for collection.

Vehicle Details:
- Registration: ${vars.vehicleRegistration || '[Registration]'}
- Model: ${vars.vehicleModel || '[Model]'}

Collection Details:
- Location: ${vars.location || '[Location]'}
- Collection Date: ${vars.collectionDate || '[Date]'}

Please contact us to arrange a convenient collection time.

Best regards,
BYD Fleet Management`

      case 'allocationConfirmed':
        return `Dear ${vars.customerName || '[Customer Name]'},

Your vehicle allocation has been confirmed.

Vehicle Details:
- Registration: ${vars.vehicleRegistration || '[Registration]'}
- Model: ${vars.vehicleModel || '[Model]'}

Rental Period:
- Start Date: ${vars.startDate || '[Start Date]'}
- End Date: ${vars.endDate || '[End Date]'}

Collection Location: ${vars.location || '[Location]'}

Please ensure you have all required documentation for collection.

Best regards,
BYD Fleet Management`

      case 'repairComplete':
        return `Dear ${vars.customerName || '[Customer Name]'},

We are pleased to inform you that the repair work on your vehicle has been completed.

Vehicle Details:
- Registration: ${vars.vehicleRegistration || '[Registration]'}
- Model: ${vars.vehicleModel || '[Model]'}

Repair Details:
- Description: ${vars.repairDescription || '[Repair Description]'}
- Completion Date: ${vars.completionDate || '[Completion Date]'}

Collection Location: ${vars.location || '[Location]'}

The vehicle is now ready for collection. Please contact us to arrange a convenient time.

Best regards,
BYD Fleet Management`

      case 'contractExpiryReminder':
        return `Dear ${vars.customerName || '[Customer Name]'},

This is a reminder that your rental contract is due to expire soon.

Contract Details:
- Contract Number: ${vars.contractNumber || '[Contract Number]'}
- Vehicle: ${vars.vehicleRegistration || '[Registration]'}
- Expiry Date: ${vars.expiryDate || '[Expiry Date]'}
- Days Until Expiry: ${vars.daysUntilExpiry || '[Days]'}

Please contact us to discuss renewal options or arrange for vehicle return.

Best regards,
BYD Fleet Management`

      default:
        return ''
    }
  }

  const handleTemplateSelect = (template: EmailTemplate | 'blank') => {
    if (template === 'blank') {
      setSelectedTemplate(null)
      setEmailData({
        template: 'overdueReturn' as EmailTemplate, // Default, won't be used
        recipient: '',
        cc: '',
        subject: '',
        body: '',
        variables: {},
      })
      setPreview('')
      return
    }

    setSelectedTemplate(template)
    const templateConfig = templates[template]
    // Start with empty variables - no auto-fill
    const defaultVars: Record<string, string> = { ...templateConfig.variables }
    // Ensure all variables are empty strings
    Object.keys(defaultVars).forEach(key => {
      defaultVars[key] = ''
    })

    const body = generateEmailBody(template, defaultVars)
    setEmailData({
      template,
      recipient: '',
      cc: '',
      subject: '',
      body,
      variables: defaultVars,
    })
    setPreview(body)
  }

  const handleVariableChange = (key: string, value: string) => {
    if (!emailData) return
    const updatedVars = { ...emailData.variables, [key]: value }
    const updatedBody = generateEmailBody(emailData.template, updatedVars)
    setEmailData({
      ...emailData,
      variables: updatedVars,
      body: updatedBody,
    })
    setPreview(updatedBody)
  }

  const handleBodyChange = (body: string) => {
    if (!emailData) return
    setEmailData({
      ...emailData,
      body,
    })
    setPreview(body)
  }

  const handleSend = () => {
    if (!emailData) return
    const ccText = emailData.cc ? `\nCC: ${emailData.cc}` : ''
    
    // Create new email history entry with agent stamp
    const newEmail: EmailHistoryEntry = {
      id: `email-${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'sent',
      from: currentAgentName,
      to: emailData.recipient || '[Recipient]',
      subject: emailData.subject || '[No Subject]',
      body: emailData.body,
      template: emailData.template,
      status: 'sent',
      agentName: currentAgentName,
      folder: 'sent',
    }
    
    // Add to email history
    setEmailHistory([newEmail, ...emailHistory])
    
    // Show confirmation
    alert(`Email sent to: ${emailData.recipient || '[Recipient]'}${ccText}\n\nSubject: ${emailData.subject}\n\nSent by: ${currentAgentName}\n\n${emailData.body}`)
    
    // Reset form and close compose
    setEmailData(null)
    setSelectedTemplate(null)
    setPreview('')
    setIsComposing(false)
  }

  const handleCopy = () => {
    if (!emailData) return
    const ccText = emailData.cc ? `\nCC: ${emailData.cc}` : ''
    const fullEmail = `To: ${emailData.recipient || '[Recipient]'}${ccText}\nSubject: ${emailData.subject}\n\n${emailData.body}`
    navigator.clipboard.writeText(fullEmail)
    alert('Email copied to clipboard!')
  }

  // Helper function for formatting time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} on ${day}/${month}/${year}`
  }

  // Email action handlers
  const handleDeleteEmail = (emailId: string) => {
    setEmailHistory(emailHistory.map(email => 
      email.id === emailId 
        ? { ...email, folder: 'trash', isDeleted: true }
        : email
    ))
  }

  const handleArchiveEmail = (emailId: string) => {
    setEmailHistory(emailHistory.map(email => 
      email.id === emailId 
        ? { ...email, folder: 'archive', isArchived: true }
        : email
    ))
  }

  const handleStarEmail = (emailId: string) => {
    setEmailHistory(emailHistory.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: !email.isStarred }
        : email
    ))
  }

  const handleMarkAsRead = (emailId: string, isRead: boolean) => {
    setEmailHistory(emailHistory.map(email => 
      email.id === emailId 
        ? { ...email, isRead }
        : email
    ))
  }

  const handleReply = (email: EmailHistoryEntry) => {
    setReplyingTo(email)
    setIsComposing(true)
    const replySubject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`
    setEmailData({
      template: 'overdueReturn' as EmailTemplate, // Default
      recipient: email.from,
      cc: '',
      subject: replySubject,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\nDate: ${formatTime(email.timestamp)}\n\n${email.body}`,
      variables: {},
    })
    setSelectedTemplate(null)
  }

  const handleForward = (email: EmailHistoryEntry) => {
    setForwardingEmail(email)
    setIsComposing(true)
    const forwardSubject = email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`
    setEmailData({
      template: 'overdueReturn' as EmailTemplate, // Default
      recipient: '',
      cc: '',
      subject: forwardSubject,
      body: `\n\n--- Forwarded Message ---\nFrom: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\nDate: ${formatTime(email.timestamp)}\n\n${email.body}`,
      variables: {},
    })
    setSelectedTemplate(null)
  }

  const handleBulkAction = (action: 'delete' | 'archive' | 'markRead' | 'markUnread' | 'star' | 'unstar') => {
    if (selectedEmails.size === 0) return
    
    setEmailHistory(emailHistory.map(email => {
      if (!selectedEmails.has(email.id)) return email
      
      switch (action) {
        case 'delete':
          return { ...email, folder: 'trash', isDeleted: true }
        case 'archive':
          return { ...email, folder: 'archive', isArchived: true }
        case 'markRead':
          return { ...email, isRead: true }
        case 'markUnread':
          return { ...email, isRead: false }
        case 'star':
          return { ...email, isStarred: true }
        case 'unstar':
          return { ...email, isStarred: false }
        default:
          return email
      }
    }))
    setSelectedEmails(new Set())
  }

  // Filter and search email history
  const filteredEmails = useMemo(() => {
    return emailHistory.filter((email) => {
      let matchesFilter = false
      
      if (emailFilter === 'all') {
        matchesFilter = !email.isDeleted && email.folder !== 'trash'
      } else if (emailFilter === 'inbox') {
        matchesFilter = (email.folder === 'inbox' || (email.direction === 'received' && !email.folder && !email.isDeleted)) && !email.isArchived && !email.isDeleted
      } else if (emailFilter === 'sent') {
        matchesFilter = email.folder === 'sent' || (email.direction === 'sent' && email.folder !== 'history' && !email.isDeleted)
      } else if (emailFilter === 'drafts') {
        matchesFilter = email.folder === 'drafts'
      } else if (emailFilter === 'archive') {
        matchesFilter = email.folder === 'archive' || email.isArchived === true
      } else if (emailFilter === 'spam') {
        matchesFilter = email.folder === 'spam'
      } else if (emailFilter === 'trash') {
        matchesFilter = email.folder === 'trash' || email.isDeleted === true
      } else if (emailFilter === 'starred') {
        matchesFilter = email.isStarred === true && !email.isDeleted
      } else if (emailFilter === 'history') {
        matchesFilter = email.folder === 'history' || !!(email.timestamp && new Date(email.timestamp).getTime() < Date.now() - 7 * 86400000)
      }
      
      // Default folder assignment for emails without folder
      if (!email.folder && !email.isDeleted) {
        if (email.direction === 'sent') {
          const emailDate = new Date(email.timestamp)
          const daysOld = (Date.now() - emailDate.getTime()) / (1000 * 60 * 60 * 24)
          if (daysOld > 7) {
            matchesFilter = emailFilter === 'history' || emailFilter === 'all'
          } else {
            matchesFilter = emailFilter === 'sent' || emailFilter === 'all'
          }
        } else {
          matchesFilter = emailFilter === 'inbox' || emailFilter === 'all'
        }
      }
      
      const matchesSearch =
        emailSearch === '' ||
        email.from.toLowerCase().includes(emailSearch.toLowerCase()) ||
        email.to.toLowerCase().includes(emailSearch.toLowerCase()) ||
        email.subject.toLowerCase().includes(emailSearch.toLowerCase()) ||
        email.body.toLowerCase().includes(emailSearch.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [emailFilter, emailSearch, emailHistory])

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      const matchesType = selectedContactType === 'all' || contact.type === selectedContactType
      const matchesSearch =
        contactSearch === '' ||
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.phone.includes(contactSearch) ||
        (contact.company && contact.company.toLowerCase().includes(contactSearch.toLowerCase()))
      return matchesType && matchesSearch
    })
  }, [selectedContactType, contactSearch])

  // Generate transcript from call (simulated AI transcription)
  const generateTranscript = (contact: Contact | undefined, duration: number): CallTranscript => {
    // Simulate AI transcription with entity extraction
    const mockTranscripts = [
      {
        fullText: `Agent: Hello, this is Sarah from BYD Fleet Management. How can I help you today?\n\nCustomer: Hi, I'm calling about my vehicle registration AB12 CDE. I need to discuss contract C-001.\n\nAgent: Of course, I can help with that. What would you like to know?\n\nCustomer: The vehicle is having some issues and I wanted to report it. Can you create a case for this?\n\nAgent: Absolutely. I'll create case CASE-001 for you. Can you describe the issue?\n\nCustomer: The charging port seems to be malfunctioning. It's not charging properly.\n\nAgent: I understand. I've noted that down. We'll arrange for a service appointment. Is there anything else?\n\nCustomer: No, that's all. Thank you.\n\nAgent: You're welcome. We'll be in touch soon.`,
        segments: [
          { speaker: 'agent' as const, text: 'Hello, this is Sarah from BYD Fleet Management. How can I help you today?', timestamp: 0 },
          { speaker: 'customer' as const, text: "Hi, I'm calling about my vehicle registration AB12 CDE. I need to discuss contract C-001.", timestamp: 5 },
          { speaker: 'agent' as const, text: 'Of course, I can help with that. What would you like to know?', timestamp: 12 },
          { speaker: 'customer' as const, text: 'The vehicle is having some issues and I wanted to report it. Can you create a case for this?', timestamp: 18 },
          { speaker: 'agent' as const, text: "Absolutely. I'll create case CASE-001 for you. Can you describe the issue?", timestamp: 25 },
          { speaker: 'customer' as const, text: 'The charging port seems to be malfunctioning. It\'s not charging properly.', timestamp: 32 },
          { speaker: 'agent' as const, text: "I understand. I've noted that down. We'll arrange for a service appointment. Is there anything else?", timestamp: 40 },
          { speaker: 'customer' as const, text: "No, that's all. Thank you.", timestamp: 48 },
          { speaker: 'agent' as const, text: "You're welcome. We'll be in touch soon.", timestamp: 52 },
        ],
        extractedEntities: {
          vehicleRegistrations: ['AB12 CDE'],
          contractIds: ['C-001'],
          caseIds: ['CASE-001'],
          keyPoints: ['Charging port malfunctioning', 'Service appointment needed', 'Vehicle not charging properly'],
        },
      },
      {
        fullText: `Agent: Good morning, BYD Fleet Management, how may I assist you?\n\nCustomer: Hi, I need to extend my rental for vehicle FG34 HIJ under contract C-002.\n\nAgent: I can help with that extension. Let me check the details for contract C-002.\n\nCustomer: Great, I need it for another month.\n\nAgent: Perfect, I've processed the extension. Is there anything else I can help with?\n\nCustomer: No, that's perfect. Thanks!\n\nAgent: You're welcome. Have a great day!`,
        segments: [
          { speaker: 'agent' as const, text: 'Good morning, BYD Fleet Management, how may I assist you?', timestamp: 0 },
          { speaker: 'customer' as const, text: 'Hi, I need to extend my rental for vehicle FG34 HIJ under contract C-002.', timestamp: 4 },
          { speaker: 'agent' as const, text: "I can help with that extension. Let me check the details for contract C-002.", timestamp: 10 },
          { speaker: 'customer' as const, text: 'Great, I need it for another month.', timestamp: 16 },
          { speaker: 'agent' as const, text: "Perfect, I've processed the extension. Is there anything else I can help with?", timestamp: 20 },
          { speaker: 'customer' as const, text: "No, that's perfect. Thanks!", timestamp: 26 },
          { speaker: 'agent' as const, text: "You're welcome. Have a great day!", timestamp: 28 },
        ],
        extractedEntities: {
          vehicleRegistrations: ['FG34 HIJ'],
          contractIds: ['C-002'],
          caseIds: [],
          keyPoints: ['Rental extension requested', 'One month extension', 'Contract renewal'],
        },
      },
    ]

    // Select transcript based on contact or random
    const transcript = mockTranscripts[contact?.id === 'cust-1' ? 0 : 1]
    
    // Extract entities using regex patterns
    const vehicleRegPattern = /\b[A-Z]{2}\d{2}\s?[A-Z]{3}\b/g
    const contractPattern = /\bC-\d{3}\b/g
    const casePattern = /\bCASE-\d{3}\b/g

    const vehicleRegs = Array.from(transcript.fullText.matchAll(vehicleRegPattern)).map(m => m[0].replace(/\s/g, ' '))
    const contracts = Array.from(transcript.fullText.matchAll(contractPattern)).map(m => m[0])
    const cases = Array.from(transcript.fullText.matchAll(casePattern)).map(m => m[0])

    return {
      ...transcript,
      extractedEntities: {
        vehicleRegistrations: [...new Set(vehicleRegs)],
        contractIds: [...new Set(contracts)],
        caseIds: [...new Set(cases)],
        keyPoints: transcript.extractedEntities.keyPoints,
      },
    }
  }

  // Handle ending a call
  const handleEndCall = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current)
      callTimeoutRef.current = null
    }
    setIsCalling(false)
    setIsRecording(false)
    setActiveCallId(null)
    setRecordingDuration(0)
  }

  // Handle making a call
  const handleMakeCall = (contact?: Contact, phoneNumber?: string) => {
    const number = phoneNumber || contact?.phone || dialNumber
    if (!number) return

    // Clean up any existing intervals
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current)
    }

    setIsCalling(true)
    setIsRecording(true)
    setRecordingDuration(0)
    const callId = `call-${Date.now()}`
    setActiveCallId(callId)
    
    // Start recording timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)
    
    // Simulate call with recording
    const duration = Math.floor(Math.random() * 300) + 30 // 30-330 seconds
    callTimeoutRef.current = setTimeout(() => {
      setIsCalling(false)
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
      
      // Generate transcript
      const transcript = generateTranscript(contact, duration)
      setCurrentCallTranscript(transcript)
      
      // Auto-populate fields from transcript
      if (transcript.extractedEntities.vehicleRegistrations.length > 0) {
        setCallVehicleReg(transcript.extractedEntities.vehicleRegistrations[0])
      }
      if (transcript.extractedEntities.contractIds.length > 0) {
        setCallContractId(transcript.extractedEntities.contractIds[0])
      }
      if (transcript.extractedEntities.caseIds.length > 0) {
        setCallCaseId(transcript.extractedEntities.caseIds[0])
      }
      
      // Generate summary notes from transcript
      const summaryNotes = `Call Summary:\n${transcript.extractedEntities.keyPoints.join('\n')}\n\nFull conversation recorded.`
      setCallNote(summaryNotes)
      
      const currentAgentName = mockCoworkers.find(c => c.id === currentUserId)?.name || 'Unknown Agent'
      const newCall: CallHistoryEntry = {
        id: callId,
        contactId: contact?.id || 'unknown',
        contactName: contact?.name || 'Unknown',
        phone: number,
        type: 'outgoing',
        duration,
        timestamp: new Date().toISOString(),
        notes: summaryNotes,
        vehicleRegistration: transcript.extractedEntities.vehicleRegistrations[0] || callVehicleReg || undefined,
        contractId: transcript.extractedEntities.contractIds[0] || callContractId || undefined,
        caseId: transcript.extractedEntities.caseIds[0] || callCaseId || undefined,
        relatedContactId: contact?.id,
        transcript: transcript.fullText,
        recordingUrl: `recording-${callId}.mp3`, // Simulated recording URL
        agentName: currentAgentName,
      }
      setCallHistory([newCall, ...callHistory])
      setActiveCallId(null)
      setRecordingDuration(0)
      callTimeoutRef.current = null
    }, Math.min(duration * 100, 5000)) // Simulate call duration (max 5 seconds for demo)
  }

  // Handle dial pad input
  const handleDialPadInput = (value: string) => {
    setDialNumber(prev => prev + value)
  }

  // Handle saving call note
  const handleSaveCallNote = (callId: string) => {
    setCallHistory(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, notes: callNote, vehicleRegistration: callVehicleReg || call.vehicleRegistration, contractId: callContractId || call.contractId, caseId: callCaseId || call.caseId }
        : call
    ))
    setEditingCallNote(null)
    setCallNote('')
    setCallVehicleReg('')
    setCallContractId('')
    setCallCaseId('')
  }

  // Get customer communication history
  const getCustomerHistory = (customerId: string) => {
    const customer = mockContacts.find(c => c.id === customerId)
    if (!customer) return { calls: [], emails: [], agreements: [], vehicles: [] }

    const calls = callHistory.filter(c => c.contactId === customerId || c.relatedContactId === customerId)
    const emails = emailHistory.filter(e => 
      e.to.toLowerCase().includes(customer.name.toLowerCase()) || 
      e.from.toLowerCase().includes(customer.name.toLowerCase())
    )
    const agreements = agreementsFull.filter(a => a.customer === customer.name)
    const vehicleIds = agreements.map(a => a.vehicleId)
    const customerVehicles = vehicles.filter(v => vehicleIds.includes(v.id))

    return { calls, emails, agreements, vehicles: customerVehicles, customer }
  }

  // Filter call history
  const filteredCallHistory = useMemo(() => {
    return callHistory.filter((call) => {
      const matchesFilter = callFilter === 'all' || call.type === callFilter
      const matchesSearch =
        callSearch === '' ||
        call.contactName.toLowerCase().includes(callSearch.toLowerCase()) ||
        call.phone.includes(callSearch) ||
        (call.notes && call.notes.toLowerCase().includes(callSearch.toLowerCase())) ||
        (call.vehicleRegistration && call.vehicleRegistration.toLowerCase().includes(callSearch.toLowerCase())) ||
        (call.contractId && call.contractId.toLowerCase().includes(callSearch.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }, [callHistory, callFilter, callSearch])

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'read':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-blue-100 text-blue-800'
      case 'sent':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
        <p className="mt-2 text-gray-600">
          Send emails to customers and partners, and view communication history
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('email')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chat'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team Chat
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calls'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Calls
          </button>
        </nav>
      </div>

      {activeTab === 'email' ? (
        <div className="space-y-6">
          {/* Compose Email Section */}
          {isComposing && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
                <button
                  onClick={() => {
                    setIsComposing(false)
                    setEmailData(null)
                    setSelectedTemplate(null)
                    setPreview('')
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Template Selection Sidebar */}
                <div className="lg:col-span-1">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Email Templates</h4>
                    <button
                      onClick={() => handleTemplateSelect('blank')}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                        selectedTemplate === null && emailData
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                      }`}
                    >
                      ✉️ New Email
                    </button>
                    <div className="space-y-2">
                      {Object.entries(templates).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => handleTemplateSelect(key as EmailTemplate)}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                            selectedTemplate === key
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Editor */}
                <div className="lg:col-span-3">
                  {emailData ? (
                    <div className="space-y-4">
                      {/* Recipient */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          value={emailData.recipient}
                          onChange={(e) =>
                            setEmailData({ ...emailData, recipient: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter recipient email address"
                        />
                      </div>

                      {/* CC */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CC (Optional)
                        </label>
                        <input
                          type="email"
                          value={emailData.cc}
                          onChange={(e) =>
                            setEmailData({ ...emailData, cc: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter CC email addresses (comma separated)"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={emailData.subject}
                          onChange={(e) =>
                            setEmailData({ ...emailData, subject: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter email subject"
                        />
                      </div>

                      {/* Template Variables */}
                      {selectedTemplate && Object.keys(emailData.variables).length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Template Variables</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(emailData.variables).map(([key, value]) => (
                              <div key={key}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleVariableChange(key, e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder={`Enter ${key}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Email Body */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        {selectedTemplate ? (
                          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[300px] whitespace-pre-wrap text-sm text-gray-700">
                            {preview || emailData.body}
                          </div>
                        ) : (
                          <textarea
                            value={emailData.body}
                            onChange={(e) => handleBodyChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[300px]"
                            placeholder="Enter your message"
                          />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleSend}
                          className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                          Send
                        </button>
                        <button
                          onClick={handleCopy}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Copy Email
                        </button>
                        <button
                          onClick={() => {
                            setIsComposing(false)
                            setEmailData(null)
                            setSelectedTemplate(null)
                            setPreview('')
                          }}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-6xl text-gray-300 mb-4">📧</div>
                      <p className="text-gray-500">Select a template or start a new email</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Email Mailbox */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Email</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsComposing(true)
                    handleTemplateSelect('blank')
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  ✉️ Compose
                </button>
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>
            </div>

          {/* Mailbox Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-4 flex-wrap">
              <button
                onClick={() => setEmailFilter('inbox')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'inbox'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📥 Inbox
                {emailHistory.filter(e => (e.folder === 'inbox' || (e.direction === 'received' && !e.folder && !e.isDeleted)) && e.isRead === false && !e.isArchived).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                    {emailHistory.filter(e => (e.folder === 'inbox' || (e.direction === 'received' && !e.folder && !e.isDeleted)) && e.isRead === false && !e.isArchived).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setEmailFilter('starred')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'starred'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⭐ Starred
              </button>
              <button
                onClick={() => setEmailFilter('sent')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'sent'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📧 Sent
              </button>
              <button
                onClick={() => setEmailFilter('drafts')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'drafts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Drafts
                {emailHistory.filter(e => e.folder === 'drafts').length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-600 text-white text-xs rounded-full">
                    {emailHistory.filter(e => e.folder === 'drafts').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setEmailFilter('archive')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'archive'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Archive
              </button>
              <button
                onClick={() => setEmailFilter('spam')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'spam'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🗑️ Spam
                {emailHistory.filter(e => e.folder === 'spam').length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                    {emailHistory.filter(e => e.folder === 'spam').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setEmailFilter('trash')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'trash'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🗑️ Trash
              </button>
              <button
                onClick={() => setEmailFilter('all')}
                className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                  emailFilter === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All
              </button>
            </nav>
          </div>

          {/* Bulk Actions */}
          {selectedEmails.size > 0 && (
            <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-primary-700">
                {selectedEmails.size} selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkAction('markRead')}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleBulkAction('markUnread')}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300"
                >
                  Mark as Unread
                </button>
                <button
                  onClick={() => handleBulkAction('star')}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300"
                >
                  Star
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 text-sm bg-white text-red-700 rounded-lg hover:bg-red-50 border border-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedEmails(new Set())}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Email List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No emails found</p>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    email.folder === 'spam' ? 'bg-red-50 border-red-200' : 
                    email.isRead === false ? 'bg-blue-50 border-blue-200' : 
                    'border-gray-200'
                  } ${selectedEmails.has(email.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
                  onClick={() => {
                    if (viewingEmail?.id === email.id) {
                      setViewingEmail(null)
                    } else {
                      setViewingEmail(email)
                      handleMarkAsRead(email.id, true)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(email.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        const newSelected = new Set(selectedEmails)
                        if (e.target.checked) {
                          newSelected.add(email.id)
                        } else {
                          newSelected.delete(email.id)
                        }
                        setSelectedEmails(newSelected)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 flex-shrink-0"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStarEmail(email.id)
                      }}
                      className="flex-shrink-0 text-xl hover:scale-110 transition-transform"
                    >
                      {email.isStarred ? '⭐' : '☆'}
                    </button>
                    <div className="text-2xl flex-shrink-0">
                      {email.direction === 'sent' ? '📧' : email.folder === 'spam' ? '🚫' : '📥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {email.isRead === false && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          {email.priority === 'high' && (
                            <span className="text-red-500 text-xs font-semibold">!</span>
                          )}
                          <span className={`font-semibold ${email.isRead === false ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                            {email.direction === 'sent' ? email.from : email.from}
                          </span>
                          <span className="text-sm text-gray-600">
                            {email.direction === 'sent' ? 'to' : 'from'}
                          </span>
                          <span className="font-medium text-gray-900">{email.to}</span>
                          {email.hasAttachments && (
                            <span className="text-xs text-gray-500">📎</span>
                          )}
                          {email.direction === 'sent' && email.agentName && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              by {email.agentName}
                            </span>
                          )}
                          {email.folder === 'spam' && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded font-semibold">
                              SPAM
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {email.status && (
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                                email.status
                              )}`}
                            >
                              {email.status}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{formatTime(email.timestamp)}</span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className={`font-medium ${email.isRead === false ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                          {email.subject}
                        </span>
                      </div>
                      <p className={`text-sm line-clamp-2 ${email.isRead === false ? 'text-gray-700' : 'text-gray-600'}`}>
                        {email.body}
                      </p>
                      <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        {email.direction === 'received' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReply(email)
                            }}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            Reply
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleForward(email)
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Forward
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleArchiveEmail(email.id)
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Archive
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEmail(email.id)
                          }}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      ) : activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Coworkers List */}
          <div className="lg:col-span-1">
            <div className="card h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {mockCoworkers.map((coworker) => (
                  <div
                    key={coworker.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                        {coworker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {coworker.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{coworker.name}</div>
                      <div className="text-xs text-gray-500 truncate">{coworker.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <div className="card h-full flex flex-col">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold">Team Chat</h3>
                <p className="text-sm text-gray-500">Communicate with your team in real-time</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">{message.senderName}</span>
                            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!newMessage.trim()) return

                    const newMsg: ChatMessage = {
                      id: `msg-${Date.now()}`,
                      senderId: currentUserId,
                      senderName: mockCoworkers.find(c => c.id === currentUserId)?.name || 'You',
                      message: newMessage,
                      timestamp: new Date().toISOString(),
                    }
                    setChatMessages([...chatMessages, newMsg])
                    setNewMessage('')
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Contacts & Dialer */}
          <div className="lg:col-span-3 space-y-4">
            {/* Active Call Recording Indicator */}
            {isRecording && (
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-red-900">Recording Call</div>
                      <div className="text-xs text-red-700">
                        Duration: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleEndCall}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    End Call
                  </button>
                </div>
              </div>
            )}

            {/* Call Transcript & Auto-Populated Notes */}
            {currentCallTranscript && !isRecording && (
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-900">Call Transcript Generated</h3>
                  <button
                    onClick={() => setCurrentCallTranscript(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Extracted Entities */}
                <div className="mb-3 p-2 bg-white rounded border border-blue-200">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Auto-Detected Information:</div>
                  <div className="space-y-1.5">
                    {currentCallTranscript.extractedEntities.vehicleRegistrations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">🚗 Vehicle:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {currentCallTranscript.extractedEntities.vehicleRegistrations.join(', ')}
                        </span>
                      </div>
                    )}
                    {currentCallTranscript.extractedEntities.contractIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">📄 Contract:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {currentCallTranscript.extractedEntities.contractIds.join(', ')}
                        </span>
                      </div>
                    )}
                    {currentCallTranscript.extractedEntities.caseIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">📋 Case:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {currentCallTranscript.extractedEntities.caseIds.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Points */}
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Key Points:</div>
                  <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
                    {currentCallTranscript.extractedEntities.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* View Full Transcript Button */}
                <button
                  onClick={() => {
                    // Show full transcript in a modal or expand
                    const transcriptWindow = window.open('', '_blank', 'width=800,height=600')
                    if (transcriptWindow) {
                      transcriptWindow.document.write(`
                        <html>
                          <head><title>Call Transcript</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                            .agent { color: #2563eb; font-weight: bold; margin-top: 10px; }
                            .customer { color: #059669; font-weight: bold; margin-top: 10px; }
                            pre { white-space: pre-wrap; }
                          </style>
                          </head>
                          <body>
                            <h1>Call Transcript</h1>
                            <pre>${currentCallTranscript.fullText}</pre>
                          </body>
                        </html>
                      `)
                    }
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  View Full Transcript
                </button>
              </div>
            )}

            {/* Quick Dial Pad */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Dial</h3>
              <div className="space-y-3">
                <input
                  type="tel"
                  value={dialNumber}
                  readOnly
                  placeholder="Enter number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center text-base font-mono"
                />
                <div className="grid grid-cols-3 gap-1.5">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleDialPadInput(digit)}
                      className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-base font-semibold transition-colors"
                    >
                      {digit}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDialNumber('')}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setDialNumber(prev => prev.slice(0, -1))}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    ⌫
                  </button>
                </div>
                <button
                  onClick={() => handleMakeCall(undefined, dialNumber)}
                  disabled={!dialNumber || isCalling}
                  className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCalling ? (
                    <>
                      <span className="animate-pulse">📞</span>
                      <span>Calling...</span>
                    </>
                  ) : (
                    <>
                      <span>📞</span>
                      <span>Call</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contacts</h3>
              </div>
              
              {/* Contact Type Filter */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {(['all', 'customer', 'coworker', 'partner', 'supplier'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedContactType(type)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedContactType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'coworker' ? 'Team' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
              />

              {/* Contacts */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary-50 border-primary-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedContact(contact)
                      if (contact.type === 'customer') {
                        setSelectedCustomerId(contact.id)
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${
                        contact.type === 'customer' ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {contact.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{contact.phone}</div>
                      {(contact.company || contact.role) && (
                        <div className="text-xs text-gray-400 truncate">{contact.company || contact.role}</div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMakeCall(contact)
                      }}
                      disabled={isCalling}
                      className="ml-2 px-2.5 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Call"
                    >
                      📞
                    </button>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No contacts found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle - Contact Details & Activity Timeline */}
          <div className="lg:col-span-5 space-y-4">
            {selectedContact ? (
              <>
                {/* Contact Details Card */}
                <div className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedContact.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedContact.phone}</p>
                      {selectedContact.company && (
                        <p className="text-sm text-gray-500">{selectedContact.company}</p>
                      )}
                      {selectedContact.role && (
                        <p className="text-xs text-gray-500 mt-1">{selectedContact.role}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleMakeCall(selectedContact)}
                      disabled={isCalling}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span>📞</span>
                      <span>Call Now</span>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        setSelectedCustomerId(selectedContact.id)
                      }}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View History
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('templates')
                        setSelectedTemplate(null)
                        setEmailData({
                          template: 'overdueReturn' as EmailTemplate,
                          recipient: selectedContact.type === 'customer' ? selectedContact.name : selectedContact.phone,
                          cc: '',
                          subject: '',
                          body: '',
                          variables: {},
                        })
                      }}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Send Email
                    </button>
                  </div>

                  {/* Fleet Information (for customers) */}
                  {selectedContact.type === 'customer' && (() => {
                    const history = getCustomerHistory(selectedContact.id)
                    return (
                      <>
                        {history.agreements.length > 0 && (
                          <div className="mb-4 pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Active Contracts</h3>
                            <div className="space-y-2">
                              {history.agreements.slice(0, 3).map((agreement) => (
                                <div key={agreement.agreementId} className="p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-900">{agreement.agreementId}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                      agreement.status === 'Active' ? 'bg-green-100 text-green-800' :
                                      agreement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {agreement.status}
                                    </span>
                                  </div>
                                  {agreement.vehicleId && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      Vehicle: {history.vehicles.find(v => v.id === agreement.vehicleId)?.registration || agreement.vehicleId}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {history.vehicles.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Vehicles</h3>
                            <div className="space-y-2">
                              {history.vehicles.slice(0, 3).map((vehicle) => (
                                <div key={vehicle.id} className="p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-900">{vehicle.registration}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                      vehicle.availability_status === 'Available' ? 'bg-green-100 text-green-800' :
                                      vehicle.availability_status === 'On Rent' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {vehicle.availability_status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">{vehicle.model}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>

                {/* Activity Timeline */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {(() => {
                      const history = selectedContact.type === 'customer' ? getCustomerHistory(selectedContact.id) : { calls: [], emails: [] }
                      const activities = [
                        ...history.calls.map(call => ({ ...call, type: 'call' as const, date: call.timestamp })),
                        ...history.emails.map(email => ({ ...email, type: 'email' as const, date: email.timestamp }))
                      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

                      if (activities.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No recent activity
                          </div>
                        )
                      }

                      return activities.map((activity, idx) => {
                        const callType = activity.type === 'call' ? (activity as any as CallHistoryEntry).type : null
                        return (
                          <div key={`${activity.type}-${idx}`} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                            <div className={`text-lg ${
                              activity.type === 'call' 
                                ? callType === 'outgoing' ? 'text-green-600' : callType === 'incoming' ? 'text-blue-600' : 'text-red-600'
                                : 'text-gray-600'
                            }`}>
                              {activity.type === 'call' 
                                ? (callType === 'outgoing' ? '📤' : callType === 'incoming' ? '📥' : '📵')
                                : (activity as any).direction === 'sent' ? '📧' : '📥'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-gray-900">
                                  {activity.type === 'call' 
                                    ? `Call with ${(activity as any as CallHistoryEntry).contactName || selectedContact.name}`
                                    : (activity as any).subject}
                                </div>
                                {activity.type === 'call' && (activity as any as CallHistoryEntry).agentName && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    by {(activity as any as CallHistoryEntry).agentName}
                                  </span>
                                )}
                                {activity.type === 'email' && (activity as any).agentName && (activity as any).direction === 'sent' && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    by {(activity as any).agentName}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{formatTime(activity.date)}</div>
                              {activity.type === 'call' && (activity as any as CallHistoryEntry).notes && (
                                <div className="text-xs text-gray-600 mt-1">{(activity as any as CallHistoryEntry).notes}</div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">👤</div>
                  <p className="text-lg font-medium">Select a contact to view details</p>
                  <p className="text-sm mt-2">Click on any contact from the list to see their information and activity</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Call History with Filters */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Call History</h3>
                <span className="text-xs text-gray-500">{filteredCallHistory.length} calls</span>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {(['all', 'outgoing', 'incoming', 'missed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setCallFilter(filter)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      callFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="text"
                value={callSearch}
                onChange={(e) => setCallSearch(e.target.value)}
                placeholder="Search calls..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
              />

              {/* Call History List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredCallHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p>No calls found</p>
                  </div>
                ) : (
                  filteredCallHistory.map((call) => (
                    <div
                      key={call.id}
                      className={`p-3 border rounded-lg transition-colors ${
                        selectedContact?.id === call.contactId
                          ? 'bg-primary-50 border-primary-300'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const contact = mockContacts.find(c => c.id === call.contactId)
                        if (contact) setSelectedContact(contact)
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`text-lg ${
                          call.type === 'outgoing' ? 'text-green-600' :
                          call.type === 'incoming' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {call.type === 'outgoing' ? '📤' :
                           call.type === 'incoming' ? '📥' :
                           '📵'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm text-gray-900 truncate">{call.contactName}</div>
                            <div className="text-xs text-gray-400 ml-2">{formatTime(call.timestamp)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-600">{call.phone}</div>
                            {call.agentName && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                by {call.agentName}
                              </span>
                            )}
                          </div>
                          {call.duration && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                            </div>
                          )}
                          {(call.vehicleRegistration || call.contractId || call.caseId) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {call.vehicleRegistration && (
                                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                  🚗 {call.vehicleRegistration}
                                </span>
                              )}
                              {call.contractId && (
                                <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                                  📄 {call.contractId}
                                </span>
                              )}
                              {call.caseId && (
                                <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">
                                  📋 {call.caseId}
                                </span>
                              )}
                            </div>
                          )}
                          {call.notes && (
                            <div className="text-xs text-gray-700 bg-gray-50 p-1.5 rounded mt-2 line-clamp-2">
                              {call.notes}
                            </div>
                          )}
                          {(call.transcript || call.recordingUrl) && (
                            <div className="flex gap-1 mt-2">
                              {call.transcript && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const transcriptWindow = window.open('', '_blank', 'width=800,height=600')
                                    if (transcriptWindow) {
                                      transcriptWindow.document.write(`
                                        <html>
                                          <head><title>Call Transcript - ${call.contactName}</title>
                                          <style>
                                            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                                            pre { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px; }
                                          </style>
                                          </head>
                                          <body>
                                            <h1>Call Transcript</h1>
                                            <p><strong>Contact:</strong> ${call.contactName}</p>
                                            <p><strong>Date:</strong> ${formatTime(call.timestamp)}</p>
                                            <p><strong>Duration:</strong> ${call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</p>
                                            <hr>
                                            <pre>${call.transcript}</pre>
                                          </body>
                                        </html>
                                      `)
                                    }
                                  }}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                  title="View Transcript"
                                >
                                  📝 Transcript
                                </button>
                              )}
                              {call.recordingUrl && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    alert(`Recording available at: ${call.recordingUrl}\n\nIn a real implementation, this would play the audio recording.`)
                                  }}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                  title="Play Recording"
                                >
                                  🎙️ Recording
                                </button>
                              )}
                            </div>
                          )}
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingCallNote(call.id)
                                setCallNote(call.notes || '')
                                setCallVehicleReg(call.vehicleRegistration || '')
                                setCallContractId(call.contractId || '')
                                setCallCaseId(call.caseId || '')
                              }}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              {call.notes ? 'Edit' : 'Add Note'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMakeCall(undefined, call.phone)
                              }}
                              disabled={isCalling}
                              className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Call
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Call Notes Form (when editing) */}
            {editingCallNote && (() => {
              const call = callHistory.find(c => c.id === editingCallNote)
              return call ? (
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Edit Call Note</h3>
                    {call.transcript && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        📝 Auto-generated from transcript
                      </span>
                    )}
                  </div>
                  {call.transcript && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      <strong>Tip:</strong> This note was auto-generated from the call transcript. You can edit it to add more details.
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={callNote || call.notes || ''}
                        onChange={(e) => setCallNote(e.target.value)}
                        placeholder="Add notes..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                      />
                      {call.transcript && (
                        <button
                          onClick={() => {
                            const summary = call.transcript?.split('\n\n').slice(0, 3).join('\n\n') || ''
                            setCallNote(summary)
                          }}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Use transcript summary
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Reg</label>
                        <input
                          type="text"
                          value={callVehicleReg || call.vehicleRegistration || ''}
                          onChange={(e) => setCallVehicleReg(e.target.value)}
                          placeholder="AB12 CDE"
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Contract ID</label>
                        <input
                          type="text"
                          value={callContractId || call.contractId || ''}
                          onChange={(e) => setCallContractId(e.target.value)}
                          placeholder="C-001"
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Case ID</label>
                      <input
                        type="text"
                        value={callCaseId || call.caseId || ''}
                        onChange={(e) => setCallCaseId(e.target.value)}
                        placeholder="CASE-001"
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveCallNote(call.id)}
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCallNote(null)
                          setCallNote('')
                          setCallVehicleReg('')
                          setCallContractId('')
                          setCallCaseId('')
                        }}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            })()}
          </div>

          {/* Customer Communication History Modal */}
          {selectedCustomerId && (() => {
            const history = getCustomerHistory(selectedCustomerId)
            return (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" onClick={() => setSelectedCustomerId(null)}>
                <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                  <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Communication History</h2>
                        <p className="text-sm text-gray-500 mt-1">{history.customer?.name}</p>
                      </div>
                      <button onClick={() => setSelectedCustomerId(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Calls */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Calls ({history.calls.length})</h3>
                        {history.calls.length === 0 ? (
                          <p className="text-sm text-gray-500">No calls</p>
                        ) : (
                          <div className="space-y-2">
                            {history.calls.map((call) => (
                              <div key={call.id} className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-lg ${
                                      call.type === 'outgoing' ? 'text-green-600' :
                                      call.type === 'incoming' ? 'text-blue-600' :
                                      'text-red-600'
                                    }`}>
                                      {call.type === 'outgoing' ? '📤' : call.type === 'incoming' ? '📥' : '📵'}
                                    </span>
                                    <span className="text-sm font-medium">{call.phone}</span>
                                    {call.duration && (
                                      <span className="text-xs text-gray-500">
                                        ({Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400">{formatTime(call.timestamp)}</span>
                                </div>
                                {call.notes && (
                                  <div className="text-xs text-gray-600 mt-1">{call.notes}</div>
                                )}
                                {(call.vehicleRegistration || call.contractId || call.caseId) && (
                                  <div className="flex gap-2 mt-2">
                                    {call.vehicleRegistration && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">🚗 {call.vehicleRegistration}</span>}
                                    {call.contractId && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">📄 {call.contractId}</span>}
                                    {call.caseId && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">📋 {call.caseId}</span>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Emails */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Emails ({history.emails.length})</h3>
                        {history.emails.length === 0 ? (
                          <p className="text-sm text-gray-500">No emails</p>
                        ) : (
                          <div className="space-y-2">
                            {history.emails.map((email) => (
                              <div key={email.id} className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{email.direction === 'sent' ? '📧' : '📥'}</span>
                                    <span className="text-sm font-medium">{email.subject}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">{formatTime(email.timestamp)}</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{email.body}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                      <button onClick={() => setSelectedCustomerId(null)} className="btn-primary">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Email Detail View Modal */}
      {viewingEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{viewingEmail.subject}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>From:</strong> {viewingEmail.from}</div>
                  <div><strong>To:</strong> {viewingEmail.to}</div>
                  <div><strong>Date:</strong> {new Date(viewingEmail.timestamp).toLocaleString()}</div>
                  {viewingEmail.agentName && (
                    <div><strong>Sent by:</strong> {viewingEmail.agentName}</div>
                  )}
                  {viewingEmail.status && (
                    <div><strong>Status:</strong> <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(viewingEmail.status)}`}>{viewingEmail.status}</span></div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {viewingEmail.direction === 'received' && (
                  <button
                    onClick={() => handleReply(viewingEmail)}
                    className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Reply
                  </button>
                )}
                <button
                  onClick={() => handleForward(viewingEmail)}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Forward
                </button>
                <button
                  onClick={() => setViewingEmail(null)}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
                {viewingEmail.body}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

