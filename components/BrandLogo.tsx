import { LOGO_KEL, LOGO_MARK, LOGO_STUDIO, LOGO_VIEWBOX, MARK_VIEWBOX } from "@/lib/brand";
import SantaHat from "./holiday/SantaHat";

// The KEL Studio logo (lib/brand.ts). Decorative: the link around it carries the name.
// The height comes from className, the width follows the proportions. "KEL" takes the text
// colour of the parent (white in the dark theme, ink in the light one), the faces and
// "studio" their own theme variables. `hat` puts the New Year hat on the cube (lib/holiday.ts).
export default function BrandLogo({
  className = "",
  markOnly = false,
  hat = false,
}: {
  className?: string;
  markOnly?: boolean;
  hat?: boolean;
}) {
  return (
    <svg
      viewBox={markOnly ? MARK_VIEWBOX : LOGO_VIEWBOX}
      className={`block w-auto ${hat ? "overflow-visible" : ""} ${className}`}
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
      {hat && <SantaHat />}
    </svg>
  );
}
