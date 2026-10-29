import { MailIcon, TelegramIcon, WhatsAppIcon } from "./ContactIcons";
import { CONTACT_EMAIL, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

// Bare icons for the direct links (Telegram, WhatsApp, email), the same in the
// footer and the mobile menu. Each sits in a 44px box so it is comfortable to tap.
// Gray until hovered, then the brand color of the messenger (email: the site's violet).
const link =
  "flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export default function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className={`${link} hover:text-[#2AABEE]`}
      >
        <TelegramIcon className="h-6 w-6" />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`${link} hover:text-[#25D366]`}
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Email ${CONTACT_EMAIL}`}
        title={CONTACT_EMAIL}
        className={`${link} hover:text-violet-300`}
      >
        <MailIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
