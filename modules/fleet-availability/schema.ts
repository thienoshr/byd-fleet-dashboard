/**
 * Fleet Availability Module - Schema and Seed Data
 * Contains dummy seed data for vehicles and utilisation metrics
 */

/**
 * Vehicle status types
 */
export type VehicleStatus = 
  | 'Available' 
  | 'On Hire' 
  | 'In Workshop' 
  | 'Awaiting Valet' 
  | 'Awaiting Allocation'

/**
 * Vehicle data structure
 */
export interface Vehicle {
  id: string
  vin: string
  registration: string
  model: string
  location: string
  status: VehicleStatus
  mileage: number
  nextService: string
  lastOTA: string
  healthScore: number
}

/**
 * Utilisation data structure
 */
export interface Utilisation {
  date: string
  utilisation: number
}

/**
 * Dummy seed data - Vehicles
 */
export const vehicles: Vehicle[] = [
  {
    id: "V001",
    vin: "LNB00123456789012",
    registration: "AB12 CDE",
    model: "BYD Atto 3",
    location: "London Heathrow",
    status: "Available",
    mileage: 12000,
    nextService: "2025-02-25",
    lastOTA: "2025-02-05",
    healthScore: 92
  },
  {
    id: "V002",
    vin: "LNB00987654321098",
    registration: "FG34 HIJ",
    model: "BYD Seal",
    location: "Manchester Hub",
    status: "On Hire",
    mileage: 8700,
    nextService: "2025-03-14",
    lastOTA: "2025-02-07",
    healthScore: 88
  },
  {
    id: "V003",
    vin: "LNB56473829100047",
    registration: "KL56 MNO",
    model: "BYD Dolphin",
    location: "Birmingham Hub",
    status: "In Workshop",
    mileage: 14300,
    nextService: "2025-03-01",
    lastOTA: "2025-02-02",
    healthScore: 60
  },
  {
    id: "V004",
    vin: "LNB83746519283746",
    registration: "PQ78 RST",
    model: "BYD Seal U",
    location: "London Heathrow",
    status: "Awaiting Valet",
    mileage: 22000,
    nextService: "2025-04-10",
    lastOTA: "2025-01-29",
    healthScore: 75
  }
]

/**
 * Dummy seed data - Utilisation metrics
 */
export const utilisation: Utilisation[] = [
  { date: "2025-02-01", utilisation: 62 },
  { date: "2025-02-02", utilisation: 58 },
  { date: "2025-02-03", utilisation: 74 },
  { date: "2025-02-04", utilisation: 81 },
  { date: "2025-02-05", utilisation: 79 },
  { date: "2025-02-06", utilisation: 65 },
  { date: "2025-02-07", utilisation: 84 }
]




