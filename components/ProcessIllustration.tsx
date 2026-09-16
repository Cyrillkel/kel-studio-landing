const MUTED = "rgba(255,255,255,0.22)";
const DARK = "#0a0a0a";

// Stroked shapes marked data-draw are drawn in with DrawSVG, data-pop shapes
// scale in afterwards - see Process.tsx.
function Brief({ grad }: { grad: string }) {
  return (
    <>
      <rect data-draw x="78" y="22" width="130" height="156" rx="12" />
      <line data-draw x1="100" y1="50" x2="170" y2="50" strokeWidth={4} />
      {[82, 112, 142].map((y, i) => (
        <g key={y}>
          <rect data-draw x="100" y={y - 8} width="16" height="16" rx="4" stroke={MUTED} />
          <path data-draw d={`M104 ${y} l4 4 l7 -8`} />
          <line data-draw x1="126" y1={y} x2={186 - i * 14} y2={y} stroke={MUTED} />
        </g>
      ))}
      <circle data-pop cx="222" cy="120" r="24" fill={grad} fillOpacity={0.14} stroke="none" />
      <circle data-draw cx="222" cy="120" r="30" fill={DARK} fillOpacity={0.6} />
      <line data-draw x1="244" y1="142" x2="268" y2="166" strokeWidth={6} />
      <circle data-pop cx="58" cy="58" r="3" fill={grad} stroke="none" />
      <circle data-pop cx="268" cy="46" r="2.5" fill={grad} stroke="none" />
    </>
  );
}

function Prototype({ grad }: { grad: string }) {
  return (
    <>
      <rect data-draw x="40" y="22" width="240" height="156" rx="12" />
      <line data-draw x1="40" y1="46" x2="280" y2="46" stroke={MUTED} />
      {[56, 68, 80].map((cx) => (
        <circle key={cx} data-pop cx={cx} cy="34" r="3" fill={MUTED} stroke="none" />
      ))}
      <rect data-draw x="58" y="60" width="204" height="44" rx="6" />
      <line data-draw x1="74" y1="76" x2="160" y2="76" stroke={MUTED} strokeWidth={4} />
      <line data-draw x1="74" y1="90" x2="124" y2="90" stroke={MUTED} />
      {[58, 128, 198].map((x) => (
        <rect key={x} data-draw x={x} y="116" width="64" height="46" rx="6" stroke={MUTED} />
      ))}
      <path
        data-pop
        d="M222 126 L222 160 L231 151 L237 165 L244 162 L238 148 L250 148 Z"
        fill={DARK}
        stroke={grad}
      />
    </>
  );
}

function Design({ grad }: { grad: string }) {
  return (
    <>
      <line data-draw x1="44" y1="160" x2="96" y2="40" stroke={MUTED} />
      <line data-draw x1="276" y1="140" x2="204" y2="40" stroke={MUTED} />
      <path data-draw d="M44 160 C 96 40, 204 40, 276 140" strokeWidth={3} />
      <circle data-pop cx="96" cy="40" r="5" fill={DARK} />
      <circle data-pop cx="204" cy="40" r="5" fill={DARK} />
      <circle data-pop cx="152.5" cy="67.5" r="4" fill="#ffffff" stroke="none" />
      <rect data-pop x="38" y="154" width="12" height="12" rx="2" fill={grad} stroke="none" />
      <rect data-pop x="270" y="134" width="12" height="12" rx="2" fill={grad} stroke="none" />
      <circle data-pop cx="130" cy="170" r="11" fill="#22d3ee" fillOpacity={0.85} stroke="none" />
      <circle data-pop cx="160" cy="170" r="11" fill="#a78bfa" fillOpacity={0.85} stroke="none" />
      <circle data-pop cx="190" cy="170" r="11" fill="#e879f9" fillOpacity={0.85} stroke="none" />
    </>
  );
}

