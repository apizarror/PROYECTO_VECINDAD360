export function DashboardMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Browser frame */}
      <rect x="8" y="8" width="584" height="384" rx="16" fill="#0F172A" />
      <rect x="8" y="8" width="584" height="384" rx="16" stroke="#1E293B" strokeWidth="1.5" />

      {/* Browser top bar */}
      <rect x="8" y="8" width="584" height="36" rx="16" fill="#1E293B" />
      <rect x="8" y="24" width="584" height="20" fill="#1E293B" />
      {/* Traffic lights */}
      <circle cx="28" cy="26" r="5" fill="#EF4444" opacity="0.7" />
      <circle cx="46" cy="26" r="5" fill="#F59E0B" opacity="0.7" />
      <circle cx="64" cy="26" r="5" fill="#22C55E" opacity="0.7" />
      {/* URL bar */}
      <rect x="90" y="20" width="200" height="12" rx="6" fill="#0F172A" opacity="0.6" />
      <text x="100" y="29" fill="#64748B" fontSize="7" fontFamily="monospace">app.vecindad360.com/dashboard</text>

      {/* Sidebar */}
      <rect x="16" y="52" width="56" height="332" rx="10" fill="#1E293B" />
      <rect x="24" y="64" width="40" height="40" rx="8" fill="#2563EB" />
      <text x="44" y="89" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">EP</text>
      <rect x="28" y="116" width="32" height="4" rx="2" fill="#334155" />
      <rect x="28" y="128" width="32" height="4" rx="2" fill="#334155" />
      <rect x="28" y="140" width="32" height="4" rx="2" fill="#334155" />
      <rect x="28" y="152" width="24" height="4" rx="2" fill="#3B82F6" />
      <rect x="28" y="164" width="32" height="4" rx="2" fill="#334155" />
      {/* Sidebar bottom avatar */}
      <circle cx="44" cy="364" r="12" fill="#F97316" />
      <text x="44" y="368" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">CM</text>

      {/* Main content area */}
      {/* KPI Cards */}
      <rect x="84" y="60" width="156" height="72" rx="10" fill="#1E293B" />
      <text x="100" y="82" fill="#64748B" fontSize="9" fontFamily="system-ui">Ingresos del mes</text>
      <text x="100" y="112" fill="white" fontSize="24" fontWeight="bold" fontFamily="system-ui">$12,450</text>
      <rect x="200" y="70" width="24" height="18" rx="6" fill="#22C55E" opacity="0.15" />
      <text x="212" y="83" fill="#22C55E" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">+8%</text>

      <rect x="248" y="60" width="156" height="72" rx="10" fill="#1E293B" />
      <text x="264" y="82" fill="#64748B" fontSize="9" fontFamily="system-ui">Gastos del mes</text>
      <text x="264" y="112" fill="white" fontSize="24" fontWeight="bold" fontFamily="system-ui">$8,920</text>
      <rect x="364" y="70" width="24" height="18" rx="6" fill="#EF4444" opacity="0.15" />
      <text x="376" y="83" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">-3%</text>

      <rect x="412" y="60" width="156" height="72" rx="10" fill="#1E293B" />
      <text x="428" y="82" fill="#64748B" fontSize="9" fontFamily="system-ui">Balance</text>
      <text x="428" y="112" fill="#F97316" fontSize="24" fontWeight="bold" fontFamily="system-ui">$3,530</text>

      {/* Chart section */}
      <rect x="84" y="144" width="484" height="120" rx="10" fill="#1E293B" />
      <text x="104" y="164" fill="#64748B" fontSize="9" fontFamily="system-ui">Ingresos vs Gastos — Últimos 6 meses</text>

      {/* Bar chart */}
      <g transform="translate(104, 180)">
        {[0.7, 0.85, 0.6, 0.9, 0.75, 0.95].map((h, i) => (
          <g key={i} transform={`translate(${i * 72}, 0)`}>
            <rect
              x="0"
              y={64 - h * 64}
              width="20"
              height={h * 64}
              rx="3"
              fill="#3B82F6"
              opacity="0.8"
            />
            <rect
              x="26"
              y={64 - (h - 0.2) * 64}
              width="20"
              height={(h - 0.2) * 64}
              rx="3"
              fill="#F97316"
              opacity="0.6"
            />
            <text x="10" y="80" fill="#475569" fontSize="7" textAnchor="middle" fontFamily="system-ui">
              {["Ene", "Feb", "Mar", "Abr", "May", "Jun"][i]}
            </text>
          </g>
        ))}
      </g>

      {/* Recent activity */}
      <rect x="84" y="276" width="280" height="100" rx="10" fill="#1E293B" />
      <text x="104" y="296" fill="#64748B" fontSize="9" fontFamily="system-ui">Actividad reciente</text>
      {[
        { text: "Recibo #458 generado", time: "Hace 5 min", color: "#22C55E" },
        { text: "Pago recibido — Dpto 302", time: "Hace 23 min", color: "#3B82F6" },
        { text: "Alerta enviada — Dpto 105", time: "Hace 1 hora", color: "#F97316" },
      ].map((item, i) => (
        <g key={i} transform={`translate(104, ${312 + i * 20})`}>
          <circle cx="4" cy="4" r="3" fill={item.color} />
          <text x="14" y="8" fill="white" fontSize="8" fontFamily="system-ui">{item.text}</text>
          <text x="250" y="8" fill="#475569" fontSize="7" fontFamily="system-ui" textAnchor="end">{item.time}</text>
        </g>
      ))}

      {/* Morosidad card */}
      <rect x="376" y="276" width="192" height="100" rx="10" fill="#1E293B" />
      <text x="396" y="296" fill="#64748B" fontSize="9" fontFamily="system-ui">Morosidad</text>
      {/* Donut chart */}
      <g transform="translate(440, 335)">
        <circle cx="0" cy="0" r="28" fill="none" stroke="#1E293B" strokeWidth="12" />
        <circle
          cx="0" cy="0" r="28"
          fill="none" stroke="#F97316" strokeWidth="12"
          strokeDasharray="132 44"
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text x="0" y="4" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui">12%</text>
      </g>
      <rect x="400" y="340" width="8" height="8" rx="2" fill="#F97316" opacity="0.8" />
      <text x="414" y="347" fill="#64748B" fontSize="7" fontFamily="system-ui">3 unidades morosas</text>

      {/* Browser shadow */}
      <defs>
        <filter id="browserShadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1E3A8A" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="8" y="8" width="584" height="384" rx="16" fill="none" filter="url(#browserShadow)" />
    </svg>
  );
}
