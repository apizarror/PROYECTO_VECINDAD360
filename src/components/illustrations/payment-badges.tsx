export function PaymentBadges() {
  return (
    <svg viewBox="0 0 480 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Yape */}
      <rect x="0" y="0" width="88" height="48" rx="12" fill="#7C3AED" />
      <rect x="0" y="0" width="88" height="48" rx="12" fill="url(#yapeGrad)" />
      <text x="44" y="30" fill="white" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="system-ui">Yape</text>

      {/* Plin */}
      <rect x="98" y="0" width="88" height="48" rx="12" fill="#00B4D8" />
      <rect x="98" y="0" width="88" height="48" rx="12" fill="url(#plinGrad)" />
      <text x="142" y="30" fill="white" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="system-ui">Plin</text>

      {/* Visa / Tarjeta */}
      <rect x="196" y="0" width="88" height="48" rx="12" fill="#1E293B" />
      <text x="240" y="30" fill="#F97316" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="system-ui">TARJETA</text>

      {/* PSE */}
      <rect x="294" y="0" width="88" height="48" rx="12" fill="#22C55E" />
      <text x="338" y="30" fill="white" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="system-ui">PSE</text>

      {/* Transferencia */}
      <rect x="392" y="0" width="88" height="48" rx="12" fill="#3B82F6" />
      <text x="436" y="30" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="system-ui">TRANSF.</text>

      <defs>
        <linearGradient id="yapeGrad" x1="0" y1="0" x2="88" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="plinGrad" x1="0" y1="0" x2="88" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
