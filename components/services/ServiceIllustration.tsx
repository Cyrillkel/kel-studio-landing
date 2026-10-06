import type { ServiceSlug } from "@/lib/services";


// Same vocabulary as the Process scenes: data-draw strokes are drawn in,
// data-pop shapes scale in afterwards, data-float drifts for as long as the
// page is open - see ServicePage.tsx.
type SceneProps = { grad: string };

function Landing({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="86" y="18" width="148" height="184" rx="16" />
      <rect data-draw x="104" y="44" width="112" height="46" rx="8" className="stroke-white/22" />
      <line data-draw x1="118" y1="62" x2="196" y2="62" strokeWidth={4} />
      <line data-draw x1="118" y1="76" x2="170" y2="76" className="stroke-white/22" />
      <rect data-pop x="118" y="108" width="84" height="26" rx="13" fill={grad} fillOpacity={0.18} stroke="none" />
      <rect data-draw x="118" y="108" width="84" height="26" rx="13" />
      <line data-draw x1="104" y1="156" x2="216" y2="156" className="stroke-white/22" />
      <line data-draw x1="104" y1="174" x2="182" y2="174" className="stroke-white/22" />
      <g data-float>
        <path data-draw d="M196 150 l0 30 l8 -9 l6 13 l7 -4 l-7 -12 l11 -2 Z" className="fill-page" />
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
      <line data-draw x1="160" y1="60" x2="160" y2="82" className="stroke-white/22" />
      <line data-draw x1="60" y1="82" x2="260" y2="82" className="stroke-white/22" />
      {[60, 160, 260].map((x) => (
        <line key={x} data-draw x1={x} y1="82" x2={x} y2="104" className="stroke-white/22" />
      ))}
      {[16, 116, 216].map((x, i) => (
        <g key={x}>
          <rect data-draw x={x} y="104" width="88" height="62" rx="10" />
          <line data-draw x1={x + 16} y1="126" x2={x + 60 - i * 6} y2="126" strokeWidth={3} />
          <line data-draw x1={x + 16} y1="142" x2={x + 72} y2="142" className="stroke-white/22" />
        </g>
      ))}
      <rect data-pop x="132" y="28" width="56" height="18" rx="9" fill={grad} fillOpacity={0.2} stroke="none" />
      <circle data-pop cx="160" cy="192" r="5" fill={grad} stroke="none" />
      <line data-draw x1="88" y1="192" x2="232" y2="192" className="stroke-white/22" />
    </>
  );
}

