'use client'

import React from 'react'
import { partners } from '@/lib/dummyData'

export default function SlaPartnerTracker() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Partner SLA Tracker</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="pb-2">Partner</th>
            <th className="pb-2">Avg lead time (hrs)</th>
            <th className="pb-2">SLA %</th>
            <th className="pb-2">Open Jobs</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2 font-medium">{p.id}</td>
              <td className="py-2">{p.avgLeadTimeHours}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    p.slaPercent < 80
                      ? 'bg-red-100 text-red-700'
                      : p.slaPercent < 90
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {p.slaPercent}%
                </span>
              </td>
              <td className="py-2">{p.openJobs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}












