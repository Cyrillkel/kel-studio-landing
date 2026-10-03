// Structured data for search engines. `<` is written as its unicode escape so a
// string from the copy can never close the script tag (Next.js JSON-LD guide).
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
