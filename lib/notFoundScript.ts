import { EN_PREFIX } from "./lang";

// Runs in <head> before the first paint of the 404 page (app/global-not-found.tsx):
// which language the address that was asked for belongs to. The server cannot tell it
// to this page, so the page holds both versions and the stylesheet (.not-found-ru,
// .not-found-en in globals.css) shows the one that matches, without a flash of the
// other. Plain ES5 in a string, like the theme script.
export const NOT_FOUND_SCRIPT = `(function(){var p=location.pathname,l=(p==="${EN_PREFIX}"||p.indexOf("${EN_PREFIX}/")===0)?"en":"ru";var h=document.documentElement;h.setAttribute("data-lang",l);h.lang=l})()`;
