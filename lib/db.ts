import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'fleet.db')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize database connection
let db: Database.Database | null = null

/**
 * Get database instance (singleton pattern)
 */
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath)
    initializeDatabase(db)
  }
  return db
}

/**
 * Initialize database schema
 */
function initializeDatabase(db: Database.Database) {
  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Vehicles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id TEXT UNIQUE NOT NULL,
      registration TEXT NOT NULL,
      rental_partner TEXT NOT NULL,
      part_status TEXT NOT NULL,
      days_overdue INTEGER DEFAULT 0,
      contract_expiry DATE,
      risk_flag TEXT DEFAULT 'Low',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Agreements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS agreements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_number TEXT UNIQUE NOT NULL,
      vehicle_id TEXT NOT NULL,
      rental_partner TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
    )
  `)

  // Parts table (for tracking part lead times)
  db.exec(`
    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id TEXT NOT NULL,
      part_name TEXT NOT NULL,
      order_date DATE NOT NULL,
      expected_delivery_date DATE,
      actual_delivery_date DATE,
      lead_time_days INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
    )
  `)

  // Insert sample data if tables are empty
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get() as { count: number }
  if (vehicleCount.count === 0) {
    insertSampleData(db)
  }
}

/**
 * Insert sample data for development
 */
function insertSampleData(db: Database.Database) {
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (vehicle_id, registration, rental_partner, part_status, days_overdue, contract_expiry, risk_flag)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const insertAgreement = db.prepare(`
    INSERT INTO agreements (contract_number, vehicle_id, rental_partner, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const insertPart = db.prepare(`
    INSERT INTO parts (vehicle_id, part_name, order_date, expected_delivery_date, actual_delivery_date, lead_time_days)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const transaction = db.transaction(() => {
    // Sample vehicles
    const vehicles = [
      ['V001', 'ABC-123', 'Partner A', 'Pending', 5, '2024-12-31', 'High'],
      ['V002', 'DEF-456', 'Partner B', 'Delivered', 0, '2025-01-15', 'Low'],
      ['V003', 'GHI-789', 'Partner A', 'Overdue', 12, '2024-11-30', 'High'],
      ['V004', 'JKL-012', 'Partner C', 'Pending', 3, '2025-02-28', 'Medium'],
      ['V005', 'MNO-345', 'Partner B', 'Delivered', 0, '2025-03-15', 'Low'],
    ]

    vehicles.forEach(([vid, reg, partner, status, overdue, expiry, risk]) => {
      insertVehicle.run(vid, reg, partner, status, overdue, expiry, risk)
    })

    // Sample agreements
    const agreements = [
      ['CNT-001', 'V001', 'Partner A', '2024-01-01', '2024-12-31', 'Signed'],
      ['CNT-002', 'V002', 'Partner B', '2024-02-01', '2025-01-15', 'Signed'],
      ['CNT-003', 'V003', 'Partner A', '2023-12-01', '2024-11-30', 'Overdue'],
      ['CNT-004', 'V004', 'Partner C', '2024-03-01', '2025-02-28', 'Pending'],
      ['CNT-005', 'V005', 'Partner B', '2024-04-01', '2025-03-15', 'Signed'],
    ]

    agreements.forEach(([cnt, vid, partner, start, end, status]) => {
      insertAgreement.run(cnt, vid, partner, start, end, status)
    })

    // Sample parts
    const parts = [
      ['V001', 'Brake Pad', '2024-10-01', '2024-10-15', '2024-10-18', 17],
      ['V001', 'Oil Filter', '2024-10-05', '2024-10-10', '2024-10-12', 7],
      ['V002', 'Tire', '2024-09-20', '2024-09-25', '2024-09-24', 4],
      ['V003', 'Battery', '2024-09-15', '2024-09-30', null, null],
      ['V004', 'Windshield', '2024-10-10', '2024-10-20', null, null],
    ]

    parts.forEach(([vid, name, order, expected, actual, lead]) => {
      insertPart.run(vid, name, order, expected, actual, lead)
    })
  })

  transaction()
}















