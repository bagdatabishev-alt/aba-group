export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="abaGlobeClip">
          <circle cx="50" cy="52" r="27" />
        </clipPath>
      </defs>
      <g clipPath="url(#abaGlobeClip)">
        <rect x="10" y="15" width="80" height="37" fill="#2BA8D6" />
        <rect x="10" y="52" width="80" height="37" fill="#2E8B4F" />
        <g stroke="#fff" strokeWidth="2" fill="none" opacity="0.85">
          <ellipse cx="50" cy="52" rx="27" ry="27" />
          <ellipse cx="50" cy="52" rx="12" ry="27" />
          <line x1="23" y1="52" x2="77" y2="52" />
          <line x1="23" y1="38" x2="77" y2="38" />
          <line x1="23" y1="66" x2="77" y2="66" />
        </g>
      </g>
      <path d="M32 14c-5 0-9 4-9 9 0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9z" fill="#CB6259" />
      <circle cx="32" cy="23" r="3.4" fill="#fff" />
      <path d="M78 33c-4.5 0-8 3.5-8 8 0 6 8 13.5 8 13.5s8-7.5 8-13.5c0-4.5-3.5-8-8-8z" fill="#CB6259" />
      <circle cx="78" cy="41" r="3" fill="#fff" />
      <path d="M55 62c-4.5 0-8 3.5-8 8 0 6 8 13.5 8 13.5s8-7.5 8-13.5c0-4.5-3.5-8-8-8z" fill="#CB6259" />
      <circle cx="55" cy="70" r="3" fill="#fff" />
    </svg>
  );
}
