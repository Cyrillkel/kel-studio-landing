"use client";

import { ButtonLink } from "@/components/Button";
import { TelegramIcon } from "@/components/ContactIcons";
import { GOALS, reachGoal } from "@/lib/metrika";
import { pulseBotUrl } from "@/lib/pulse";

// "Connect in Telegram": opens the monitoring bot. `source` goes to the bot as
// the start parameter, `place` to Metrika, so both tell where the click came from.
export default function PulseButton({
  source,
  place,
  children,
  size = "lg",
}: {
  source: string;
  place: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <ButtonLink
      href={pulseBotUrl(source)}
      target="_blank"
      rel="noopener"
      size={size}
      onClick={() => reachGoal(GOALS.pulseClick, { place })}
    >
      <span className="flex items-center gap-2.5">
        <TelegramIcon className="h-5 w-5" />
        {children}
      </span>
    </ButtonLink>
  );
}
