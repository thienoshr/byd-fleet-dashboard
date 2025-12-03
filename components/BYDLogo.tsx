/**
 * BYD Company Logo Component
 * Stylized "YD" logo - minimalist, modern design
 * Y: Central vertical line branching into two upward segments connected by horizontal bar (tuning fork/U shape)
 * D: Bold open curve (thick rounded C), open side facing left, flat horizontal ends
 */
export default function BYDLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 24"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Y - Central vertical line with two upward segments at top connected by horizontal bar */}
      {/* Central vertical line */}
      <line x1="8" y1="12" x2="8" y2="20" />
      {/* Left upward segment */}
      <line x1="8" y1="12" x2="5" y2="6" />
      {/* Right upward segment */}
      <line x1="8" y1="12" x2="11" y2="6" />
      {/* Horizontal bar connecting the two upward segments */}
      <line x1="5" y1="6" x2="11" y2="6" />
      
      {/* D - Bold open curve (thick rounded C), open side facing left, flat horizontal ends */}
      <path d="M16 6 L16 18 M16 6 Q22 6 24 8 Q26 10 26 12 Q26 14 24 16 Q22 18 16 18" 
            fill="none" 
            strokeWidth="2.5" />
    </svg>
  )
}

