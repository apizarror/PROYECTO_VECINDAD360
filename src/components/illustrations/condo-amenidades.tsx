export function CondoAmenidades({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="ca-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="35%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient id="ca-pool" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="ca-pool-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ca-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="800" fill="url(#ca-sky)" />

      {/* Sun */}
      <circle cx="1150" cy="180" r="100" fill="white" opacity="0.05" />
      <circle cx="1150" cy="180" r="70" fill="white" opacity="0.08" />
      <circle cx="1150" cy="180" r="40" fill="#FDE68A" opacity="0.15" />

      {/* Palm silhouettes in background */}
      <g opacity="0.25">
        {/* Palm 1 */}
        <rect x="195" y="300" width="6" height="180" rx="3" fill="#064E3B" />
        <path d="M198 300 Q160 260 120 280" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M198 300 Q230 250 260 270" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M198 300 Q180 240 170 230" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M198 300 Q210 235 230 225" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M198 290 Q155 280 140 290" stroke="#064E3B" strokeWidth="3.5" fill="none" />
        <path d="M198 290 Q240 275 260 285" stroke="#064E3B" strokeWidth="3.5" fill="none" />

        {/* Palm 2 */}
        <rect x="1195" y="280" width="5" height="200" rx="3" fill="#064E3B" />
        <path d="M1198 280 Q1160 240 1120 260" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M1198 280 Q1230 230 1260 250" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M1198 280 Q1180 220 1170 210" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M1198 280 Q1210 215 1230 205" stroke="#064E3B" strokeWidth="4" fill="none" />
        <path d="M1198 270 Q1155 260 1140 270" stroke="#064E3B" strokeWidth="3.5" fill="none" />
        <path d="M1198 270 Q1240 255 1260 265" stroke="#064E3B" strokeWidth="3.5" fill="none" />
      </g>

      {/* Main condo building */}
      <rect x="420" y="220" width="600" height="280" rx="16" fill="#0F172A" opacity="0.9" />
      <rect x="420" y="210" width="600" height="18" rx="8" fill="#F97316" opacity="0.85" />

      {/* Building wings */}
      <rect x="320" y="280" width="100" height="220" rx="8" fill="#1E293B" opacity="0.85" />
      <rect x="1020" y="280" width="100" height="220" rx="8" fill="#1E293B" opacity="0.85" />

      {/* Glass panels - main building */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <rect
            key={`ca-glass-${row}-${col}`}
            x={435 + col * 57}
            y={238 + row * 48}
            width="48"
            height="40"
            rx="4"
            fill={col % 2 === 0 ? "#3B82F6" : "#60A5FA"}
            opacity={0.2 + (row % 3) * 0.12}
          />
        ))
      )}

      {/* Wing windows */}
      {Array.from({ length: 4 }).map((_, row) =>
        [350, 1035].map((x, wi) => (
          <rect
            key={`ca-wing-${wi}-${row}`}
            x={x}
            y={295 + row * 48}
            width="40"
            height="38"
            rx="3"
            fill="#3B82F6"
            opacity={0.15 + (row % 3) * 0.08}
          />
        ))
      )}

      {/* Lobby entrance */}
      <rect x="620" y="430" width="200" height="70" rx="10" fill="#1E3A8A" />
      <rect x="635" y="442" width="80" height="58" rx="6" fill="#DBEAFE" opacity="0.12" />
      <rect x="725" y="442" width="80" height="58" rx="6" fill="#DBEAFE" opacity="0.12" />
      <rect x="608" y="418" width="224" height="16" rx="6" fill="#F97316" opacity="0.7" />

      {/* Ground level / deck */}
      <rect x="280" y="500" width="880" height="20" rx="4" fill="#E2E8F0" opacity="0.5" />
      <rect x="0" y="520" width="1440" height="280" fill="url(#ca-ground)" opacity="0.4" />

      {/* Pool */}
      <ellipse cx="720" cy="660" rx="320" ry="70" fill="url(#ca-pool)" />
      <ellipse cx="720" cy="655" rx="310" ry="60" fill="url(#ca-pool-top)" />
      
      {/* Pool water lines */}
      {[640, 680, 720, 760, 800].map((x, i) => (
        <path
          key={`pool-wave-${i}`}
          d={`M${x - 20} ${650 + (i % 2) * 8} Q${x} ${645 + (i % 2) * 6} ${x + 20} ${650 + (i % 2) * 8}`}
          stroke="white"
          strokeWidth="1"
          opacity="0.08"
          fill="none"
        />
      ))}

      {/* Pool edge */}
      <ellipse cx="720" cy="660" rx="320" ry="70" fill="none" stroke="white" strokeWidth="3" opacity="0.15" />

      {/* Lounge chairs */}
      {[
        [480, 620, -15],
        [520, 622, -15],
        [900, 618, 15],
        [940, 620, 15],
      ].map(([x, y, r], i) => (
        <g key={`chair-${i}`} transform={`rotate(${r}, ${x}, ${y})`}>
          <rect x={x} y={y} width={30} height={8} rx={3} fill="#F97316" opacity="0.6" />
          <rect x={x} y={Number(y) - 10} width={30} height={5} rx="2" fill="#FDE68A" opacity="0.5" />
          <rect x={Number(x) + 14} y={Number(y) - 5} width="2" height={15} rx="1" fill="#D1D5DB" opacity="0.5" />
        </g>
      ))}

      {/* Umbrellas */}
      {[
        [500, 610],
        [920, 608],
      ].map(([x, y], i) => (
        <g key={`umbrella-${i}`}>
          <line x1={x} y1={y} x2={x} y2={Number(y) + 40} stroke="#D1D5DB" strokeWidth="2" opacity="0.6" />
          <path d={`M${Number(x) - 18} ${Number(y) - 10} Q${x} ${Number(y) - 35} ${Number(x) + 18} ${Number(y) - 10}`} fill="#F97316" opacity="0.5" />
          <path d={`M${Number(x) - 14} ${Number(y) - 8} Q${x} ${Number(y) - 30} ${Number(x) + 14} ${Number(y) - 8}`} fill="#FB923C" opacity="0.4" />
        </g>
      ))}

      {/* Tropical plants/bushes */}
      {[
        [400, 580, 25],
        [430, 590, 20],
        [990, 585, 22],
        [1020, 575, 28],
        [370, 600, 30],
        [1060, 595, 25],
      ].map(([x, y, r], i) => (
        <g key={`bush-${i}`}>
          <circle cx={x} cy={y} r={r} fill="#15803D" opacity={0.5} />
          <circle cx={Number(x) - 6} cy={Number(y) + 4} r={Number(r) * 0.7} fill="#166534" opacity={0.55} />
          <circle cx={Number(x) + 6} cy={Number(y) + 5} r={Number(r) * 0.6} fill="#22C55E" opacity={0.4} />
        </g>
      ))}

      {/* Flower accents */}
      {[
        [395, 575],
        [435, 585],
        [995, 580],
        [1025, 570],
      ].map(([x, y], i) => (
        <circle key={`flower-${i}`} cx={x} cy={y} r={3} fill="#F97316" opacity={0.6} />
      ))}

      {/* Subtle overall dark overlay */}
      <rect width="1440" height="800" fill="#1E3A8A" opacity="0.08" />
    </svg>
  );
}
