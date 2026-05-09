export function CondoComunidad({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="cc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="cc-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#166534" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="cc-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="800" fill="url(#cc-sky)" />

      {/* Clouds */}
      <ellipse cx="200" cy="120" rx="120" ry="30" fill="white" opacity="0.06" />
      <ellipse cx="260" cy="110" rx="80" ry="25" fill="white" opacity="0.05" />
      <ellipse cx="800" cy="90" rx="150" ry="35" fill="white" opacity="0.06" />
      <ellipse cx="880" cy="80" rx="100" ry="28" fill="white" opacity="0.05" />
      <ellipse cx="1200" cy="130" rx="100" ry="28" fill="white" opacity="0.06" />
      <ellipse cx="1260" cy="120" rx="70" ry="22" fill="white" opacity="0.05" />

      {/* Sun glow */}
      <circle cx="1200" cy="200" r="180" fill="white" opacity="0.04" />
      <circle cx="1200" cy="200" r="120" fill="white" opacity="0.06" />
      <circle cx="1200" cy="200" r="60" fill="white" opacity="0.08" />

      {/* Distant mountains/hills */}
      <path d="M0 450 Q200 380 400 420 Q600 360 800 410 Q1000 370 1200 400 Q1350 380 1440 420 L1440 500 L0 500Z" fill="#1E3A8A" opacity="0.25" />
      <path d="M0 470 Q150 430 350 460 Q550 410 750 450 Q950 420 1150 445 Q1350 425 1440 450 L1440 520 L0 520Z" fill="#1E40AF" opacity="0.3" />

      {/* Ground / park area */}
      <rect x="0" y="500" width="1440" height="300" fill="url(#cc-ground)" />
      
      {/* Pathway */}
      <path d="M0 680 Q200 620 400 640 Q600 600 800 620 Q1000 590 1200 610 Q1350 620 1440 600 L1440 680 L0 680Z" fill="#FDE68A" opacity="0.2" />

      {/* Pond / water feature */}
      <ellipse cx="720" cy="620" rx="200" ry="50" fill="url(#cc-water)" />
      <ellipse cx="720" cy="618" rx="180" ry="42" fill="#3B82F6" opacity="0.15" />

      {/* Bridges over pond */}
      <path d="M580 610 Q650 600 720 608 Q790 600 860 610" stroke="#F97316" strokeWidth="3" opacity="0.4" fill="none" />
      <rect x="640" y="600" width="4" height="15" rx="2" fill="#F97316" opacity="0.3" />
      <rect x="795" y="602" width="4" height="15" rx="2" fill="#F97316" opacity="0.3" />

      {/* Condo buildings */}
      {/* Building 1 - left */}
      <rect x="120" y="340" width="180" height="260" rx="10" fill="#0F172A" opacity="0.85" />
      <rect x="120" y="330" width="180" height="16" rx="6" fill="#F97316" opacity="0.8" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`b1-${row}-${col}`}
            x={135 + col * 55}
            y={360 + row * 45}
            width="42"
            height="35"
            rx="3"
            fill="#3B82F6"
            opacity={0.2 + (row % 3) * 0.15}
          />
        ))
      )}
      <rect x="170" y="560" width="80" height="40" rx="6" fill="#1E3A8A" />
      <rect x="180" y="568" width="60" height="32" rx="4" fill="#DBEAFE" opacity="0.12" />

      {/* Building 2 - center */}
      <rect x="380" y="300" width="220" height="300" rx="12" fill="#1E293B" opacity="0.9" />
      <rect x="380" y="288" width="220" height="18" rx="6" fill="#F97316" opacity="0.85" />
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`b2-${row}-${col}`}
            x={395 + col * 50}
            y={318 + row * 42}
            width="40"
            height="34"
            rx="4"
            fill={col % 2 === 0 ? "#3B82F6" : "#60A5FA"}
            opacity={0.2 + (row % 3) * 0.12}
          />
        ))
      )}
      <rect x="440" y="558" width="100" height="42" rx="8" fill="#1E3A8A" />
      <rect x="453" y="567" width="74" height="33" rx="5" fill="#DBEAFE" opacity="0.1" />
      <line x1="490" y1="567" x2="490" y2="600" stroke="#1E3A8A" strokeWidth="1" opacity="0.5" />

      {/* Building 3 - right */}
      <rect x="680" y="330" width="200" height="270" rx="10" fill="#0F172A" opacity="0.85" />
      <rect x="680" y="318" width="200" height="18" rx="6" fill="#F97316" opacity="0.8" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`b3-${row}-${col}`}
            x={695 + col * 46}
            y={348 + row * 44}
            width="38"
            height="36"
            rx="3"
            fill="#60A5FA"
            opacity={0.2 + (col % 3) * 0.1}
          />
        ))
      )}
      <rect x="730" y="558" width="100" height="42" rx="8" fill="#1E3A8A" />
      <rect x="742" y="566" width="76" height="34" rx="5" fill="#DBEAFE" opacity="0.1" />

      {/* Building 4 - far right */}
      <rect x="950" y="360" width="160" height="240" rx="10" fill="#0F172A" opacity="0.8" />
      <rect x="950" y="350" width="160" height="14" rx="6" fill="#F97316" opacity="0.75" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`b4-${row}-${col}`}
            x={965 + col * 48}
            y={376 + row * 48}
            width="38"
            height="38"
            rx="3"
            fill="#3B82F6"
            opacity={0.18 + (row % 3) * 0.1}
          />
        ))
      )}
      <rect x="990" y="560" width="80" height="40" rx="6" fill="#1E3A8A" />
      <rect x="1000" y="568" width="60" height="32" rx="4" fill="#DBEAFE" opacity="0.1" />

      {/* Trees scattered around */}
      {[
        [60, 520, 35],
        [90, 540, 25],
        [320, 530, 40],
        [350, 555, 28],
        [590, 540, 32],
        [920, 530, 38],
        [1130, 520, 35],
        [1160, 545, 28],
        [1350, 530, 40],
        [1380, 555, 30],
      ].map(([x, y, r], i) => (
        <g key={`tree-${i}`}>
          <circle cx={x} cy={y} r={r} fill="#15803D" opacity={0.45} />
          <circle cx={Number(x) - 8} cy={Number(y) + 8} r={Number(r) * 0.7} fill="#166534" opacity={0.5} />
          <rect x={Number(x) - 3} y={Number(y) + Number(r) - 5} width={6} height={20} rx={3} fill="#78350F" opacity={0.4} />
        </g>
      ))}

      {/* Benches */}
      <rect x="280" y="610" width="30" height="4" rx="2" fill="#78350F" opacity="0.4" />
      <rect x="282" y="614" width="3" height="8" rx="1" fill="#78350F" opacity="0.35" />
      <rect x="305" y="614" width="3" height="8" rx="1" fill="#78350F" opacity="0.35" />

      <rect x="850" y="620" width="30" height="4" rx="2" fill="#78350F" opacity="0.4" />
      <rect x="852" y="624" width="3" height="8" rx="1" fill="#78350F" opacity="0.35" />
      <rect x="875" y="624" width="3" height="8" rx="1" fill="#78350F" opacity="0.35" />

      {/* Street lamps along path */}
      {[150, 400, 650, 900, 1150, 1350].map((x, i) => (
        <g key={`lamp-${i}`}>
          <line x1={x} y1={590} x2={x} y2={620} stroke="#94A3B8" strokeWidth="1.5" opacity="0.4" />
          <circle cx={x} cy={588} r={6} fill="#FDE68A" opacity="0.35" />
        </g>
      ))}

      {/* Subtle overlay for depth */}
      <rect width="1440" height="800" fill="#1E3A8A" opacity="0.08" />
    </svg>
  );
}
