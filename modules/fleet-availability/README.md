# Fleet Availability Module

This module provides real-time-like fleet availability tracking and management capabilities for the BYD Fleet Risk Dashboard.

## Overview

The Fleet Availability module displays the current status and readiness of vehicles in the fleet, including vehicle statuses, utilisation metrics, and operational readiness indicators. It supports simple operational actions such as filtering vehicles by status, location, or other criteria, and flagging vehicles for attention.

## Features

### Vehicle Status Tracking

The module tracks five distinct vehicle statuses:

- **Available**: Vehicle is ready for hire and available for immediate use
- **On Hire**: Vehicle is currently rented out to a customer
- **In Workshop**: Vehicle is undergoing maintenance or repairs
- **Awaiting Valet**: Vehicle requires cleaning/preparation before being available
- **Awaiting Allocation**: Vehicle is ready but not yet assigned to a location or customer

### Vehicle Information

Each vehicle record includes:

- **ID**: Unique vehicle identifier
- **VIN**: Vehicle Identification Number
- **Model**: BYD vehicle model (Atto 3, Seal, Dolphin, Seal U, etc.)
- **Location**: Current physical location (London Heathrow, Manchester Hub, Birmingham Hub, etc.)
- **Status**: Current operational status
- **Mileage**: Current odometer reading
- **Next Service**: Date of next scheduled service
- **Last OTA**: Date of last Over-The-Air update
- **Health Score**: Vehicle health rating (0-100)

### Utilisation Metrics

The module tracks daily fleet utilisation percentages, providing insights into:

- Overall fleet usage trends
- Peak and low utilisation periods
- Operational efficiency metrics

## Operational Actions

The module supports the following operational actions:

1. **Filtering**: Filter vehicles by:
   - Status (Available, On Hire, In Workshop, etc.)
   - Location
   - Model
   - Health Score thresholds

2. **Flagging**: Flag vehicles for attention based on:
   - Low health scores
   - Upcoming service dates
   - Stale OTA updates
   - High mileage

## Data Structure

### Vehicles

Located in `schema.ts`, the `vehicles` array contains vehicle records with all relevant operational data.

### Utilisation

Located in `schema.ts`, the `utilisation` array contains daily utilisation percentage data for trend analysis.

## Usage

Import the seed data from the schema:

```typescript
import { vehicles, utilisation, type Vehicle, type Utilisation } from '@/modules/fleet-availability/schema'
```

## Future Enhancements

Potential future additions to this module:

- Real-time status updates via WebSocket connections
- Integration with vehicle telematics systems
- Automated flagging based on configurable rules
- Historical utilisation trend analysis
- Predictive maintenance scheduling
- Location-based availability mapping















