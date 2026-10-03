import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

// Next adds noindex to every 404 on its own; the title replaces the English
// "404: This page could not be found." that used to sit next to the site's own.
export const metadata: Metadata = {
  title: "Страница не найдена | KEL Studio",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
