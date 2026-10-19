// Short facts under a page's lead, label over value: the price and the term on
// a service page, "free, up to 30 seconds, no sign-up" on the free tools.
export default function HeroFacts({ items, className = "" }: { items: { label: string; value: string }[]; className?: string }) {
  return (
    <dl className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
          <dt className="text-xs tracking-wider text-gray-500 uppercase">{item.label}</dt>
          <dd className="mt-1 font-semibold text-white">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
