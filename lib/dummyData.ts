/**
 * Dummy data module for BYD Fleet Risk Dashboard
 * Comprehensive data structure with vehicles, agreements, partners, and utilisation
 */

// ==================== TYPES ====================

export interface Vehicle {
  id: string
  vin: string
  model: string
  registration: string
  location: string
  location_coords: { lat: number; lng: number }
  rental_partner: string
  part_status: 'OK' | 'Minor' | 'Critical'
  days_overdue: number
  contract_expiry: string
  risk_score: number
  risk_level: 'Low' | 'Medium' | 'High'
  availability_status: 'Available' | 'With Partner' | 'In Workshop' | 'Delivering' | 'Awaiting Documents' | 'On Hire' | 'Awaiting Allocation' | 'Awaiting Valet'
  next_available_date: string
  stage_timestamps: {
    returnedAt: string | null
    inspectedAt: string | null
    valetedAt: string | null
    workshopInAt: string | null
    partsRequestedAt: string | null
  }
  last_returned_at: string
  turnaround_seconds: number
  // Current progress details
  currentProgress?: string // e.g., "For diagnosis", "Road test", "Awaiting inspection"
  lastUpdate?: string // Last update timestamp
  vorUpdate?: string // VOR (Vehicle Off Road) update timestamp
  // Parts information (for vehicles awaiting parts)
  partsInfo?: {
    depot: string // e.g., "London Depot", "Manchester Parts Center"
    partName: string // e.g., "Brake Pad Set", "Battery Module"
    partNumber?: string
    orderDate?: string
    eta?: string // Estimated time of arrival for parts
  }
  // Workshop ETA
  workshopEta?: string // Estimated completion time for workshop work
  health: {
    healthScore: number
    batteryHealth: number
    lastOta: string
    motExpiry: string
    faultCodes: string[]
  }
  // Recall information
  recall?: {
    id: string
    title: string
    description: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    issuedDate: string
    dueDate?: string
    status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
    affectedComponent?: string
    remedy?: string
  }
}

export interface AgreementFull {
  id: string
  agreementId: string
  vehicleId: string
  customer: string
  driverName?: string
  driverLicense?: string
  driverPhone?: string
  createdAt: string
  startAt: string
  endAt: string
  stage: 'Reservation Created' | 'Agreement Prepared' | 'Agreement Signed' | 'Vehicle Collected' | 'Vehicle Returned' | 'Damage Check Completed' | 'Charges Finalised' | 'Closed'
  timestamps: {
    reservationCreatedAt: string
    preparedAt: string | null
    signedAt: string | null
    collectedAt: string | null
    returnedAt: string | null
    damageCheckCompletedAt: string | null
    closedAt: string | null
  }
  status: 'On track' | 'Delayed' | 'Overdue'
  notes: string
  assignedTo: string
  // Mileage tracking
  mileageLimit?: number // Allowed mileage in contract
  currentMileage?: number // Current vehicle mileage
  mileageAtStart?: number // Mileage when vehicle was collected
  mileageAtReturn?: number // Mileage when vehicle was returned
  mileageOverage?: number // Excess mileage if over limit
  // Penalties and breaches
  penalties?: Penalty[]
  breaches?: Breach[]
}

export interface Penalty {
  id: string
  agreementId: string
  type: 'late_return' | 'mileage_overage' | 'damage' | 'early_termination' | 'other'
  amount: number
  currency: string
  description: string
  date: string
  status: 'pending' | 'paid' | 'waived' | 'disputed'
  recordedBy: string
  recordedAt: string
}

export interface Breach {
  id: string
  agreementId: string
  type: 'contract_breach' | 'mileage_breach' | 'damage_breach' | 'return_breach' | 'other'
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  description: string
  date: string
  resolved: boolean
  resolutionNotes?: string
  recordedBy: string
  recordedAt: string
}

export interface BuybackAgreement {
  id: string
  buybackId: string
  vehicleId: string
  vehicleRegistration: string
  rentalPartner: string
  originalAgreementId: string
  buybackDate: string
  buybackPrice: number
  currency: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  mileageAtBuyback: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  complianceStatus: 'compliant' | 'non_compliant' | 'under_review'
  timestamps: {
    agreementCreatedAt: string
    vehicleInspectedAt: string | null
    buybackCompletedAt: string | null
    paymentProcessedAt: string | null
  }
  notes: string
  documents: string[] // Document IDs or paths
  assignedTo: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  type: 'rental_supply' | 'rental_return' | 'penalty' | 'buyback' | 'other'
  agreementId?: string
  buybackId?: string
  customer: string
  amount: number
  currency: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  notes?: string
  createdBy: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  amount: number
  currency: string
  issueDate: string
  expectedDeliveryDate: string
  status: 'draft' | 'sent' | 'acknowledged' | 'in_transit' | 'delivered' | 'cancelled'
  items: POItem[]
  notes?: string
  createdBy: string
}

