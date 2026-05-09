export function DotsPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#dots)" />
    </svg>
  );
}

export function WavePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 60 C200 0 400 120 600 60 C800 0 1000 120 1200 60 L1200 120 L0 120 Z"
        fill="currentColor"
        opacity="0.08"
      />
    </svg>
  );
}

export function GridPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 L0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)" />
    </svg>
  );
}

export function BlobDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M45.3 17.2C68.1 -5.7 101.9 -5.7 124.7 17.2C147.5 40 147.5 73.9 124.7 96.8C101.9 119.6 68.1 119.6 45.3 96.8C22.5 73.9 22.5 40 45.3 17.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
