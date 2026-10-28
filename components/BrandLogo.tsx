import { LOGO_KEL, LOGO_MARK, LOGO_STUDIO, LOGO_VIEWBOX, MARK_VIEWBOX } from "@/lib/brand";

// The KEL Studio logo (lib/brand.ts). Decorative: the link around it carries the name.
// The height comes from className, the width follows the proportions. "KEL" takes the text
// colour of the parent (white in the dark theme, ink in the light one), the faces and
// "studio" their own theme variables.
export default function BrandLogo({ className = "", markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <svg
      viewBox={markOnly ? MARK_VIEWBOX : LOGO_VIEWBOX}
      className={`block w-auto ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {LOGO_MARK.map((face) => (
        <path key={face.d} d={face.d} fill={`var(--logo-${face.face})`} />
      ))}
      {!markOnly && (
        <>
          <path d={LOGO_KEL} fill="currentColor" />
          <path d={LOGO_STUDIO} fill="var(--logo-soft)" />
        </>
      )}
    </svg>
  );
}
