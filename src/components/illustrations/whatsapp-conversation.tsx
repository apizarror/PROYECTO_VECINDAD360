export function WhatsAppConversation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Dots pattern for chat background */}
        <pattern id="chatDots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="#000" opacity="0.04" />
        </pattern>
        {/* Phone shadow */}
        <filter id="phoneShadow" x="-10%" y="-5%" width="120%" height="110%">
          <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="#1E3A8A" floodOpacity="0.3" />
        </filter>
        {/* Bubble shadow */}
        <filter id="bubbleShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Phone body */}
      <rect x="0" y="0" width="320" height="680" rx="36" fill="white" filter="url(#phoneShadow)" />

      {/* ── STATUS BAR ── */}
      <rect x="0" y="0" width="320" height="32" fill="#075E54" rx="36" />
      <rect x="0" y="20" width="320" height="12" fill="#075E54" />
      <text x="160" y="20" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="system-ui">12:30</text>
      {/* Signal bars */}
      <rect x="260" y="12" width="3" height="5" rx="1" fill="white" opacity="0.9" />
      <rect x="265" y="10" width="3" height="7" rx="1" fill="white" opacity="0.9" />
      <rect x="270" y="8" width="3" height="9" rx="1" fill="white" opacity="0.9" />
      <rect x="275" y="5" width="3" height="12" rx="1" fill="white" opacity="0.9" />
      <text x="286" y="18" fill="white" fontSize="7" fontFamily="system-ui">LTE</text>
      {/* Battery */}
      <rect x="296" y="10" width="18" height="9" rx="2" fill="none" stroke="white" strokeWidth="1" opacity="0.9" />
      <rect x="314" y="13" width="2" height="3" rx="1" fill="white" opacity="0.8" />
      <rect x="298" y="12" width="12" height="5" rx="1" fill="white" opacity="0.9" />

      {/* ── CHAT HEADER ── */}
      <rect x="0" y="32" width="320" height="56" fill="#075E54" />
      {/* Back arrow */}
      <text x="24" y="68" fill="white" fontSize="20" fontFamily="system-ui">←</text>
      {/* Avatar */}
      <circle cx="56" cy="60" r="18" fill="#1E40AF" />
      <text x="56" y="66" fill="white" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="system-ui">V3</text>
      {/* Name */}
      <text x="82" y="60" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui">Vecindad360 Bot</text>
      {/* Online */}
      <text x="82" y="74" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="system-ui">en línea</text>
      {/* Call icons */}
      <text x="260" y="64" fill="white" fontSize="16" fontFamily="system-ui">📹</text>
      <text x="292" y="64" fill="white" fontSize="14" fontFamily="system-ui">📞</text>

      {/* ── CHAT BACKGROUND ── */}
      <rect x="0" y="88" width="320" height="540" fill="#ECE5DD" />
      <rect x="0" y="88" width="320" height="540" fill="url(#chatDots)" />

      {/* ── BUBBLE 1: Outgoing (resident) ── */}
      <g transform="translate(120, 108)">
        <rect x="0" y="0" width="180" height="36" rx="8" fill="#DCF8C6" filter="url(#bubbleShadow)" />
        {/* Tail right */}
        <path d="M180 12 L188 4 L180 20 Z" fill="#DCF8C6" />
        <text x="12" y="20" fill="#1E293B" fontSize="11" fontFamily="system-ui">¿Cuánto debo este mes?</text>
        <text x="148" y="30" fill="#94A3B8" fontSize="9" fontFamily="system-ui">10:30 ✓✓</text>
      </g>

      {/* ── BUBBLE 2: Incoming (bot) ── */}
      <g transform="translate(12, 164)">
        <rect x="8" y="0" width="220" height="74" rx="8" fill="white" filter="url(#bubbleShadow)" />
        {/* Tail left */}
        <path d="M8 12 L0 4 L8 20 Z" fill="white" />
        <text x="20" y="20" fill="#1E293B" fontSize="12" fontFamily="system-ui">¡Hola! 👋</text>
        <text x="20" y="38" fill="#64748B" fontSize="11" fontFamily="system-ui">Mantenimiento mayo:</text>
        <text x="20" y="60" fill="#1E40AF" fontSize="22" fontWeight="800" fontFamily="system-ui">$450.00</text>
        <text x="20" y="70" fill="#94A3B8" fontSize="9" fontFamily="system-ui">Vence: 15 de mayo</text>
      </g>

      {/* ── BUBBLE 3: Incoming (bot) payment options ── */}
      <g transform="translate(12, 258)">
        <rect x="8" y="0" width="236" height="64" rx="8" fill="white" filter="url(#bubbleShadow)" />
        {/* Tail left */}
        <path d="M8 12 L0 4 L8 20 Z" fill="white" />
        <text x="20" y="18" fill="#1E293B" fontSize="11" fontFamily="system-ui">¿Cómo prefieres pagar?</text>
        {/* Yape button */}
        <rect x="20" y="28" width="64" height="26" rx="6" fill="#7C3AED" />
        <text x="52" y="45" fill="white" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="system-ui">💜 Yape</text>
        {/* Plin button */}
        <rect x="90" y="28" width="64" height="26" rx="6" fill="#0891B2" />
        <text x="122" y="45" fill="white" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="system-ui">💙 Plin</text>
        {/* Tarjeta button */}
        <rect x="160" y="28" width="64" height="26" rx="6" fill="#F97316" />
        <text x="192" y="45" fill="white" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="system-ui">🧡 Tarj.</text>
      </g>

      {/* ── BUBBLE 4: Outgoing (resident) ── */}
      <g transform="translate(108, 342)">
        <rect x="0" y="0" width="192" height="34" rx="8" fill="#DCF8C6" filter="url(#bubbleShadow)" />
        {/* Tail right */}
        <path d="M192 12 L200 4 L192 20 Z" fill="#DCF8C6" />
        <text x="12" y="20" fill="#1E293B" fontSize="11" fontFamily="system-ui">Ya pagué con Yape 💜</text>
        <text x="156" y="29" fill="#1E40AF" fontSize="9" fontFamily="system-ui">10:31 ✓✓</text>
      </g>

      {/* ── BUBBLE 5: Incoming (bot) confirmation ── */}
      <g transform="translate(12, 396)">
        <rect x="8" y="0" width="244" height="110" rx="8" fill="white" filter="url(#bubbleShadow)" />
        {/* Tail left */}
        <path d="M8 12 L0 4 L8 20 Z" fill="white" />
        <text x="20" y="20" fill="#1E293B" fontSize="12" fontWeight="700" fontFamily="system-ui">✅ ¡Pago confirmado!</text>
        {/* Receipt info */}
        <rect x="20" y="28" width="212" height="1" fill="#E2E8F0" />
        <text x="20" y="44" fill="#64748B" fontSize="10" fontFamily="system-ui">Recibo #458</text>
        <text x="20" y="58" fill="#64748B" fontSize="10" fontFamily="system-ui">Monto:</text>
        <text x="68" y="58" fill="#1E40AF" fontSize="12" fontWeight="700" fontFamily="system-ui">$450.00</text>
        <text x="20" y="72" fill="#64748B" fontSize="10" fontFamily="system-ui">Método: Yape 💜</text>
        <rect x="20" y="80" width="212" height="1" fill="#E2E8F0" />
        <text x="20" y="95" fill="#64748B" fontSize="10" fontFamily="system-ui">Enviado a tu correo ✅</text>
        <text x="20" y="108" fill="#22C55E" fontSize="10" fontWeight="600" fontFamily="system-ui">¡Gracias por pagar a tiempo! 🎉</text>
      </g>

      {/* ── INPUT BAR ── */}
      <rect x="0" y="628" width="320" height="52" fill="#F0F2F5" rx="36" />
      <rect x="0" y="628" width="320" height="16" fill="#F0F2F5" />
      {/* Emoji */}
      <text x="18" y="658" fill="#64748B" fontSize="16" fontFamily="system-ui" style={{ cursor: "pointer" }}>😊</text>
      {/* Attach */}
      <text x="48" y="656" fill="#64748B" fontSize="14" fontFamily="system-ui" style={{ cursor: "pointer" }}>📎</text>
      {/* Input field */}
      <rect x="78" y="640" width="194" height="28" rx="14" fill="white" />
      <text x="92" y="658" fill="#94A3B8" fontSize="10" fontFamily="system-ui">Escribe un mensaje...</text>
      {/* Mic */}
      <text x="288" y="656" fill="#64748B" fontSize="14" fontFamily="system-ui" style={{ cursor: "pointer" }}>🎤</text>

      {/* ── PHONE CLIP EDGES (rounded corners) ── */}
      <rect x="0" y="0" width="320" height="680" rx="36" fill="none" stroke="#E2E8F0" strokeWidth="1" />
    </svg>
  );
}
