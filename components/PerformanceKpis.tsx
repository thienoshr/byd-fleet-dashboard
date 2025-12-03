'use client'

import React from 'react'
import { vehicles, utilisation, agreementsFull } from '@/lib/dummyData'

function calcUtilisation(): number {
  if (!utilisation || utilisation.length === 0) return 0
  const last = utilisation[utilisation.length - 1]
  return last.utilisation
}

export default function PerformanceKpis() {
  const totalVehicles = vehicles.length
  const utilisationPct = calcUtilisation()
  const openAgreements = agreementsFull.filter((a) => a.stage !== 'Closed').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-600">Total Fleet</div>
        <div className="text-2xl font-bold">{totalVehicles}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-600">Utilisation</div>
        <div className="text-2xl font-bold">{utilisationPct}%</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-600">Open Agreements</div>
        <div className="text-2xl font-bold">{openAgreements}</div>
      </div>
    </div>
  )
}





