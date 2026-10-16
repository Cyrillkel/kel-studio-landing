// Light and dark theme. The colours are in app/globals.css (the theme block);
// the theme itself is the data-theme attribute on <html>.
export const THEME_KEY = "kel-theme";
export const THEME_EVENT = "kel-theme-change";

export type Theme = "dark" | "light";

// What a first-time visitor sees. "dark" is the site's own look; change it to
// "system" to follow the visitor's device setting until they press the button.
// A choice made with the button always wins and is remembered.
const FIRST_VISIT: Theme | "system" = "dark";

// The colour of the browser's own bars (<meta name="theme-color">): Chrome paints the
// address bar with it and Safari the status bar, so they match the page instead of
// showing a light band above a dark header. The same values as --page in globals.css.
const THEME_COLORS: Record<Theme, string> = { dark: "#121827", light: "#ffffff" };

// Runs in <head> before the first paint (app/layout.tsx), so the page never
// flashes the wrong theme. Plain ES5 in a string: it is not part of any bundle.
// It also creates the theme-color tag, so the bars are right from the first frame.
export const THEME_SCRIPT = `(function(){var t=${JSON.stringify(FIRST_VISIT)};try{var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(s==="light"||s==="dark")t=s}catch(e){}if(t==="system"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.setAttribute("name","theme-color");document.head.appendChild(m)}m.setAttribute("content",${JSON.stringify(THEME_COLORS)}[t])})()`;

// Keeps the theme-color tag in step with the theme after a switch.
function syncThemeColor(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

// Switches the theme, remembers it, and tells the components that show it.
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Transitions off for the moment of the switch, so colours don't lag behind
  // the backgrounds (see .theme-switching in globals.css).
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  syncThemeColor(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme just doesn't persist.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
  // Two frames: the browser has to paint with transitions off first.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

// For useSyncExternalStore: this tab's button and another tab's change.
export function subscribeTheme(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_KEY) return;
    const theme: Theme = event.newValue === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    syncThemeColor(theme);
    notify();
  };
  window.addEventListener(THEME_EVENT, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, notify);
    window.removeEventListener("storage", onStorage);
  };
}
