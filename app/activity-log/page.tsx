'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ActivityLogPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to dashboard - Activity Log is now integrated there
    router.push('/dashboard')
  }, [router])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Redirecting...</h1>
        <p className="mt-2 text-gray-600">Activity Log has been moved to the Dashboard</p>
      </div>
    </div>
  )
}
