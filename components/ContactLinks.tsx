import { MailIcon, TelegramIcon, WhatsAppIcon } from "./ContactIcons";
import { CONTACT_EMAIL, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

// Round glass buttons for the direct links (Telegram, WhatsApp, email), the same
// in the footer and the mobile menu. 44px so they are comfortable to tap. Gray
// until hovered, then the brand color of the messenger (email: the site's violet).
const link =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export default function ContactLinks() {
  return (
    <div className="flex items-center gap-3">
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className={`${link} hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/10 hover:text-[#2AABEE]`}
      >
        <TelegramIcon className="h-6 w-6" />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`${link} hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366]`}
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Email ${CONTACT_EMAIL}`}
        title={CONTACT_EMAIL}
        className={`${link} hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-violet-300`}
      >
        <MailIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
