"use client";

import { useTranslation } from "react-i18next";

export default function SliderDots({
  count,
  active,
  onSelect,
  className = "",
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className={`flex justify-center gap-2 md:hidden ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={t("slider.slide", { current: index + 1, total: count })}
          aria-current={index === active}
          onClick={() => onSelect(index)}
          className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
            index === active
              ? "w-6 bg-linear-to-r from-cyan-400 to-fuchsia-500"
              : "w-1.5 bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}
