// A Santa hat for the logo cube (lib/holiday.ts). It is drawn in the logo's own coordinates
// (lib/brand.ts: the top corner of the cube is at 71.4, -120) and sits on the top face,
// tipped a little to the side. It reaches above the logo's viewBox, so the <svg> around it
// needs overflow: visible; the header has room for it above the logo.
export default function SantaHat() {
  return (
    <g transform="rotate(-10 72 -108)">
      <path
        d="M30 -112C36 -146 60 -176 94 -178C116 -179 134 -168 141 -150C134 -152 126 -152 120 -147C114 -160 104 -163 98 -158C100 -142 106 -128 112 -116Z"
        fill="#e11d48"
      />
      {/* The shaded fold of the tip. */}
      <path
        d="M94 -178C116 -179 134 -168 141 -150C134 -152 126 -152 120 -147C114 -160 104 -163 98 -158C97 -166 96 -172 94 -178Z"
        fill="#be123c"
      />
      <rect x="18" y="-126" width="108" height="24" rx="12" fill="#f8fafc" />
      <path d="M22 -108Q72 -100 122 -108" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="140" cy="-148" r="13" fill="#f8fafc" />
    </g>
  );
}
