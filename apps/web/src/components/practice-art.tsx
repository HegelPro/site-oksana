export function PracticeArt({ variant = "01" }: { variant?: string }) {
  return (
    <svg viewBox="0 0 400 280" fill="none" aria-hidden="true" className="block h-full w-full">
      <circle cx="200" cy="140" r="102" stroke="currentColor" strokeOpacity=".18" />
      <circle
        cx="200"
        cy="140"
        r="84"
        stroke="currentColor"
        strokeOpacity=".15"
        strokeDasharray="2 8"
      />
      {variant === "01" ? (
        <g stroke="currentColor" strokeWidth="1.2">
          <path d="M200 200C135 163 143 109 200 65c57 44 65 98 0 135Z" />
          <path d="M200 200c-69-2-112-39-112-94 62-8 111 25 112 94Z" />
          <path d="M200 200c69-2 112-39 112-94-62-8-111 25-112 94Z" />
          <path d="M200 200c-60 24-105 10-128-24 38-29 85-26 128 24Zm0 0c60 24 105 10 128-24-38-29-85-26-128 24Z" />
        </g>
      ) : variant === "02" ? (
        <g stroke="currentColor" strokeWidth="1.2">
          <circle cx="200" cy="140" r="48" />
          <circle cx="200" cy="140" r="34" />
          <path d="M200 65v-19m0 188v-19m75-75h19m-188 0h19m128-53 14-14M133 207l14-14m106 0 14 14M133 73l14 14M229 71l7-18m-72 174 7-18m98-40 18 7M113 104l18 7m138 0 18-7M113 176l18-7m98 40 7 18M164 53l7 18" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.2">
          <ellipse cx="200" cy="140" rx="110" ry="47" transform="rotate(-35 200 140)" />
          <ellipse cx="200" cy="140" rx="110" ry="47" transform="rotate(35 200 140)" />
          <ellipse cx="200" cy="140" rx="47" ry="110" />
          <circle cx="200" cy="140" r="12" />
        </g>
      )}
    </svg>
  );
}
