import type { ServiceSlug } from "@/lib/services";

const MUTED = "rgba(255,255,255,0.22)";
const DARK = "#0a0a0a";

// Same vocabulary as the Process scenes: data-draw strokes are drawn in,
// data-pop shapes scale in afterwards, data-float drifts for as long as the
// page is open - see ServicePage.tsx.
type SceneProps = { grad: string };

function Landing({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="86" y="18" width="148" height="184" rx="16" />
      <rect data-draw x="104" y="44" width="112" height="46" rx="8" stroke={MUTED} />
      <line data-draw x1="118" y1="62" x2="196" y2="62" strokeWidth={4} />
      <line data-draw x1="118" y1="76" x2="170" y2="76" stroke={MUTED} />
      <rect data-pop x="118" y="108" width="84" height="26" rx="13" fill={grad} fillOpacity={0.18} stroke="none" />
      <rect data-draw x="118" y="108" width="84" height="26" rx="13" />
      <line data-draw x1="104" y1="156" x2="216" y2="156" stroke={MUTED} />
      <line data-draw x1="104" y1="174" x2="182" y2="174" stroke={MUTED} />
      <g data-float>
        <path data-draw d="M196 150 l0 30 l8 -9 l6 13 l7 -4 l-7 -12 l11 -2 Z" fill={DARK} />
      </g>
      <circle data-pop cx="252" cy="60" r="6" fill={grad} stroke="none" />
      <circle data-pop cx="68" cy="140" r="4" fill={grad} stroke="none" />
    </>
  );
}

function Corporate({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="112" y="14" width="96" height="46" rx="10" />
      <line data-draw x1="160" y1="60" x2="160" y2="82" stroke={MUTED} />
      <line data-draw x1="60" y1="82" x2="260" y2="82" stroke={MUTED} />
      {[60, 160, 260].map((x) => (
        <line key={x} data-draw x1={x} y1="82" x2={x} y2="104" stroke={MUTED} />
      ))}
      {[16, 116, 216].map((x, i) => (
        <g key={x}>
          <rect data-draw x={x} y="104" width="88" height="62" rx="10" />
          <line data-draw x1={x + 16} y1="126" x2={x + 60 - i * 6} y2="126" strokeWidth={3} />
          <line data-draw x1={x + 16} y1="142" x2={x + 72} y2="142" stroke={MUTED} />
        </g>
      ))}
      <rect data-pop x="132" y="28" width="56" height="18" rx="9" fill={grad} fillOpacity={0.2} stroke="none" />
      <circle data-pop cx="160" cy="192" r="5" fill={grad} stroke="none" />
      <line data-draw x1="88" y1="192" x2="232" y2="192" stroke={MUTED} />
    </>
  );
}

function Ecommerce({ grad }: SceneProps) {
  return (
    <>
      <path data-draw d="M64 62 l14 -30 h164 l14 30" />
      <path data-draw d="M64 62 q16 20 32 0 q16 20 32 0 q16 20 32 0 q16 20 32 0 q16 20 32 0" stroke={MUTED} />
      <rect data-draw x="72" y="72" width="176" height="118" rx="12" />
      <rect data-draw x="96" y="102" width="56" height="56" rx="10" stroke={MUTED} />
      <path data-draw d="M110 132 l12 -14 l10 12 l8 -8 l8 10" />
      <g data-float>
        <path data-draw d="M176 108 h12 l10 44 h44" />
        <circle data-draw cx="198" cy="166" r="7" fill={DARK} />
        <circle data-draw cx="226" cy="166" r="7" fill={DARK} />
        <path data-pop d="M190 118 h46 l-6 26 h-34 Z" fill={grad} fillOpacity={0.2} stroke="none" />
      </g>
      <circle data-pop cx="252" cy="44" r="5" fill={grad} stroke="none" />
    </>
  );
}

