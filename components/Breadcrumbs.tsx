import Link from "next/link";

type Crumb = { name: string; href?: string };

// The visible trail; the same trail is also sent to search engines as
// BreadcrumbList markup by the page itself.
export default function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-300">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
