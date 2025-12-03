/**
 * HealthWarning component
 * Displays a badge indicating vehicle health status based on health score
 * 
 * @param healthScore - Vehicle health score (0-100), or undefined
 */
interface HealthWarningProps {
  healthScore?: number
}

export default function HealthWarning({ healthScore }: HealthWarningProps) {
  // Return null if healthScore is undefined
  if (healthScore === undefined) {
    return null
  }

  // Determine badge content and styling based on health score
  let badgeText: string
  let badgeClasses: string

  if (healthScore < 65) {
    // Red warning badge for low health
    badgeText = '⚠ Low vehicle health'
    badgeClasses = 'bg-red-100 text-red-800 border-red-200'
  } else if (healthScore >= 65 && healthScore <= 80) {
    // Amber badge for service soon
    badgeText = 'Service soon'
    badgeClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200'
  } else {
    // Green badge for good health
    badgeText = 'Good'
    badgeClasses = 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full border ${badgeClasses}`}
    >
      {badgeText}
    </span>
  )
}