function Ecommerce({ grad }: SceneProps) {
  return (
    <>
      <path data-draw d="M64 62 l14 -30 h164 l14 30" />
      <path data-draw d="M64 62 q16 20 32 0 q16 20 32 0 q16 20 32 0 q16 20 32 0 q16 20 32 0" className="stroke-white/22" />
      <rect data-draw x="72" y="72" width="176" height="118" rx="12" />
      <rect data-draw x="96" y="102" width="56" height="56" rx="10" className="stroke-white/22" />
      <path data-draw d="M110 132 l12 -14 l10 12 l8 -8 l8 10" />
      <g data-float>
        <path data-draw d="M176 108 h12 l10 44 h44" />
        <circle data-draw cx="198" cy="166" r="7" className="fill-page" />
        <circle data-draw cx="226" cy="166" r="7" className="fill-page" />
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
      <line data-draw x1="92" y1="24" x2="92" y2="196" className="stroke-white/22" />
      <line data-draw x1="24" y1="58" x2="296" y2="58" className="stroke-white/22" />
      {[80, 104, 128, 152].map((y) => (
        <line key={y} data-draw x1="44" y1={y} x2="72" y2={y} className="stroke-white/22" />
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
      <rect data-draw x="236" y="104" width="44" height="22" rx="11" className="stroke-white/22" />
      <circle data-draw cx="269" cy="115" r="7" className="fill-page" />
    </>
  );
}

function Seo({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="28" y="36" width="264" height="148" rx="14" className="stroke-white/22" />
      <line data-draw x1="56" y1="156" x2="268" y2="156" className="stroke-white/22" />
      <line data-draw x1="56" y1="60" x2="56" y2="156" className="stroke-white/22" />
      <path data-draw d="M56 148 l44 -20 l40 -30 l44 -34 l52 -18" />
      {[100, 140, 184, 236].map((x, i) => (
        <circle key={x} data-pop cx={x} cy={[128, 98, 64, 46][i]} r="5" fill={grad} stroke="none" />
      ))}
      <g data-float>
        <circle data-draw cx="196" cy="106" r="38" className="fill-page" fillOpacity={0.7} />
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
      <line data-draw x1="20" y1="70" x2="132" y2="70" className="stroke-white/22" />
      {[92, 114, 136, 158].map((y) => (
        <g key={y}>
          <line data-draw x1="36" y1={y} x2="72" y2={y} className="stroke-white/22" />
          <line data-draw x1="84" y1={y} x2="116" y2={y} className="stroke-white/22" />
        </g>
      ))}
      <g data-float>
        <path data-draw d="M140 90 h44 l-10 -10 m10 10 l-10 10" />
        <path data-draw d="M140 130 h44 l-10 -10 m10 10 l-10 10" className="stroke-white/22" />
      </g>
      <ellipse data-draw cx="244" cy="70" rx="44" ry="16" />
      <path data-draw d="M200 70 v80 q0 16 44 16 q44 0 44 -16 V70" />
      <path data-draw d="M200 110 q0 16 44 16 q44 0 44 -16" className="stroke-white/22" />
      <rect data-pop x="212" y="176" width="64" height="16" rx="8" fill={grad} fillOpacity={0.22} stroke="none" />
    </>
  );
}

function Vizitka({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="74" y="32" width="210" height="116" rx="14" className="stroke-white/22" />
      <rect data-draw x="44" y="58" width="220" height="120" rx="14" className="fill-page" />
      <circle data-draw cx="92" cy="104" r="22" />
      <circle data-pop cx="92" cy="104" r="9" fill={grad} stroke="none" />
      <line data-draw x1="132" y1="90" x2="236" y2="90" strokeWidth={4} />
      <line data-draw x1="132" y1="106" x2="196" y2="106" className="stroke-white/22" />
      <line data-draw x1="76" y1="140" x2="140" y2="140" className="stroke-white/22" />
      <line data-draw x1="76" y1="156" x2="168" y2="156" className="stroke-white/22" />
      <rect data-pop x="196" y="132" width="52" height="24" rx="12" fill={grad} fillOpacity={0.22} stroke="none" />
      <g data-float>
        <circle data-pop cx="270" cy="52" r="6" fill={grad} stroke="none" />
      </g>
    </>
  );
}

function Wordpress({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="24" y="24" width="272" height="172" rx="14" />
      <line data-draw x1="24" y1="54" x2="296" y2="54" className="stroke-white/22" />
      <circle data-draw cx="42" cy="39" r="4" className="stroke-white/22" />
      <circle data-draw cx="58" cy="39" r="4" className="stroke-white/22" />
      <line data-draw x1="92" y1="54" x2="92" y2="196" className="stroke-white/22" />
      {[78, 100, 122, 144].map((y) => (
        <line key={y} data-draw x1="40" y1={y} x2="76" y2={y} className="stroke-white/22" />
      ))}
      <rect data-pop x="36" y="70" width="44" height="16" rx="8" fill={grad} fillOpacity={0.22} stroke="none" />
      <rect data-draw x="112" y="72" width="164" height="42" rx="8" />
      <line data-draw x1="126" y1="88" x2="214" y2="88" strokeWidth={4} />
      <line data-draw x1="126" y1="102" x2="184" y2="102" className="stroke-white/22" />
      <rect data-draw x="112" y="128" width="76" height="52" rx="8" className="stroke-white/22" />
      <rect data-draw x="200" y="128" width="76" height="52" rx="8" className="stroke-white/22" />
      <g data-float>
        <circle data-draw cx="264" cy="40" r="13" className="fill-page" />
        <path data-draw d="M264 33 v14 M257 40 h14" />
      </g>
      <circle data-pop cx="244" cy="154" r="6" fill={grad} stroke="none" />
    </>
  );
}

function Design({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="44" y="26" width="196" height="132" rx="10" className="stroke-white/22" />
      <path data-draw d="M64 138 C88 40, 148 40, 168 90 S214 124, 222 60" />
      <line data-draw x1="64" y1="138" x2="88" y2="64" className="stroke-white/22" strokeDasharray="4 4" />
      <line data-draw x1="222" y1="60" x2="198" y2="124" className="stroke-white/22" strokeDasharray="4 4" />
      <rect data-pop x="58" y="132" width="12" height="12" rx="3" fill={grad} stroke="none" />
      <rect data-pop x="216" y="54" width="12" height="12" rx="3" fill={grad} stroke="none" />
      <circle data-pop cx="168" cy="90" r="5" fill={grad} stroke="none" />
      {[70, 108, 146].map((x, i) => (
        <circle key={x} data-pop cx={x} cy="190" r="12" fill={grad} fillOpacity={0.2 + i * 0.12} stroke="none" />
      ))}
      <g data-float>
        <path data-draw d="M250 118 l22 -22 l18 18 l-22 22 l-26 6 z" className="fill-page" />
        <line data-draw x1="268" y1="100" x2="286" y2="118" className="stroke-white/22" />
      </g>
    </>
  );
}

function SeoAudit({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="70" y="26" width="140" height="172" rx="14" />
      <rect data-draw x="110" y="14" width="60" height="22" rx="8" className="fill-page" />
      {[68, 98, 128, 158].map((y, i) => (
        <g key={y}>
          <circle data-draw cx="98" cy={y} r="9" className={i === 2 ? "stroke-white/22" : undefined} />
          {i === 2 ? (
            <path data-draw d={`M94 ${y - 4} l8 8 M102 ${y - 4} l-8 8`} className="stroke-white/22" />
          ) : (
            <path data-draw d={`M93 ${y} l4 4 l8 -9`} />
          )}
          <line data-draw x1="120" y1={y} x2={188 - i * 8} y2={y} className="stroke-white/22" />
        </g>
      ))}
      <rect data-pop x="86" y="116" width="116" height="24" rx="12" fill={grad} fillOpacity={0.16} stroke="none" />
      <g data-float>
        <circle data-draw cx="224" cy="148" r="34" className="fill-page" fillOpacity={0.75} />
        <line data-draw x1="248" y1="172" x2="272" y2="196" strokeWidth={6} />
        <path data-draw d="M210 148 h10 l6 -14 l8 28 l6 -14 h8" />
      </g>
      <circle data-pop cx="258" cy="46" r="5" fill={grad} stroke="none" />
    </>
  );
}

function YandexDirect({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="28" y="30" width="176" height="62" rx="12" />
      <rect data-pop x="42" y="42" width="46" height="16" rx="8" fill={grad} fillOpacity={0.25} stroke="none" />
      <line data-draw x1="98" y1="50" x2="182" y2="50" className="stroke-white/22" />
      <line data-draw x1="42" y1="70" x2="170" y2="70" strokeWidth={4} />
      <line data-draw x1="42" y1="82" x2="120" y2="82" className="stroke-white/22" />
      <rect data-draw x="28" y="104" width="176" height="40" rx="12" className="stroke-white/22" />
      <line data-draw x1="42" y1="124" x2="150" y2="124" className="stroke-white/22" />
      <rect data-draw x="28" y="156" width="176" height="40" rx="12" className="stroke-white/22" />
      <line data-draw x1="42" y1="176" x2="130" y2="176" className="stroke-white/22" />
      {[
        { x: 226, h: 40 },
        { x: 250, h: 70 },
        { x: 274, h: 104 },
      ].map(({ x, h }) => (
        <rect key={x} data-pop x={x} y={196 - h} width="18" height={h} rx="6" fill={grad} fillOpacity={0.28} stroke="none" />
      ))}
      <path data-draw d="M222 120 l26 -22 l22 12 l24 -40" />
      <g data-float>
        <path data-draw d="M158 92 l0 34 l9 -9 l7 15 l8 -4 l-7 -14 l12 -2 Z" className="fill-page" />
        <circle data-draw cx="158" cy="92" r="14" className="stroke-white/22" />
      </g>
    </>
  );
}

function GoogleAds({ grad }: SceneProps) {
  return (
    <>
      <circle data-draw cx="100" cy="116" r="66" />
      <ellipse data-draw cx="100" cy="116" rx="28" ry="66" className="stroke-white/22" />
      <line data-draw x1="34" y1="116" x2="166" y2="116" className="stroke-white/22" />
      <path data-draw d="M46 82 q54 20 108 0 M46 150 q54 -20 108 0" className="stroke-white/22" />
      <circle data-pop cx="76" cy="92" r="5" fill={grad} stroke="none" />
      <circle data-pop cx="124" cy="140" r="5" fill={grad} stroke="none" />
      <circle data-pop cx="66" cy="132" r="4" fill={grad} stroke="none" />
      <rect data-draw x="146" y="24" width="150" height="34" rx="17" className="fill-page" />
      <circle data-draw cx="168" cy="41" r="8" />
      <line data-draw x1="174" y1="47" x2="180" y2="53" />
      <line data-draw x1="194" y1="41" x2="268" y2="41" className="stroke-white/22" />
      <rect data-draw x="146" y="72" width="150" height="70" rx="12" className="fill-page" />
      <rect data-pop x="158" y="84" width="32" height="14" rx="7" fill={grad} fillOpacity={0.3} stroke="none" />
      <line data-draw x1="198" y1="91" x2="276" y2="91" className="stroke-white/22" />
      <line data-draw x1="158" y1="110" x2="274" y2="110" strokeWidth={4} />
      <line data-draw x1="158" y1="124" x2="230" y2="124" className="stroke-white/22" />
      {[
        { x: 166, h: 20 },
        { x: 192, h: 34 },
        { x: 218, h: 50 },
      ].map(({ x, h }) => (
        <rect key={x} data-pop x={x} y={202 - h} width="16" height={h} rx="5" fill={grad} fillOpacity={0.28} stroke="none" />
      ))}
      <path data-draw d="M164 170 l28 -14 l26 8 l30 -26" className="stroke-white/22" />
      <g data-float>
        <path data-draw d="M250 116 l0 30 l9 -9 l7 15 l8 -4 l-7 -14 l12 -2 Z" className="fill-page" />
      </g>
    </>
  );
}

function VkAds({ grad }: SceneProps) {
  return (
    <>
      <circle data-draw cx="102" cy="112" r="68" className="stroke-white/22" />
      <circle data-draw cx="102" cy="112" r="46" />
      <circle data-draw cx="102" cy="112" r="24" className="stroke-white/22" />
      <circle data-pop cx="102" cy="112" r="9" fill={grad} stroke="none" />
      <path data-draw d="M102 34 v-12 M102 190 v12 M24 112 h-12 M180 112 h12" className="stroke-white/22" />
      {[
        { x: 60, y: 68 },
        { x: 138, y: 66 },
        { x: 54, y: 142 },
        { x: 146, y: 150 },
      ].map(({ x, y }) => (
        <circle key={`${x}-${y}`} data-pop cx={x} cy={y} r="5" fill={grad} stroke="none" />
      ))}
      <rect data-draw x="204" y="36" width="96" height="148" rx="14" className="fill-page" />
      <circle data-draw cx="222" cy="56" r="7" className="stroke-white/22" />
      <line data-draw x1="236" y1="54" x2="284" y2="54" className="stroke-white/22" />
      <rect data-draw x="216" y="72" width="72" height="46" rx="8" />
      <rect data-pop x="216" y="72" width="72" height="46" rx="8" fill={grad} fillOpacity={0.18} stroke="none" />
      <path data-draw d="M224 108 l14 -16 l10 10 l10 -12 l14 18" className="stroke-white/22" />
      <line data-draw x1="216" y1="134" x2="282" y2="134" strokeWidth={4} />
      <line data-draw x1="216" y1="146" x2="260" y2="146" className="stroke-white/22" />
      <rect data-pop x="216" y="158" width="46" height="14" rx="7" fill={grad} fillOpacity={0.3} stroke="none" />
      <g data-float>
        <path data-draw d="M184 52 L112 106" />
        <path data-draw d="M112 106 l11 -2 M112 106 l3 -12" />
      </g>
    </>
  );
}

function TelegramAds({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="24" y="22" width="190" height="52" rx="12" className="stroke-white/22" />
      <circle data-draw cx="46" cy="48" r="10" className="stroke-white/22" />
      <line data-draw x1="66" y1="42" x2="186" y2="42" className="stroke-white/22" />
      <line data-draw x1="66" y1="56" x2="150" y2="56" className="stroke-white/22" />
      <rect data-draw x="24" y="86" width="190" height="64" rx="12" />
      <rect data-pop x="24" y="86" width="190" height="64" rx="12" fill={grad} fillOpacity={0.12} stroke="none" />
      <rect data-pop x="38" y="98" width="36" height="14" rx="7" fill={grad} fillOpacity={0.35} stroke="none" />
      <line data-draw x1="38" y1="124" x2="190" y2="124" strokeWidth={4} />
      <line data-draw x1="38" y1="137" x2="132" y2="137" className="stroke-white/22" />
      <rect data-draw x="24" y="162" width="190" height="40" rx="12" className="stroke-white/22" />
      <circle data-draw cx="46" cy="182" r="10" className="stroke-white/22" />
      <line data-draw x1="66" y1="182" x2="170" y2="182" className="stroke-white/22" />
      <path data-draw d="M234 128 q22 -16 44 0 M226 140 q30 -26 60 0" className="stroke-white/22" />
      <g data-float>
        <path data-draw d="M240 78 L298 44 L282 104 L266 88 Z" className="fill-page" />
        <path data-draw d="M266 88 L298 44" className="stroke-white/22" />
        <path data-draw d="M222 104 C230 94, 236 88, 246 82" className="stroke-white/22" strokeDasharray="4 5" />
      </g>
      {[
        { x: 248, y: 164 },
        { x: 276, y: 178 },
        { x: 254, y: 196 },
      ].map(({ x, y }) => (
        <circle key={`${x}-${y}`} data-pop cx={x} cy={y} r="6" fill={grad} stroke="none" />
      ))}
    </>
  );
}

function YandexMaps({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="24" y="24" width="272" height="172" rx="16" />
      <path data-draw d="M24 150 C90 120, 130 170, 200 140 S270 120, 296 130" className="stroke-white/22" />
      <path data-draw d="M110 24 C100 80, 140 100, 130 196" className="stroke-white/22" />
      <path data-draw d="M52 176 C70 150, 96 140, 120 120 S160 96, 190 96" strokeDasharray="6 6" />
      <circle data-pop cx="52" cy="176" r="6" fill={grad} stroke="none" />
      <g data-float>
        <path data-draw d="M214 134 C194 110, 182 96, 182 82 a32 32 0 0 1 64 0 c0 14 -12 28 -32 52 z" className="fill-page" />
        <circle data-pop cx="214" cy="82" r="11" fill={grad} stroke="none" />
      </g>
      <rect data-draw x="196" y="154" width="84" height="28" rx="14" className="fill-page" />
      {[210, 224, 238, 252, 266].map((x) => (
        <circle key={x} data-pop cx={x} cy="168" r="3.5" fill={grad} stroke="none" />
      ))}
    </>
  );
}

function ReactNext({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="24" y="24" width="272" height="172" rx="14" />
      <line data-draw x1="24" y1="52" x2="296" y2="52" className="stroke-white/22" />
      <circle data-draw cx="42" cy="38" r="4" className="stroke-white/22" />
      <circle data-draw cx="58" cy="38" r="4" className="stroke-white/22" />
      {[
        { y: 76, w: 70 },
        { y: 96, w: 92 },
        { y: 116, w: 56 },
        { y: 136, w: 80 },
        { y: 156, w: 64 },
      ].map(({ y, w }, i) => (
        <line key={y} data-draw x1={i % 2 === 0 ? 44 : 58} y1={y} x2={(i % 2 === 0 ? 44 : 58) + w} y2={y} className="stroke-white/22" />
      ))}
      <line data-draw x1="168" y1="62" x2="168" y2="186" className="stroke-white/22" />
      <rect data-draw x="196" y="70" width="64" height="26" rx="8" />
      <rect data-pop x="196" y="70" width="64" height="26" rx="8" fill={grad} fillOpacity={0.2} stroke="none" />
      <path data-draw d="M228 96 v14 M228 110 h-30 v14 M228 110 h30 v14" className="stroke-white/22" />
      <rect data-draw x="180" y="124" width="36" height="24" rx="8" />
      <rect data-draw x="240" y="124" width="36" height="24" rx="8" />
      <g data-float>
        <path data-draw d="M224 168 l-8 8 l8 8 M244 168 l8 8 l-8 8" />
      </g>
    </>
  );
}

function TelegramBots({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="96" y="12" width="128" height="196" rx="22" />
      <line data-draw x1="136" y1="26" x2="184" y2="26" className="stroke-white/22" />
      <rect data-draw x="112" y="46" width="74" height="28" rx="12" />
      <line data-draw x1="124" y1="60" x2="172" y2="60" className="stroke-white/22" />
      <rect data-pop x="132" y="84" width="76" height="28" rx="12" fill={grad} fillOpacity={0.24} stroke="none" />
      <rect data-draw x="132" y="84" width="76" height="28" rx="12" />
      <rect data-draw x="112" y="122" width="58" height="28" rx="12" />
      {[126, 140, 154].map((x) => (
        <circle key={x} data-pop cx={x} cy="136" r="3" fill={grad} stroke="none" />
      ))}
      <rect data-draw x="112" y="172" width="96" height="22" rx="11" className="stroke-white/22" />
      <g data-float>
        <rect data-draw x="246" y="84" width="48" height="38" rx="12" className="fill-page" />
        <circle data-pop cx="260" cy="103" r="4" fill={grad} stroke="none" />
        <circle data-pop cx="280" cy="103" r="4" fill={grad} stroke="none" />
        <line data-draw x1="270" y1="84" x2="270" y2="70" />
        <circle data-draw cx="270" cy="66" r="4" />
        <line data-draw x1="236" y1="98" x2="224" y2="98" className="stroke-white/22" strokeDasharray="3 4" />
      </g>
    </>
  );
}

function MiniApps({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="104" y="12" width="112" height="196" rx="22" />
      <line data-draw x1="136" y1="26" x2="184" y2="26" className="stroke-white/22" />
      <line data-draw x1="122" y1="48" x2="170" y2="48" strokeWidth={4} />
      {[
        { x: 120, y: 64 },
        { x: 168, y: 64 },
        { x: 120, y: 118 },
        { x: 168, y: 118 },
      ].map(({ x, y }, i) => (
        <g key={`${x}-${y}`}>
          <rect data-draw x={x} y={y} width="40" height="44" rx="8" className={i === 1 ? undefined : "stroke-white/22"} />
          {i === 1 && <rect data-pop x={x} y={y} width="40" height="44" rx="8" fill={grad} fillOpacity={0.22} stroke="none" />}
          <line data-draw x1={x + 8} y1={y + 32} x2={x + 28} y2={y + 32} className="stroke-white/22" />
        </g>
      ))}
      <rect data-pop x="120" y="174" width="88" height="22" rx="11" fill={grad} fillOpacity={0.3} stroke="none" />
      <rect data-draw x="120" y="174" width="88" height="22" rx="11" />
      <g data-float>
        <rect data-draw x="38" y="76" width="52" height="40" rx="10" className="fill-page" />
        <path data-draw d="M48 104 l10 -12 l8 8 l12 -16" />
        <circle data-pop cx="250" cy="70" r="7" fill={grad} stroke="none" />
        <circle data-draw cx="250" cy="70" r="16" className="stroke-white/22" />
      </g>
    </>
  );
}

function Web3({ grad }: SceneProps) {
  return (
    <>
      <path data-draw d="M160 64 l40 22 v46 l-40 22 l-40 -22 v-46 z" />
      <path data-draw d="M160 108 l40 -22 M160 108 l-40 -22 M160 108 v46" className="stroke-white/22" />
      <path data-pop d="M160 64 l40 22 l-40 22 l-40 -22 z" fill={grad} fillOpacity={0.22} stroke="none" />
      <path data-draw d="M62 96 l24 14 v28 l-24 14 l-24 -14 v-28 z" />
      <path data-draw d="M258 96 l24 14 v28 l-24 14 l-24 -14 v-28 z" />
      <line data-draw x1="86" y1="124" x2="120" y2="110" className="stroke-white/22" strokeDasharray="4 4" />
      <line data-draw x1="234" y1="124" x2="200" y2="110" className="stroke-white/22" strokeDasharray="4 4" />
      <g data-float>
        <circle data-draw cx="160" cy="30" r="14" className="fill-page" />
        <path data-draw d="M154 30 h12 M160 24 v12" />
      </g>
      <circle data-pop cx="62" cy="124" r="5" fill={grad} stroke="none" />
      <circle data-pop cx="258" cy="124" r="5" fill={grad} stroke="none" />
      <line data-draw x1="60" y1="196" x2="260" y2="196" className="stroke-white/22" />
      <circle data-pop cx="160" cy="196" r="5" fill={grad} stroke="none" />
    </>
  );
}

function Support({ grad }: SceneProps) {
  return (
    <>
      <path data-draw d="M160 22 l62 22 v54 c0 40 -26 68 -62 88 c-36 -20 -62 -48 -62 -88 v-54 z" />
      <path data-pop d="M160 22 l62 22 v54 c0 40 -26 68 -62 88 z" fill={grad} fillOpacity={0.14} stroke="none" />
      <path data-draw d="M132 100 l20 20 l36 -42" />
      <path data-draw d="M24 196 h72 l12 -24 l16 44 l14 -30 h30 l10 -14 l12 24 h28" className="stroke-white/22" />
      <g data-float>
        <circle data-draw cx="262" cy="60" r="14" className="fill-page" />
        {[0, 45, 90, 135].map((deg) => (
          <line key={deg} data-draw x1="262" y1="42" x2="262" y2="78" transform={`rotate(${deg} 262 60)`} className="stroke-white/22" />
        ))}
        <circle data-pop cx="262" cy="60" r="5" fill={grad} stroke="none" />
      </g>
      <circle data-pop cx="56" cy="64" r="5" fill={grad} stroke="none" />
    </>
  );
}

function AiAssistants({ grad }: SceneProps) {
  return (
    <>
      <rect data-draw x="62" y="18" width="196" height="184" rx="20" />
      <line data-draw x1="62" y1="52" x2="258" y2="52" className="stroke-white/22" />
      <circle data-pop cx="82" cy="35" r="5" fill={grad} stroke="none" />
      <line data-draw x1="96" y1="35" x2="140" y2="35" className="stroke-white/22" />
      <rect data-draw x="134" y="66" width="104" height="30" rx="12" />
      <line data-draw x1="148" y1="81" x2="214" y2="81" className="stroke-white/22" />
      <rect data-pop x="82" y="108" width="112" height="44" rx="12" fill={grad} fillOpacity={0.22} stroke="none" />
      <rect data-draw x="82" y="108" width="112" height="44" rx="12" />
      <line data-draw x1="96" y1="124" x2="178" y2="124" />
      <line data-draw x1="96" y1="138" x2="156" y2="138" className="stroke-white/22" />
      <rect data-draw x="78" y="168" width="164" height="22" rx="11" className="stroke-white/22" />
      <circle data-pop cx="228" cy="179" r="5" fill={grad} stroke="none" />
      <g data-float>
        <path data-draw d="M284 40 l5 13 l13 5 l-13 5 l-5 13 l-5 -13 l-13 -5 l13 -5 Z" className="fill-page" />
        <path data-draw d="M44 142 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" className="stroke-white/22" />
      </g>
    </>
  );
}

function McpServers({ grad }: SceneProps) {
  return (
    <>
      <circle data-pop cx="52" cy="110" r="26" fill={grad} fillOpacity={0.14} stroke="none" />
      <circle data-draw cx="52" cy="110" r="26" />
      <path data-draw d="M52 96 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 l9 -4 Z" />
      <line data-draw x1="78" y1="110" x2="118" y2="110" className="stroke-white/22" />
      <rect data-draw x="118" y="52" width="84" height="116" rx="14" />
      <line data-draw x1="118" y1="90" x2="202" y2="90" className="stroke-white/22" />
      <line data-draw x1="118" y1="130" x2="202" y2="130" className="stroke-white/22" />
      {[71, 110, 149].map((y, i) => (
        <g key={y}>
          <line data-draw x1="132" y1={y} x2={i === 1 ? 166 : 156} y2={y} className={i === 1 ? undefined : "stroke-white/22"} />
          <circle data-pop cx="186" cy={y} r="4" fill={grad} stroke="none" />
        </g>
      ))}
      <path data-draw d="M202 110 C222 110 222 56 244 56" className="stroke-white/22" />
      <path data-draw d="M202 110 H244" className="stroke-white/22" />
      <path data-draw d="M202 110 C222 110 222 164 244 164" className="stroke-white/22" />
      <rect data-draw x="244" y="36" width="48" height="40" rx="10" />
      <ellipse data-draw cx="268" cy="49" rx="11" ry="4" />
      <path data-draw d="M257 49 v12 a11 4 0 0 0 22 0 v-12" className="stroke-white/22" />
      <rect data-draw x="244" y="90" width="48" height="40" rx="10" />
      <line data-draw x1="256" y1="104" x2="280" y2="104" className="stroke-white/22" />
      <line data-draw x1="256" y1="116" x2="280" y2="116" className="stroke-white/22" />
      <line data-draw x1="268" y1="98" x2="268" y2="124" className="stroke-white/22" />
      <rect data-draw x="244" y="144" width="48" height="40" rx="10" />
      <path data-draw d="M261 154 l-7 10 l7 10 M275 154 l7 10 l-7 10" />
      <g data-float>
        <circle data-pop cx="98" cy="110" r="5" fill={grad} stroke="none" />
      </g>
    </>
  );
}

const SCENES: Record<ServiceSlug, (props: SceneProps) => React.ReactElement> = {
  landing: Landing,
  vizitka: Vizitka,
  corporate: Corporate,
  ecommerce: Ecommerce,
  wordpress: Wordpress,
  design: Design,
  seo: Seo,
  "seo-audit": SeoAudit,
  "yandex-direct": YandexDirect,
  "google-ads": GoogleAds,
  "vk-ads": VkAds,
  "telegram-ads": TelegramAds,
  "yandex-maps": YandexMaps,
  "web-apps": WebApps,
  "react-nextjs": ReactNext,
  "telegram-bots": TelegramBots,
  "telegram-mini-apps": MiniApps,
  web3: Web3,
  "ai-assistants": AiAssistants,
  "mcp-servers": McpServers,
  parsing: Parsing,
  support: Support,
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
          <stop offset="0" style={{ stopColor: "var(--brand-1)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--brand-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-3)" }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={grad} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Scene grad={grad} />
      </g>
    </svg>
  );
}
