// New Year decorations for the 2026-27 holidays: slow falling snow over the page
// (components/holiday/Snowfall.tsx), a Santa hat on the logo cube (SantaHat.tsx, in the
// header and the footer) and a sleigh with two reindeer that now and then flies across
// the screen (Sleigh.tsx).
//
// To take them down after the holidays, revert the commit that added them (it touches
// nothing else), or set HOLIDAY to false for a quick switch-off.
export const HOLIDAY = true;

// In case the decorations outlive the holidays: from this day (Moscow time) the snow and
// the sleigh stop by themselves, without a deploy. The hat is part of the page HTML, which
// is built once, so a date check in it would differ between the build and the browser;
// it follows HOLIDAY alone.
export const HOLIDAY_END = "2027-01-15";

export const holidayOn = (now: number = Date.now()) =>
  HOLIDAY && now < Date.parse(`${HOLIDAY_END}T00:00:00+03:00`);
