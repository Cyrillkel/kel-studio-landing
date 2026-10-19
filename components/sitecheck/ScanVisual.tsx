// The picture of a check in progress: a browser window with the site's address
// and a sketch of a page, a beam running down it (globals.css, "The website
// check") and tags of what has been looked at, one more for each finished step
// of siteCheck.progress.steps. Drawn while the check runs on the page and in the
// curtain that opens from the home page (components/LaunchCurtain.tsx).

// In the order of the steps; x and y place the tag over the sketch.
const TAGS = [
  { label: "200 OK", x: "5%", y: "4%" },
  { label: "SSL", x: "70%", y: "3%" },
  { label: "WHOIS", x: "76%", y: "33%" },
  { label: "robots.txt", x: "3%", y: "36%" },
  { label: "301", x: "56%", y: "52%" },
  { label: "title · H1", x: "34%", y: "19%" },
  { label: "HSTS", x: "68%", y: "74%" },
  { label: "SPF · DMARC", x: "6%", y: "77%" },
];

export const SCAN_TAG_COUNT = TAGS.length;

function Sketch({ lit = false }: { lit?: boolean }) {
  const block = lit ? "bg-violet-300/45" : "bg-white/[0.07]";
  const soft = lit ? "bg-cyan-300/35" : "bg-white/[0.05]";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className={`h-2.5 w-14 rounded ${block}`} />
        <span className="flex gap-2">
          <span className={`h-2 w-7 rounded ${soft}`} />
          <span className={`h-2 w-7 rounded ${soft}`} />
          <span className={`h-2 w-7 rounded ${soft}`} />
        </span>
      </div>
      <span className={`mt-6 h-3.5 w-3/4 rounded ${block}`} />
      <span className={`mt-2 h-3.5 w-1/2 rounded ${block}`} />
      <span className={`mt-3 h-2 w-2/3 rounded ${soft}`} />
      <span className={`mt-4 h-6 w-24 rounded-lg ${lit ? "bg-linear-to-r from-cyan-400/70 to-fuchsia-400/70" : "bg-white/[0.09]"}`} />
      <span className="mt-auto grid grid-cols-3 gap-2">
        <span className={`h-12 rounded-lg ${soft}`} />
        <span className={`h-12 rounded-lg ${soft}`} />
        <span className={`h-12 rounded-lg ${soft}`} />
      </span>
    </div>
  );
}

export default function ScanVisual({ host, lit }: { host: string; lit: number }) {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-md select-none">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_30px_80px_-40px_rgba(124,58,237,0.6)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 text-xs text-gray-300">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" />
            </svg>
            <span className="truncate">{host}</span>
          </span>
        </div>
        <div className="relative h-60 overflow-hidden bg-[linear-gradient(var(--grid-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-soft)_1px,transparent_1px)] bg-size-[20px_20px] p-5 sm:h-64">
          <Sketch />
          <div className="scan-band absolute inset-0 p-5">
            <Sketch lit />
          </div>
          <div className="scan-beam absolute inset-0">
            <span className="absolute inset-x-0 bottom-full h-16 bg-linear-to-t from-cyan-400/20 to-transparent" />
            <span className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_16px_3px_rgba(34,211,238,0.45)]" />
          </div>
          {TAGS.map((tag, index) => (
            <span
              key={tag.label}
              data-on={index < lit}
              className="scan-tag absolute inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-card/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-emerald-400 shadow-lg shadow-shade/40"
              style={{ left: tag.x, top: tag.y }}
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
