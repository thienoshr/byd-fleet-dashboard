'use client'

import { useMemo } from 'react'
import { vehicles } from '@/lib/dummyData'

export default function BatteryHealthAlertWidget() {
  const batteryHealth = useMemo(() => {
    const threshold = 70 // Battery health threshold
    const lowBattery = vehicles.filter((v) => v.health.batteryHealth < threshold).length
    const avgBatteryHealth = vehicles.reduce((sum, v) => sum + v.health.batteryHealth, 0) / vehicles.length

    return { lowBattery, avgBatteryHealth: Math.round(avgBatteryHealth) }
  }, [])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Battery Health</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Low Battery (&lt;70%)</span>
          <span className={`font-semibold ${batteryHealth.lowBattery > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {batteryHealth.lowBattery}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-700 font-medium">Average Health</span>
          <span className="font-semibold">{batteryHealth.avgBatteryHealth}%</span>
        </div>
      </div>
    </div>
  )
}





