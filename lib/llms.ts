import { BLOG_PATH } from "./blog-path";
import { getDictionary } from "./dictionary";
import { withLang } from "./lang";
import { PULSE_PATH, PULSE_BOT } from "./pulse";
import { PRICES_PATH, SERVICE_GROUPS, SERVICES_PATH, servicePath, slugsOf } from "./services";
import { CONTACT_EMAIL, SITE_TEXT, SITE_URL, TELEGRAM_URL } from "./site";
import { SITE_CHECK_PATH } from "./sitecheck";

// /llms.txt (llmstxt.org): what the studio does, in a form AI assistants read
// easily, with links to the pages. Built from the same texts as the pages, so
// prices and terms never differ from the site. Served by app/(ru)/llms.txt.
export function llmsText(): string {
  const ru = getDictionary("ru");
  const pages = ru.servicePages;
  const link = (path: string) => `${SITE_URL}${path}`;
  const groups = SERVICE_GROUPS.map((group) => {
    const lines = slugsOf(group).map((slug) => {
      const item = pages.items[slug];
      return `- [${item.name}](${link(servicePath(slug))}): ${item.short} Цена: ${item.price}. Срок: ${item.term}.`;
    });
    return `## ${pages.hub.groups[group].title}\n\n${lines.join("\n")}`;
  });
  return `# KEL Studio

> ${SITE_TEXT.ru.description}

Работаем онлайн по всей России. У сайта есть английская версия: ${link("/en")}.

${groups.join("\n\n")}

## Цены, блог и бесплатные инструменты

- [Цены на все услуги](${link(PRICES_PATH)})
- [Блог](${link(BLOG_PATH)}): статьи о создании и продвижении сайтов.
- [Бесплатный анализ сайта](${link(SITE_CHECK_PATH)}): ${ru.siteCheck.metaDescription}
- [Мониторинг сайта в Telegram](${link(PULSE_PATH)}): бот @${PULSE_BOT}, бесплатно для одного сайта.

## Контакты

- Telegram: ${TELEGRAM_URL}
- Почта: ${CONTACT_EMAIL}
- Сайт: ${SITE_URL}

## English

- [Home page in English](${link("/en")})
- [Services](${link(withLang(SERVICES_PATH, "en"))}) and [prices in US dollars](${link(withLang(PRICES_PATH, "en"))})
- [Free website check](${link(withLang(SITE_CHECK_PATH, "en"))})
`;
}