function Development({ grad }: { grad: string }) {
  return (
    <>
      <rect data-draw x="40" y="22" width="240" height="156" rx="12" />
      <line data-draw x1="40" y1="46" x2="280" y2="46" stroke={MUTED} />
      {[56, 68, 80].map((cx) => (
        <circle key={cx} data-pop cx={cx} cy="34" r="3" fill={MUTED} stroke="none" />
      ))}
      <line data-draw x1="60" y1="66" x2="106" y2="66" strokeWidth={3} />
      <line data-draw x1="116" y1="66" x2="150" y2="66" stroke={MUTED} strokeWidth={3} />
      <line data-draw x1="76" y1="84" x2="140" y2="84" stroke={MUTED} strokeWidth={3} />
      <line data-draw x1="76" y1="102" x2="116" y2="102" strokeWidth={3} />
      <line data-draw x1="126" y1="102" x2="168" y2="102" stroke={MUTED} strokeWidth={3} />
      <line data-draw x1="92" y1="120" x2="150" y2="120" stroke={MUTED} strokeWidth={3} />
      <line data-draw x1="76" y1="138" x2="104" y2="138" strokeWidth={3} />
      <line data-draw x1="60" y1="156" x2="94" y2="156" stroke={MUTED} strokeWidth={3} />
      <rect data-pop x="102" y="148" width="3" height="16" rx="1" fill={grad} stroke="none" />
      <path data-draw d="M214 84 L194 104 L214 124" strokeWidth={3} />
      <path data-draw d="M246 84 L266 104 L246 124" strokeWidth={3} />
      <line data-draw x1="237" y1="78" x2="223" y2="130" strokeWidth={3} />
    </>
  );
}

function Launch({ grad }: { grad: string }) {
  return (
    <>
      <line data-draw x1="120" y1="150" x2="120" y2="176" stroke={MUTED} />
      <line data-draw x1="200" y1="150" x2="200" y2="172" stroke={MUTED} />
      <line data-draw x1="160" y1="178" x2="160" y2="194" stroke={MUTED} />
      <path data-pop d="M149 132 Q160 176 171 132 Z" fill={grad} fillOpacity={0.9} stroke="none" />
      <path data-draw d="M146 118 L150 130 L170 130 L174 118" stroke={MUTED} />
      <path data-draw d="M136 96 L116 128 L136 122" />
      <path data-draw d="M184 96 L204 128 L184 122" />
      <path data-draw d="M160 26 C 182 44 190 76 186 118 L 134 118 C 130 76 138 44 160 26 Z" fill={DARK} />
      <circle data-draw cx="160" cy="70" r="11" />
      <circle data-draw cx="250" cy="62" r="20" />
      <path data-draw d="M241 62 l6 6 l12 -13" strokeWidth={3} />
      <circle data-pop cx="70" cy="50" r="2.5" fill="#ffffff" fillOpacity={0.6} stroke="none" />
      <circle data-pop cx="92" cy="120" r="2" fill="#ffffff" fillOpacity={0.5} stroke="none" />
      <circle data-pop cx="238" cy="140" r="2.5" fill="#ffffff" fillOpacity={0.6} stroke="none" />
      <circle data-pop cx="60" cy="150" r="1.8" fill="#ffffff" fillOpacity={0.5} stroke="none" />
    </>
  );
}

function Growth() {
  return (
    <>
      <path data-draw d="M52 28 V 170 H 284" stroke={MUTED} />
      <rect data-draw x="76" y="134" width="26" height="36" rx="4" stroke={MUTED} />
      <rect data-draw x="122" y="112" width="26" height="58" rx="4" stroke={MUTED} />
      <rect data-draw x="168" y="120" width="26" height="50" rx="4" stroke={MUTED} />
      <rect data-draw x="214" y="82" width="26" height="88" rx="4" stroke={MUTED} />
      <polyline data-draw points="70,120 116,100 162,106 210,66 262,40" strokeWidth={3} />
      <path data-draw d="M244.6 40.9 L262 40 L250.8 53.5" strokeWidth={3} />
      {[
        [116, 100],
        [162, 106],
        [210, 66],
      ].map(([cx, cy]) => (
        <circle key={cx} data-pop cx={cx} cy={cy} r="4.5" fill={DARK} />
      ))}
    </>
  );
}

const SCENES: Array<(props: { grad: string }) => React.JSX.Element> = [
  Brief,
  Prototype,
  Design,
  Development,
  Launch,
  Growth,
];

export default function ProcessIllustration({ index }: { index: number }) {
  const Scene = SCENES[index % SCENES.length];
  // Unique per step so the six inline SVGs don't share one gradient id.
  const gradientId = `process-gradient-${index}`;
  const grad = `url(#${gradientId})`;

  return (
    <svg
      viewBox="0 0 320 200"
      className="process-illus relative h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* userSpaceOnUse: with the default bounding-box units, straight
            horizontal/vertical lines have a zero-size box and lose the stroke. */}
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="320"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={grad}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Scene grad={grad} />
      </g>
    </svg>
  );
}
