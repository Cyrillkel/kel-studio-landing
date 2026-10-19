// "Site Pulse", the studio's free monitoring bot in Telegram (the kel-pulse
// project next to this one), and the page about it. The bot names this page in
// the user agent of its checks, so site owners who find it in their logs land here.
export const PULSE_PATH = "/pulse";
export const PULSE_BOT = "kel_pulse_bot";

// The start parameter tells the bot where a person came from (it keeps it as
// their source, see /stats in the bot). Letters, digits, "_" and "-" only.
export const pulseBotUrl = (source: string) => `https://t.me/${PULSE_BOT}?start=${source}`;
