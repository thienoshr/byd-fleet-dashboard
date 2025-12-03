'use client'

/**
 * RiskBadge component
 * Displays risk level badge based on numeric score
 * @param score - Risk score (0-2: Low, 3-4: Medium, 5+: High)
 */
interface RiskBadgeProps {
  score: number
}

export default function RiskBadge({ score }: RiskBadgeProps) {
  // Determine risk level from score
  const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
    if (score <= 2) return 'Low'
    if (score <= 4) return 'Medium'
    return 'High'
  }

  // Get color classes based on risk level
  const getColorClasses = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const level = getRiskLevel(score)
  const colorClasses = getColorClasses(level)

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses}`}
    >
      {level}
    </span>
  )
}















