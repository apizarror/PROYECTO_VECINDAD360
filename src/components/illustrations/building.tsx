export function BuildingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle decoration */}
      <circle cx="160" cy="140" r="130" fill="#EFF6FF" />

      {/* Ground line */}
      <rect x="30" y="220" width="260" height="4" rx="2" fill="#DBEAFE" />

      {/* Main building body */}
      <rect x="100" y="60" width="120" height="160" rx="8" fill="#1E40AF" />

      {/* Left wing */}
      <rect x="60" y="100" width="40" height="120" rx="6" fill="#2563EB" />

      {/* Right wing */}
      <rect x="220" y="100" width="40" height="120" rx="6" fill="#2563EB" />

      {/* Building top decoration */}
      <rect x="120" y="44" width="80" height="16" rx="4" fill="#F97316" />

      {/* windows - main building */}
      {[
        [115, 80],
        [155, 80],
        [195, 80],
        [115, 115],
        [155, 115],
        [195, 115],
        [115, 150],
        [155, 150],
        [195, 150],
        [115, 185],
        [155, 185],
        [195, 185],
      ].map(([x, y], i) => (
        <g key={`mw-${i}`}>
          <rect x={x} y={y} width="30" height="26" rx="4" fill="#DBEAFE" opacity="0.9" />
          <line x1={x + 15} y1={y} x2={x + 15} y2={y + 26} stroke="#1E40AF" strokeWidth="0.5" opacity="0.3" />
          <line x1={x} y1={y + 13} x2={x + 30} y2={y + 13} stroke="#1E40AF" strokeWidth="0.5" opacity="0.3" />
        </g>
      ))}

      {/* Windows - left wing */}
      {[
        [72, 115],
        [72, 152],
        [72, 189],
      ].map(([x, y], i) => (
        <g key={`lw-${i}`}>
          <rect x={x} y={y} width="20" height="20" rx="3" fill="#DBEAFE" opacity="0.7" />
          <line x1={x + 10} y1={y} x2={x + 10} y2={y + 20} stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
        </g>
      ))}

      {/* Windows - right wing */}
      {[
        [232, 115],
        [232, 152],
        [232, 189],
      ].map(([x, y], i) => (
        <g key={`rw-${i}`}>
          <rect x={x} y={y} width="20" height="20" rx="3" fill="#DBEAFE" opacity="0.7" />
          <line x1={x + 10} y1={y} x2={x + 10} y2={y + 20} stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
        </g>
      ))}

      {/* Entrance */}
      <rect x="135" y="190" width="50" height="30" rx="4" fill="#1E3A8A" />
      <rect x="143" y="194" width="34" height="26" rx="3" fill="#DBEAFE" opacity="0.3" />

      {/* Trees - left */}
      <circle cx="44" cy="195" r="16" fill="#22C55E" opacity="0.25" />
      <rect x="42" y="195" width="4" height="16" rx="2" fill="#64748B" opacity="0.3" />

      {/* Trees - right */}
      <circle cx="276" cy="200" r="14" fill="#22C55E" opacity="0.25" />
      <rect x="274" y="200" width="4" height="14" rx="2" fill="#64748B" opacity="0.3" />

      {/* Leaves decoration top right */}
      <circle cx="268" cy="72" r="22" fill="#F97316" opacity="0.08" />
    </svg>
  );
}