export interface POItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Supplier {
  id: string
  name: string
  companyName: string
  type: 'rental_partner' | 'parts_supplier' | 'service_provider' | 'other'
  contactPerson: string
  email: string
  phone: string
  address: string
  onboardingStatus: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  onboardingDate?: string
  complianceStatus: 'compliant' | 'non_compliant' | 'under_review'
  documents: SupplierDocument[]
  performance: {
    avgLeadTimeHours?: number
    slaPercent?: number
    totalOrders?: number
    onTimeDelivery?: number
  }
  notes: string
  assignedTo: string
}

export interface SupplierDocument {
  id: string
  name: string
  type: 'legal' | 'compliance' | 'insurance' | 'certification' | 'other'
  uploadDate: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'pending_renewal'
  fileUrl: string
}

export interface Partner {
  id: string
  avgLeadTimeHours: number
  slaPercent: number
  openJobs: number
}

export interface Utilisation {
  date: string
  utilisation: number
}

// Legacy types for backward compatibility
export interface VehicleWithRisk {
  vehicle_id: string
  vin: string
  registration: string
  rental_partner: string
  part_status: 'OK' | 'Minor' | 'Critical'
  days_overdue: number
  contract_expiry: string
  risk_score: number
  risk_level: 'Low' | 'Medium' | 'High'
}

// Export AgreementLegacy as Agreement for backward compatibility
export interface AgreementLegacy {
  contract_number: string
  vehicle_id: string
  vin: string
  registration: string
  rental_partner: string
  driverName?: string
  driverLicense?: string
  driverPhone?: string
  start_date: string
  end_date: string
  status: 'Pending' | 'Signed' | 'Overdue'
}

// Type alias for backward compatibility - components expect 'Agreement' to be the legacy type
export type Agreement = AgreementLegacy

// ==================== DATA ====================

