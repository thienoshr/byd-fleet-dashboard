'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function FaultCodesWidget() {
  const faultCodes = useMemo(() => {
    const vehiclesWithFaults = vehicles.filter((v) => v.health.faultCodes.length > 0)
    const totalFaultCodes = vehicles.reduce((sum, v) => sum + v.health.faultCodes.length, 0)
    const uniqueFaultCodes = new Set(vehicles.flatMap((v) => v.health.faultCodes))

    return {
      vehiclesWithFaults: vehiclesWithFaults.length,
      totalFaultCodes,
      uniqueFaultCodes: uniqueFaultCodes.size,
    }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Fault Codes Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Vehicles with Faults</span>
          <span className={`font-semibold ${faultCodes.vehiclesWithFaults > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {faultCodes.vehiclesWithFaults}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Fault Codes</span>
          <span className="font-semibold">{faultCodes.totalFaultCodes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Unique Codes</span>
          <span className="font-semibold">{faultCodes.uniqueFaultCodes}</span>
        </div>
      </div>
    </div>
  )
}





