/**
 * KPI Card component for displaying key performance indicators
 * @param title - Title of the KPI
 * @param value - Main value to display
 * @param description - Optional description text below the value
 * @param icon - Optional emoji or icon to display
 * @param color - Optional color theme (blue, red, yellow, green, orange, purple)
 */
interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'purple'
}

export default function KpiCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
}: KpiCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      value: 'text-blue-700',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      value: 'text-red-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      value: 'text-yellow-700',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      value: 'text-green-700',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      value: 'text-orange-800',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      value: 'text-purple-700',
    },
  }

  const colors = colorClasses[color]

  return (
    <div className={`card ${colors.bg} border-0 shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors.text} opacity-80`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${colors.value}`}>{value}</p>
          {description && (
            <p className={`text-sm mt-2 ${colors.text} opacity-75`}>{description}</p>
          )}
        </div>
        {icon && <div className="text-4xl ml-4 opacity-80">{icon}</div>}
      </div>
    </div>
  )
}