export const vehicles: Vehicle[] = [
  {
    id: "BYD-V001",
    vin: "LNB00123456789012",
    model: "BYD Atto 3",
    registration: "AB12 CDE",
    location: "London Heathrow",
    location_coords: { lat: 51.4700, lng: -0.4543 },
    rental_partner: "Partner A",
    part_status: "OK",
    days_overdue: 0,
    contract_expiry: "2025-12-01",
    risk_score: 0,
    risk_level: "Low",
    availability_status: "Available",
    next_available_date: "2025-01-20",
    stage_timestamps: {
      returnedAt: "2025-01-18T09:12:00Z",
      inspectedAt: "2025-01-18T10:00:00Z",
      valetedAt: "2025-01-18T11:00:00Z",
      workshopInAt: null,
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-18T09:12:00Z",
    turnaround_seconds: 3600,
    health: {
      healthScore: 92,
      batteryHealth: 96,
      lastOta: "2025-02-05",
      motExpiry: "2026-03-01",
      faultCodes: []
    },
    recall: {
      id: "REC-2025-001",
      title: "Battery Management System Update",
      description: "Software update required for battery management system to address potential charging issues",
      severity: "High",
      issuedDate: "2025-01-10",
      dueDate: "2025-02-15",
      status: "Pending",
      affectedComponent: "Battery Management System",
      remedy: "OTA update or workshop visit required"
    }
  },
  {
    id: "BYD-V002",
    vin: "LNB00987654321098",
    model: "BYD Seal",
    registration: "FG34 HIJ",
    location: "Manchester Hub",
    location_coords: { lat: 53.4839, lng: -2.2446 },
    rental_partner: "Partner B",
    part_status: "Critical",
    days_overdue: 15,
    contract_expiry: "2025-05-15",
    risk_score: 4.5,
    risk_level: "Medium",
    availability_status: "With Partner",
    next_available_date: "2025-02-01",
    stage_timestamps: {
      returnedAt: "2025-01-10T08:00:00Z",
      inspectedAt: "2025-01-10T09:15:00Z",
      valetedAt: null,
      workshopInAt: "2025-01-10T10:00:00Z",
      partsRequestedAt: "2025-01-11T09:00:00Z"
    },
    last_returned_at: "2025-01-10T08:00:00Z",
    turnaround_seconds: 86400 * 5,
    currentProgress: "Awaiting parts delivery",
    lastUpdate: "2025-01-11T09:00:00Z",
    vorUpdate: "2025-01-10T10:00:00Z",
    partsInfo: {
      depot: "Manchester Parts Center",
      partName: "Battery Module",
      partNumber: "BYD-BAT-001",
      orderDate: "2025-01-11T09:00:00Z",
      eta: "2025-01-15T14:00:00Z"
    },
    health: {
      healthScore: 60,
      batteryHealth: 78,
      lastOta: "2025-02-07",
      motExpiry: "2025-08-01",
      faultCodes: ["P0A80"]
    },
    recall: {
      id: "REC-2025-002",
      title: "Brake System Inspection Required",
      description: "Critical safety recall: Brake system inspection and potential component replacement required",
      severity: "Critical",
      issuedDate: "2025-01-05",
      dueDate: "2025-01-25",
      status: "Overdue",
      affectedComponent: "Brake System",
      remedy: "Immediate workshop inspection and repair required"
    }
  },
  {
    id: "BYD-V003",
    vin: "LNB56473829100047",
    model: "BYD Dolphin",
    registration: "KL56 MNO",
    location: "Birmingham Hub",
    location_coords: { lat: 52.4862, lng: -1.8904 },
    rental_partner: "Partner A",
    part_status: "Minor",
    days_overdue: 3,
    contract_expiry: "2025-08-20",
    risk_score: 0.3,
    risk_level: "Low",
    availability_status: "In Workshop",
    next_available_date: "2025-01-25",
    stage_timestamps: {
      returnedAt: "2025-01-20T10:00:00Z",
      inspectedAt: "2025-01-20T11:00:00Z",
      valetedAt: null,
      workshopInAt: "2025-01-20T12:00:00Z",
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-20T10:00:00Z",
    turnaround_seconds: 86400 * 2,
    currentProgress: "For diagnosis",
    lastUpdate: "2025-01-20T14:30:00Z",
    vorUpdate: "2025-01-20T12:00:00Z",
    workshopEta: "2025-01-22T17:00:00Z",
    health: {
      healthScore: 75,
      batteryHealth: 82,
      lastOta: "2025-02-02",
      motExpiry: "2025-11-15",
      faultCodes: []
    },
    recall: {
      id: "REC-2025-003",
      title: "Charging Port Safety Update",
      description: "Update required for charging port safety mechanism",
      severity: "Medium",
      issuedDate: "2025-01-20",
      dueDate: "2025-03-01",
      status: "In Progress",
      affectedComponent: "Charging Port",
      remedy: "Workshop visit for component update"
    }
  },
  {
    id: "BYD-V004",
    vin: "LNB83746519283746",
    model: "BYD Seal U",
    registration: "PQ78 RST",
    location: "London Heathrow",
    location_coords: { lat: 51.4700, lng: -0.4543 },
    rental_partner: "Partner C",
    part_status: "OK",
    days_overdue: 0,
    contract_expiry: "2025-10-10",
    risk_score: 0,
    risk_level: "Low",
    availability_status: "Awaiting Valet",
    next_available_date: "2025-01-22",
    stage_timestamps: {
      returnedAt: "2025-01-19T14:00:00Z",
      inspectedAt: "2025-01-19T15:00:00Z",
      valetedAt: null,
      workshopInAt: null,
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-19T14:00:00Z",
    turnaround_seconds: 86400,
    health: {
      healthScore: 88,
      batteryHealth: 91,
      lastOta: "2025-01-29",
      motExpiry: "2026-01-20",
      faultCodes: []
    }
  },
  {
    id: "BYD-V005",
    vin: "LNB11223344556677",
    model: "BYD Atto 3",
    registration: "UV90 WXY",
    location: "Manchester Hub",
    location_coords: { lat: 53.4839, lng: -2.2446 },
    rental_partner: "Partner B",
    part_status: "Critical",
    days_overdue: 8,
    contract_expiry: "2025-06-30",
    risk_score: 3.8,
    risk_level: "Medium",
    availability_status: "In Workshop",
    next_available_date: "2025-02-05",
    stage_timestamps: {
      returnedAt: "2025-01-15T09:00:00Z",
      inspectedAt: "2025-01-15T10:30:00Z",
      valetedAt: null,
      workshopInAt: "2025-01-15T11:00:00Z",
      partsRequestedAt: "2025-01-16T08:00:00Z"
    },
    last_returned_at: "2025-01-15T09:00:00Z",
    turnaround_seconds: 86400 * 7,
    currentProgress: "Road test",
    lastUpdate: "2025-01-16T15:00:00Z",
    vorUpdate: "2025-01-15T11:00:00Z",
    workshopEta: "2025-01-18T16:00:00Z",
    partsInfo: {
      depot: "London Depot",
      partName: "Brake Pad Set",
      partNumber: "BYD-BRK-002",
      orderDate: "2025-01-16T08:00:00Z",
      eta: "2025-01-17T10:00:00Z"
    },
    health: {
      healthScore: 65,
      batteryHealth: 72,
      lastOta: "2025-01-20",
      motExpiry: "2025-09-10",
      faultCodes: ["P0A80", "B1234"]
    }
  },
  {
    id: "BYD-V006",
    vin: "LNB99887766554433",
    model: "BYD Seal",
    registration: "ZA12 BCD",
    location: "Birmingham Hub",
    location_coords: { lat: 52.4862, lng: -1.8904 },
    rental_partner: "Partner A",
    part_status: "Critical",
    days_overdue: 15,
    contract_expiry: "2025-03-15",
    risk_score: 5.5,
    risk_level: "High",
    availability_status: "In Workshop",
    next_available_date: "2025-02-10",
    stage_timestamps: {
      returnedAt: "2025-01-08T08:00:00Z",
      inspectedAt: "2025-01-08T09:00:00Z",
      valetedAt: null,
      workshopInAt: "2025-01-08T10:00:00Z",
      partsRequestedAt: "2025-01-09T08:00:00Z"
    },
    currentProgress: "Awaiting inspection",
    lastUpdate: "2025-01-09T10:00:00Z",
    vorUpdate: "2025-01-08T10:00:00Z",
    workshopEta: "2025-01-12T15:00:00Z",
    partsInfo: {
      depot: "Birmingham Parts Center",
      partName: "Suspension Component",
      partNumber: "BYD-SUS-003",
      orderDate: "2025-01-09T08:00:00Z",
      eta: "2025-01-11T12:00:00Z"
    },
    last_returned_at: "2025-01-08T08:00:00Z",
    turnaround_seconds: 86400 * 10,
    health: {
      healthScore: 55,
      batteryHealth: 68,
      lastOta: "2025-01-15",
      motExpiry: "2025-07-20",
      faultCodes: ["P0A80", "C1234", "D5678"]
    }
  },
  {
    id: "BYD-V007",
    vin: "LNB22334455667788",
    model: "BYD Dolphin",
    registration: "EF34 GHI",
    location: "London Heathrow",
    location_coords: { lat: 51.4700, lng: -0.4543 },
    rental_partner: "Partner D",
    part_status: "OK",
    days_overdue: 2,
    contract_expiry: "2025-11-30",
    risk_score: 0.2,
    risk_level: "Low",
    availability_status: "On Hire",
    next_available_date: "2025-02-15",
    stage_timestamps: {
      returnedAt: null,
      inspectedAt: null,
      valetedAt: null,
      workshopInAt: null,
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-01T10:00:00Z",
    turnaround_seconds: 0,
    health: {
      healthScore: 95,
      batteryHealth: 98,
      lastOta: "2025-02-10",
      motExpiry: "2026-05-01",
      faultCodes: []
    }
  },
  {
    id: "BYD-V008",
    vin: "LNB33445566778899",
    model: "BYD Seal U",
    registration: "JK56 LMN",
    location: "Manchester Hub",
    location_coords: { lat: 53.4839, lng: -2.2446 },
    rental_partner: "Partner C",
    part_status: "Critical",
    days_overdue: 10,
    contract_expiry: "2025-04-20",
    risk_score: 5.0,
    risk_level: "High",
    availability_status: "Awaiting Documents",
    next_available_date: "2025-02-08",
    stage_timestamps: {
      returnedAt: "2025-01-12T09:00:00Z",
      inspectedAt: "2025-01-12T10:00:00Z",
      valetedAt: "2025-01-12T11:00:00Z",
      workshopInAt: null,
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-12T09:00:00Z",
    turnaround_seconds: 86400 * 6,
    health: {
      healthScore: 70,
      batteryHealth: 80,
      lastOta: "2025-01-25",
      motExpiry: "2025-10-15",
      faultCodes: ["P0A80"]
    }
  },
  {
    id: "BYD-V009",
    vin: "LNB44556677889900",
    model: "BYD Atto 3",
    registration: "OP78 QRS",
    location: "Birmingham Hub",
    location_coords: { lat: 52.4862, lng: -1.8904 },
    rental_partner: "Partner B",
    part_status: "Minor",
    days_overdue: 7,
    contract_expiry: "2025-09-15",
    risk_score: 0.7,
    risk_level: "Low",
    availability_status: "Awaiting Allocation",
    next_available_date: "2025-01-28",
    stage_timestamps: {
      returnedAt: "2025-01-17T08:00:00Z",
      inspectedAt: "2025-01-17T09:00:00Z",
      valetedAt: "2025-01-17T10:00:00Z",
      workshopInAt: null,
      partsRequestedAt: null
    },
    last_returned_at: "2025-01-17T08:00:00Z",
    turnaround_seconds: 86400 * 3,
    health: {
      healthScore: 85,
      batteryHealth: 89,
      lastOta: "2025-02-01",
      motExpiry: "2025-12-20",
      faultCodes: []
    }
  },
  {
    id: "BYD-V010",
    vin: "LNB55667788990011",
    model: "BYD Seal",
    registration: "TU90 VWX",
    location: "London Heathrow",
    location_coords: { lat: 51.4700, lng: -0.4543 },
    rental_partner: "Partner A",
    part_status: "Critical",
    days_overdue: 14,
    contract_expiry: "2025-02-20",
    risk_score: 6.4,
    risk_level: "High",
    availability_status: "In Workshop",
    next_available_date: "2025-02-12",
    stage_timestamps: {
      returnedAt: "2025-01-09T07:00:00Z",
      inspectedAt: "2025-01-09T08:00:00Z",
      valetedAt: null,
      workshopInAt: "2025-01-09T09:00:00Z",
      partsRequestedAt: "2025-01-10T08:00:00Z"
    },
    last_returned_at: "2025-01-09T07:00:00Z",
    turnaround_seconds: 86400 * 12,
    currentProgress: "For diagnosis",
    lastUpdate: "2025-01-10T11:00:00Z",
    vorUpdate: "2025-01-09T09:00:00Z",
    workshopEta: "2025-01-13T18:00:00Z",
    partsInfo: {
      depot: "London Depot",
      partName: "Charging Port Assembly",
      partNumber: "BYD-CHG-004",
      orderDate: "2025-01-10T08:00:00Z",
      eta: "2025-01-12T14:00:00Z"
    },
    health: {
      healthScore: 58,
      batteryHealth: 65,
      lastOta: "2025-01-10",
      motExpiry: "2025-06-30",
      faultCodes: ["P0A80", "B1234", "C5678", "D9012"]
    }
  }
]

export const agreementsFull: AgreementFull[] = [
  {
    id: "AG-001",
    agreementId: "C-001",
    vehicleId: "BYD-V001",
    customer: "Company Alpha",
    driverName: "John Smith",
    driverLicense: "DL12345678",
    driverPhone: "+44 7700 900123",
    createdAt: "2024-01-01T08:00:00Z",
    startAt: "2024-01-02T09:00:00Z",
    endAt: "2025-12-01T00:00:00Z",
    stage: "Agreement Signed",
    timestamps: {
      reservationCreatedAt: "2024-01-01T08:00:00Z",
      preparedAt: "2024-01-01T08:10:00Z",
      signedAt: "2024-01-01T08:20:00Z",
      collectedAt: "2024-01-02T09:10:00Z",
      returnedAt: null,
      damageCheckCompletedAt: null,
      closedAt: null
    },
    status: "On track",
    notes: "Long-term contract, priority partner",
    assignedTo: "Operations Team A",
    mileageLimit: 15000,
    currentMileage: 8500,
    mileageAtStart: 1200
  },
  {
    id: "AG-002",
    agreementId: "C-002",
    vehicleId: "BYD-V002",
    customer: "Beta Rentals",
    driverName: "Sarah Johnson",
    driverLicense: "DL87654321",
    driverPhone: "+44 7700 900456",
    createdAt: "2024-06-01T09:00:00Z",
    startAt: "2024-06-02T10:00:00Z",
    endAt: "2025-05-15T00:00:00Z",
    stage: "Vehicle Returned",
    timestamps: {
      reservationCreatedAt: "2024-06-01T09:00:00Z",
      preparedAt: "2024-06-01T09:15:00Z",
      signedAt: "2024-06-01T09:30:00Z",
      collectedAt: "2024-06-02T10:00:00Z",
      returnedAt: "2025-01-10T08:00:00Z",
      damageCheckCompletedAt: null,
      closedAt: null
    },
    status: "Delayed",
    notes: "Returned with damage - under inspection",
    assignedTo: "Operations Team B",
    mileageLimit: 12000,
    mileageAtStart: 5000,
    mileageAtReturn: 15200,
    mileageOverage: 3200,
    penalties: [
      {
        id: 'pen-001',
        agreementId: 'C-002',
        type: 'mileage_overage',
        amount: 480.00,
        currency: 'GBP',
        description: 'Mileage overage: 3,200 miles over limit',
        date: '2025-01-10',
        status: 'pending',
        recordedBy: 'Sarah Johnson',
        recordedAt: '2025-01-10T09:00:00Z'
      },
      {
        id: 'pen-002',
        agreementId: 'C-002',
        type: 'late_return',
        amount: 150.00,
        currency: 'GBP',
        description: 'Late return: 28 days overdue',
        date: '2025-01-10',
        status: 'pending',
        recordedBy: 'Sarah Johnson',
        recordedAt: '2025-01-10T09:00:00Z'
      }
    ],
    breaches: [
      {
        id: 'breach-001',
        agreementId: 'C-002',
        type: 'mileage_breach',
        severity: 'moderate',
        description: 'Vehicle returned with 3,200 miles over contractual limit',
        date: '2025-01-10',
        resolved: false,
        recordedBy: 'Sarah Johnson',
        recordedAt: '2025-01-10T09:00:00Z'
      }
    ]
  },
  {
    id: "AG-003",
    agreementId: "C-003",
    vehicleId: "BYD-V003",
    customer: "Gamma Corp",
    driverName: "Michael Brown",
    driverLicense: "DL11223344",
    driverPhone: "+44 7700 900789",
    createdAt: "2024-08-15T10:00:00Z",
    startAt: "2024-08-16T11:00:00Z",
    endAt: "2025-08-20T00:00:00Z",
    stage: "Vehicle Collected",
    timestamps: {
      reservationCreatedAt: "2024-08-15T10:00:00Z",
      preparedAt: "2024-08-15T10:15:00Z",
      signedAt: "2024-08-15T10:30:00Z",
      collectedAt: "2024-08-16T11:00:00Z",
      returnedAt: null,
      damageCheckCompletedAt: null,
      closedAt: null
    },
    status: "On track",
    notes: "Standard contract",
    assignedTo: "Operations Team A",
    mileageLimit: 10000,
    currentMileage: 3200,
    mileageAtStart: 1500
  },
  {
    id: "AG-004",
    agreementId: "C-004",
    vehicleId: "BYD-V007",
    customer: "Delta Services",
    driverName: "Emma Wilson",
    driverLicense: "DL55667788",
    driverPhone: "+44 7700 900012",
    createdAt: "2024-11-01T09:00:00Z",
    startAt: "2024-11-02T10:00:00Z",
    endAt: "2025-11-30T00:00:00Z",
    stage: "Vehicle Collected",
    timestamps: {
      reservationCreatedAt: "2024-11-01T09:00:00Z",
      preparedAt: "2024-11-01T09:10:00Z",
      signedAt: "2024-11-01T09:25:00Z",
      collectedAt: "2024-11-02T10:00:00Z",
      returnedAt: null,
      damageCheckCompletedAt: null,
      closedAt: null
    },
    status: "On track",
    notes: "Premium customer",
    assignedTo: "Operations Team C"
  },
  {
    id: "AG-005",
    agreementId: "C-005",
    vehicleId: "BYD-V010",
    customer: "Epsilon Ltd",
    driverName: "David Taylor",
    driverLicense: "DL99887766",
    driverPhone: "+44 7700 900345",
    createdAt: "2024-09-10T08:00:00Z",
    startAt: "2024-09-11T09:00:00Z",
    endAt: "2025-02-20T00:00:00Z",
    stage: "Vehicle Returned",
    timestamps: {
      reservationCreatedAt: "2024-09-10T08:00:00Z",
      preparedAt: "2024-09-10T08:15:00Z",
      signedAt: "2024-09-10T08:30:00Z",
      collectedAt: "2024-09-11T09:00:00Z",
      returnedAt: "2025-01-09T07:00:00Z",
      damageCheckCompletedAt: "2025-01-09T08:00:00Z",
      closedAt: null
    },
    status: "Overdue",
    notes: "Vehicle returned with multiple issues",
    assignedTo: "Operations Team B"
  }
]

export const partners: Partner[] = [
  { id: "Partner A", avgLeadTimeHours: 24, slaPercent: 96, openJobs: 4 },
  { id: "Partner B", avgLeadTimeHours: 72, slaPercent: 78, openJobs: 12 },
  { id: "Partner C", avgLeadTimeHours: 48, slaPercent: 88, openJobs: 5 }
]

export const utilisation: Utilisation[] = [
  { date: "2025-02-01", utilisation: 62 },
  { date: "2025-02-02", utilisation: 58 },
  { date: "2025-02-03", utilisation: 74 },
  { date: "2025-02-04", utilisation: 81 },
  { date: "2025-02-05", utilisation: 79 },
  { date: "2025-02-06", utilisation: 65 },
  { date: "2025-02-07", utilisation: 84 }
]

// ==================== ADAPTERS FOR BACKWARD COMPATIBILITY ====================

/**
 * Convert new Vehicle structure to legacy VehicleWithRisk structure
 */
function vehicleToVehicleWithRisk(vehicle: Vehicle): VehicleWithRisk {
  return {
    vehicle_id: vehicle.id,
    vin: vehicle.vin,
    registration: vehicle.registration,
    rental_partner: vehicle.rental_partner,
    part_status: vehicle.part_status,
    days_overdue: vehicle.days_overdue,
    contract_expiry: vehicle.contract_expiry,
    risk_score: vehicle.risk_score,
    risk_level: vehicle.risk_level,
  }
}

/**
 * Convert new Agreement structure to legacy Agreement structure
 */
function agreementToAgreementLegacy(agreement: AgreementFull, vehicle: Vehicle | undefined): AgreementLegacy {
  // Map stage to legacy status
  let status: 'Pending' | 'Signed' | 'Overdue' = 'Pending'
  if (agreement.stage === 'Agreement Signed' || agreement.stage === 'Vehicle Collected' || agreement.stage === 'Vehicle Returned') {
    status = 'Signed'
  } else if (agreement.status === 'Overdue') {
    status = 'Overdue'
  }

  return {
    contract_number: agreement.agreementId,
    vehicle_id: agreement.vehicleId,
    vin: vehicle?.vin || '',
    registration: vehicle?.registration || '',
    rental_partner: vehicle?.rental_partner || '',
    driverName: agreement.driverName,
    driverLicense: agreement.driverLicense,
    driverPhone: agreement.driverPhone,
    start_date: agreement.startAt.split('T')[0],
    end_date: agreement.endAt.split('T')[0],
    status,
  }
}

// Export legacy-compatible arrays
export const vehiclesWithRisk: VehicleWithRisk[] = vehicles.map(vehicleToVehicleWithRisk)

export const agreementsLegacy: AgreementLegacy[] = agreementsFull.map((agreement) => {
  const vehicle = vehicles.find((v) => v.id === agreement.vehicleId)
  return agreementToAgreementLegacy(agreement, vehicle)
})

// For backward compatibility, export as 'agreements' as well
export { agreementsLegacy as agreements }

// Create a const for use in defaultExport
const agreements = agreementsLegacy

// ==================== BUYBACK AGREEMENTS ====================
export const buybackAgreements: BuybackAgreement[] = [
  {
    id: 'BB-001',
    buybackId: 'BB-2025-001',
    vehicleId: 'BYD-V002',
    vehicleRegistration: 'FG34 HIJ',
    rentalPartner: 'Partner B',
    originalAgreementId: 'C-002',
    buybackDate: '2025-01-15',
    buybackPrice: 18500.00,
    currency: 'GBP',
    condition: 'good',
    mileageAtBuyback: 15200,
    status: 'in_progress',
    complianceStatus: 'compliant',
    timestamps: {
      agreementCreatedAt: '2025-01-10T09:00:00Z',
      vehicleInspectedAt: '2025-01-12T14:00:00Z',
      buybackCompletedAt: null,
      paymentProcessedAt: null
    },
    notes: 'Buyback agreement for vehicle returned from rental partner',
    documents: ['doc-bb-001-inspection', 'doc-bb-001-agreement'],
    assignedTo: 'Operations Team B'
  },
  {
    id: 'BB-002',
    buybackId: 'BB-2025-002',
    vehicleId: 'BYD-V005',
    vehicleRegistration: 'KL78 MNO',
    rentalPartner: 'Partner C',
    originalAgreementId: 'C-005',
    buybackDate: '2025-02-01',
    buybackPrice: 22000.00,
    currency: 'GBP',
    condition: 'excellent',
    mileageAtBuyback: 8500,
    status: 'completed',
    complianceStatus: 'compliant',
    timestamps: {
      agreementCreatedAt: '2025-01-25T10:00:00Z',
      vehicleInspectedAt: '2025-01-28T11:00:00Z',
      buybackCompletedAt: '2025-02-01T09:00:00Z',
      paymentProcessedAt: '2025-02-01T10:30:00Z'
    },
    notes: 'Completed buyback - vehicle in excellent condition',
    documents: ['doc-bb-002-inspection', 'doc-bb-002-agreement', 'doc-bb-002-payment'],
    assignedTo: 'Operations Team A'
  }
]

// ==================== SUPPLIERS ====================
export const suppliers: Supplier[] = [
  {
    id: 'supplier-001',
    name: 'John Smith',
    companyName: 'Premium Rental Partners Ltd',
    type: 'rental_partner',
    contactPerson: 'John Smith',
    email: 'john.smith@premiumrental.co.uk',
    phone: '+44 20 7123 5001',
    address: '123 Fleet Street, London, EC4A 2AB',
    onboardingStatus: 'completed',
    onboardingDate: '2024-01-15',
    complianceStatus: 'compliant',
    documents: [
      {
        id: 'doc-sup-001-legal',
        name: 'Partnership Agreement',
        type: 'legal',
        uploadDate: '2024-01-15',
        expiryDate: '2026-01-15',
        status: 'valid',
        fileUrl: '/documents/suppliers/sup-001/partnership-agreement.pdf'
      },
      {
        id: 'doc-sup-001-insurance',
        name: 'Public Liability Insurance',
        type: 'insurance',
        uploadDate: '2024-01-15',
        expiryDate: '2025-01-15',
        status: 'pending_renewal',
        fileUrl: '/documents/suppliers/sup-001/insurance.pdf'
      }
    ],
    performance: {
      avgLeadTimeHours: 24,
      slaPercent: 95,
      totalOrders: 150,
      onTimeDelivery: 92
    },
    notes: 'Primary rental partner - excellent performance',
    assignedTo: 'Operations Team A'
  },
  {
    id: 'supplier-002',
    name: 'Sarah Williams',
    companyName: 'Fast Parts Supply Co',
    type: 'parts_supplier',
    contactPerson: 'Sarah Williams',
    email: 'sarah.williams@fastparts.co.uk',
    phone: '+44 20 7123 5002',
    address: '456 Industrial Way, Birmingham, B1 1AA',
    onboardingStatus: 'in_progress',
    onboardingDate: '2025-01-20',
    complianceStatus: 'under_review',
    documents: [
      {
        id: 'doc-sup-002-cert',
        name: 'ISO 9001 Certification',
        type: 'certification',
        uploadDate: '2025-01-20',
        expiryDate: '2026-01-20',
        status: 'valid',
        fileUrl: '/documents/suppliers/sup-002/iso-cert.pdf'
      }
    ],
    performance: {
      avgLeadTimeHours: 48,
      slaPercent: 88,
      totalOrders: 45,
      onTimeDelivery: 85
    },
    notes: 'New parts supplier - onboarding in progress',
    assignedTo: 'Operations Team B'
  }
]

// ==================== INVOICES ====================
export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-001',
    type: 'rental_supply',
    agreementId: 'C-001',
    customer: 'Company Alpha',
    amount: 1250.00,
    currency: 'GBP',
    issueDate: '2025-01-01',
    dueDate: '2025-01-31',
    status: 'paid',
    items: [
      {
        id: 'item-001',
        description: 'Monthly rental fee - BYD Atto 3 (AB12 CDE)',
        quantity: 1,
        unitPrice: 1250.00,
        total: 1250.00
      }
    ],
    notes: 'Monthly rental invoice',
    createdBy: 'Finance Team'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-002',
    type: 'penalty',
    agreementId: 'C-002',
    customer: 'Beta Rentals',
    amount: 630.00,
    currency: 'GBP',
    issueDate: '2025-01-10',
    dueDate: '2025-02-10',
    status: 'sent',
    items: [
      {
        id: 'item-002',
        description: 'Mileage overage penalty (3,200 miles)',
        quantity: 1,
        unitPrice: 480.00,
        total: 480.00
      },
      {
        id: 'item-003',
        description: 'Late return penalty (28 days)',
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00
      }
    ],
    notes: 'Penalties for contract C-002',
    createdBy: 'Operations Team B'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2025-003',
    type: 'buyback',
    buybackId: 'BB-2025-002',
    customer: 'Partner C',
    amount: 22000.00,
    currency: 'GBP',
    issueDate: '2025-02-01',
    dueDate: '2025-02-15',
    status: 'paid',
    items: [
      {
        id: 'item-004',
        description: 'Vehicle buyback - BYD Seal (KL78 MNO)',
        quantity: 1,
        unitPrice: 22000.00,
        total: 22000.00
      }
    ],
    notes: 'Buyback payment processed',
    createdBy: 'Finance Team'
  }
]

// ==================== PURCHASE ORDERS ====================
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-2025-001',
    supplierId: 'supplier-002',
    supplierName: 'Fast Parts Supply Co',
    amount: 1250.00,
    currency: 'GBP',
    issueDate: '2025-01-15',
    expectedDeliveryDate: '2025-01-20',
    status: 'delivered',
    items: [
      {
        id: 'po-item-001',
        description: 'Brake Pad Set - BYD Atto 3',
        quantity: 2,
        unitPrice: 250.00,
        total: 500.00
      },
      {
        id: 'po-item-002',
        description: 'Battery Module - BYD Seal',
        quantity: 1,
        unitPrice: 750.00,
        total: 750.00
      }
    ],
    notes: 'Parts order for workshop repairs',
    createdBy: 'Operations Team A'
  },
  {
    id: 'po-002',
    poNumber: 'PO-2025-002',
    supplierId: 'supplier-001',
    supplierName: 'Premium Rental Partners Ltd',
    amount: 5000.00,
    currency: 'GBP',
    issueDate: '2025-02-01',
    expectedDeliveryDate: '2025-02-05',
    status: 'in_transit',
    items: [
      {
        id: 'po-item-003',
        description: 'Fleet maintenance service package',
        quantity: 1,
        unitPrice: 5000.00,
        total: 5000.00
      }
    ],
    notes: 'Monthly maintenance package',
    createdBy: 'Operations Team B'
  }
]

// Export default for convenience
const defaultExport = {
  vehicles,
  vehiclesWithRisk,
  agreements,
  agreementsFull,
  agreementsLegacy,
  partners,
  utilisation,
  buybackAgreements,
  suppliers,
  invoices,
  purchaseOrders,
}

export default defaultExport
