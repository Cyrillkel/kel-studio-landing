// Dark violet wash in the same key as the hero glow, so the page doesn't read
// as one long stretch of black. It fades out well before the section edges,
// so it blends into whatever background the neighbouring sections use.
// Needs a positioned parent with `isolate`.
export default function SectionGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_70%)]"
      aria-hidden="true"
    />
  );
}
