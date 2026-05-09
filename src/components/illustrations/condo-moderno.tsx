export function CondoModerno({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="cm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="cm-building" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="cm-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cm-glass2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FB923C" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="cm-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="1440" height="800" fill="url(#cm-sky)" />

      {/* Stars */}
      {[
        [200, 50],
        [450, 30],
        [700, 60],
        [900, 25],
        [1100, 45],
        [1300, 35],
        [350, 80],
        [600, 70],
        [1000, 55],
        [1250, 75],
      ].map(([x, y], i) => (
        <circle key={`star-${i}`} cx={x} cy={y} r={1.5} fill="white" opacity={0.3 + (i % 3) * 0.2} />
      ))}

      {/* Moon */}
      <circle cx="1150" cy="120" r="50" fill="white" opacity="0.08" />
      <circle cx="1165" cy="110" r="45" fill="url(#cm-sky)" />

      {/* Distant city silhouette */}
      <rect x="0" y="380" width="1440" height="120" fill="#0F172A" opacity="0.3" />
      {[
        [100, 340, 60, 160],
        [200, 360, 40, 140],
        [280, 320, 70, 180],
        [400, 350, 50, 150],
        [500, 330, 80, 170],
        [650, 355, 45, 145],
        [750, 310, 90, 190],
        [900, 340, 55, 160],
        [1000, 360, 40, 140],
        [1080, 325, 70, 175],
        [1200, 345, 50, 155],
        [1300, 330, 65, 170],
      ].map(([x, y, w, h], i) => (
        <rect key={`city-${i}`} x={x} y={y} width={w} height={h} fill="#0F172A" opacity="0.4" rx="2" />
      ))}

      {/* Main building - tower */}
      <rect x="540" y="150" width="360" height="500" rx="12" fill="url(#cm-building)" />
      
      {/* Glass panels - horizontal rows */}
      {Array.from({ length: 12 }).map((_, row) => (
        Array.from({ length: 6 }).map((_, col) => (
          <rect
            key={`glass-${row}-${col}`}
            x={555 + col * 55}
            y={170 + row * 38}
            width="48"
            height="32"
            rx="4"
            fill={col % 2 === 0 ? "url(#cm-glass)" : "url(#cm-glass2)"}
            opacity={0.7 + (row % 3) * 0.1}
          />
        ))
      ))}

      {/* Building crown */}
      <rect x="540" y="140" width="360" height="18" rx="6" fill="#F97316" opacity="0.9" />
      <rect x="560" y="128" width="20" height="16" rx="3" fill="#FB923C" opacity="0.6" />
      <rect x="700" y="125" width="40" height="19" rx="4" fill="#F97316" opacity="0.8" />
      <rect x="860" y="128" width="20" height="16" rx="3" fill="#FB923C" opacity="0.6" />

      {/* Building entrance */}
      <rect x="660" y="570" width="120" height="80" rx="8" fill="#1E3A8A" />
      <rect x="670" y="580" width="100" height="70" rx="6" fill="#2563EB" opacity="0.3" />
      <rect x="670" y="580" width="46" height="70" rx="6" fill="#DBEAFE" opacity="0.15" />
      <rect x="724" y="580" width="46" height="70" rx="6" fill="#DBEAFE" opacity="0.15" />
      
      {/* Canopy */}
      <rect x="648" y="560" width="144" height="14" rx="6" fill="#F97316" opacity="0.7" />

      {/* Ground / street */}
      <rect x="0" y="650" width="1440" height="150" fill="url(#cm-ground)" />
      <rect x="0" y="650" width="1440" height="4" fill="#F97316" opacity="0.3" />

      {/* Trees left */}
      <circle cx="120" cy="580" r="45" fill="#15803D" opacity="0.5" />
      <circle cx="100" cy="600" r="35" fill="#166534" opacity="0.6" />
      <circle cx="150" cy="595" r="30" fill="#22C55E" opacity="0.4" />
      <rect x="116" y="620" width="8" height="30" rx="4" fill="#78350F" opacity="0.5" />

      <circle cx="380" cy="590" r="35" fill="#15803D" opacity="0.45" />
      <circle cx="370" cy="605" r="25" fill="#166534" opacity="0.55" />
      <rect x="376" y="625" width="6" height="25" rx="3" fill="#78350F" opacity="0.5" />

      {/* Trees right */}
      <circle cx="1080" cy="575" r="50" fill="#15803D" opacity="0.5" />
      <circle cx="1060" cy="595" r="38" fill="#166534" opacity="0.6" />
      <circle cx="1110" cy="590" r="32" fill="#22C55E" opacity="0.4" />
      <rect x="1076" y="620" width="8" height="30" rx="4" fill="#78350F" opacity="0.5" />

      <circle cx="1330" cy="585" r="40" fill="#15803D" opacity="0.5" />
      <circle cx="1315" cy="600" r="30" fill="#166534" opacity="0.55" />
      <rect x="1326" y="620" width="7" height="30" rx="3" fill="#78350F" opacity="0.5" />

      {/* Street lamps */}
      <line x1="350" y1="620" x2="350" y2="650" stroke="#F97316" strokeWidth="2" opacity="0.5" />
      <circle cx="350" cy="615" r="8" fill="#FDE68A" opacity="0.4" />
      <line x1="1090" y1="620" x2="1090" y2="650" stroke="#F97316" strokeWidth="2" opacity="0.5" />
      <circle cx="1090" cy="615" r="8" fill="#FDE68A" opacity="0.4" />

      {/* Subtle vignette overlay */}
      <rect width="1440" height="800" fill="url(#cm-ground)" opacity="0.15" />
    </svg>
  );
}