function WebApps({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="24" y="24" width="272" height="172" rx="16" />
      <line data-draw x1="92" y1="24" x2="92" y2="196" stroke={MUTED} />
      <line data-draw x1="24" y1="58" x2="296" y2="58" stroke={MUTED} />
      {[80, 104, 128, 152].map((y) => (
        <line key={y} data-draw x1="44" y1={y} x2="72" y2={y} stroke={MUTED} />
      ))}
      <rect data-pop x="40" y="72" width="36" height="16" rx="8" fill={grad} fillOpacity={0.22} stroke="none" />
      {[
        { x: 120, h: 40 },
        { x: 152, h: 66 },
        { x: 184, h: 28 },
        { x: 216, h: 82 },
      ].map(({ x, h }) => (
        <rect key={x} data-pop x={x} y={168 - h} width="20" height={h} rx="6" fill={grad} fillOpacity={0.25} stroke="none" />
      ))}
      <path data-draw d="M120 132 l32 -26 l32 18 l32 -40" />
      <circle data-pop cx="248" cy="84" r="6" fill={grad} stroke="none" />
      <rect data-draw x="236" y="104" width="44" height="22" rx="11" stroke={MUTED} />
      <circle data-draw cx="269" cy="115" r="7" fill={DARK} />
    </>
  );
}

function Seo({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="28" y="36" width="264" height="148" rx="14" stroke={MUTED} />
      <line data-draw x1="56" y1="156" x2="268" y2="156" stroke={MUTED} />
      <line data-draw x1="56" y1="60" x2="56" y2="156" stroke={MUTED} />
      <path data-draw d="M56 148 l44 -20 l40 -30 l44 -34 l52 -18" />
      {[100, 140, 184, 236].map((x, i) => (
        <circle key={x} data-pop cx={x} cy={[128, 98, 64, 46][i]} r="5" fill={grad} stroke="none" />
      ))}
      <g data-float>
        <circle data-draw cx="196" cy="106" r="38" fill={DARK} fillOpacity={0.7} />
        <line data-draw x1="224" y1="134" x2="252" y2="162" strokeWidth={6} />
        <path data-draw d="M182 106 l10 10 l20 -22" />
      </g>
      <circle data-pop cx="268" cy="196" r="4" fill={grad} stroke="none" />
    </>
  );
}

function Parsing({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="20" y="40" width="112" height="140" rx="12" />
      <line data-draw x1="20" y1="70" x2="132" y2="70" stroke={MUTED} />
      {[92, 114, 136, 158].map((y) => (
        <g key={y}>
          <line data-draw x1="36" y1={y} x2="72" y2={y} stroke={MUTED} />
          <line data-draw x1="84" y1={y} x2="116" y2={y} stroke={MUTED} />
        </g>
      ))}
      <g data-float>
        <path data-draw d="M140 90 h44 l-10 -10 m10 10 l-10 10" />
        <path data-draw d="M140 130 h44 l-10 -10 m10 10 l-10 10" stroke={MUTED} />
      </g>
      <ellipse data-draw cx="244" cy="70" rx="44" ry="16" />
      <path data-draw d="M200 70 v80 q0 16 44 16 q44 0 44 -16 V70" />
      <path data-draw d="M200 110 q0 16 44 16 q44 0 44 -16" stroke={MUTED} />
      <rect data-pop x="212" y="176" width="64" height="16" rx="8" fill={grad} fillOpacity={0.22} stroke="none" />
    </>
  );
}

const SCENES: Record<ServiceSlug, (props: SceneProps) => React.ReactElement> = {
  landing: Landing,
  corporate: Corporate,
  ecommerce: Ecommerce,
  "web-apps": WebApps,
  seo: Seo,
  parsing: Parsing,
};

export default function ServiceIllustration({ slug }: { slug: ServiceSlug }) {
  const Scene = SCENES[slug];
  const gradientId = `service-gradient-${slug}`;
  const grad = `url(#${gradientId})`;

  return (
    <svg viewBox="0 0 320 220" className="service-illus h-full w-full" aria-hidden="true">
      <defs>
        {/* userSpaceOnUse: straight lines have a zero-size bounding box and
            would lose a bounding-box gradient stroke. */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="320" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={grad} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Scene grad={grad} />
      </g>
    </svg>
  );
}
