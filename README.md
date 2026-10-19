# KEL Studio website

Marketing site of KEL Studio, a web studio: https://kel.agency

The site has two language versions: Russian at the root (`/`) and English under `/en`. Every page exists in both, with its own address, title, description, structured data and `hreflang` links (see "Languages").

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4
- GSAP (ScrollTrigger, ScrollSmoother, DrawSVG) for animation
- i18next / react-i18next (`ru`, `en`)
- marked, for the blog's Markdown
- pnpm 10, Node.js 20.9 or newer (production runs Node 22)

Next.js 16 has breaking changes compared to older versions. Before changing framework-level code, read the relevant guide in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # production build (output: standalone)
pnpm start          # next start; production uses the standalone server.js, see Deployment
npx tsc --noEmit    # type check
npx eslint .        # lint
```

`npx eslint .` currently reports one known error in `components/AmbientAtom.tsx` (state set inside an effect).

## Project layout

| Path | What is there |
| --- | --- |
| `app/(ru)/` | The Russian routes, at the root: home, `/services`, `/services/[slug]`, `/prices`, `/blog`, `/blog/[slug]`, `/privacy`, `rss.xml`, social images, and the Russian root layout |
| `app/(en)/en/` | The same routes under `/en`, and the English root layout (`app/(en)/layout.tsx`) |
| `app/` (root) | `api/contact`, `robots.ts`, `sitemap.ts`, `global-not-found.tsx` (the 404 page of both languages), icons, `globals.css` |
| `components/routes/` | One module per page type (home, services, service, prices, privacy, blog index, blog post): the page component and its metadata. The `page.tsx` files of both languages are thin wrappers around them |
| `components/` | Page sections (Hero, Services, Pricing, Portfolio, Process, Faq, Contact), `hero/` (technology icons animation), `services/` (service pages), `blog/`, `ui/` (buttons), header and footer, language switcher, cookie notice, contact form and modal, `RootShell.tsx` (`<html>` and `<body>` of both layouts) |
| `lib/` | Site constants (`site.ts`), languages and addresses (`lang.ts`, `routes.ts`), dictionaries (`dictionary.ts`, `i18n/`), service config (`services.ts`), blog loader (`blog.ts`), page metadata and hreflang (`pageMetadata.ts`), JSON-LD builders (`schema.ts`), theme logic (`theme.ts`), contact form validation (`contactSchema.ts`), Yandex Metrika goals (`metrika.ts`), privacy policy loader (`privacy.ts`) |
| `locales/` | `ru.json` and `en.json`: UI strings and the copy of every service page; the two files have the same keys |
| `content/` | `blog/*.md` and `blog/en/*.md` (articles), `privacy.html` and `privacy.en.html` (privacy policy) |
| `public/` | Static files: portfolio screenshots, video, article images |

## Languages

Russian is the main language and lives at the root, so the addresses that are already indexed do not change. English lives under `/en`. The two versions are separate routes with separate root layouts (`app/(ru)/layout.tsx`, `app/(en)/layout.tsx`), because `<html lang>` has to be right in the HTML the server sends. Going from one language to the other is a normal page load.

- **Addresses.** `/services/vizitka` has the English address `/en/services/business-card-website`; four services have different English addresses (`SERVICE_SLUG_EN` in `lib/services.ts`, change one there and add a redirect in `next.config.ts` once the old one has been indexed). Blog articles have the same slug in both languages.
- **Texts.** `locales/ru.json` and `locales/en.json` have the same keys (`tools/i18n-check/check_keys.py` checks it). Each language has its own i18next instance with its dictionary inlined (`lib/i18n/`, `components/I18nProviderRu.tsx`, `components/I18nProviderEn.tsx`), so a page ships only its own language. Server code reads texts with `getDictionary(lang)` from `lib/dictionary.ts`; never import that file in a client component, it would pull both dictionaries into the bundle.
- **Links in texts** (locale strings and articles) are always written the Russian way: `[text](/services/vizitka)`, `/blog/slug`, `/#contact`. `localizePath` in `lib/routes.ts` turns them into the right address for the page's language, and `alternatePath` finds the same page in the other language for the switcher.
- **Search engines.** Every page has a canonical link to itself and `hreflang` links for `ru`, `en` and `x-default` (`lib/pageMetadata.ts`; `X_DEFAULT` says which version `x-default` points to), and the sitemap lists both versions with their alternates. There is no redirect by `Accept-Language`: one address always gives one language.
- **Prices.** The English pages show dollars: the ruble price list divided by `RUB_PER_USD` (`lib/services.ts`, currently 100, so 20,000 RUB reads $200). The figures in `locales/en.json`, the blog and the structured data have to agree with it: run `tools/i18n-check/check_prices.py` after any price change.
- **404.** Next.js cannot give each root layout its own `not-found` page, so there is one `app/global-not-found.tsx` (enabled by `experimental.globalNotFound` in `next.config.ts`). It holds both languages and a small script in `<head>` shows the one that matches the address.
- **Fonts.** `lib/fonts.ru.ts` loads Latin and Cyrillic, `lib/fonts.en.ts` Latin only. Do not import `fonts.ru` from anything the English pages share (the 404 page uses `fonts.en` for this reason): the build would add the Cyrillic preloads to every page.

To add a page type, write its route module in `components/routes/`, add a thin `page.tsx` in each language group, and add the page to `app/sitemap.ts`. The checks in `../tools/i18n-check/` (see its README) crawl a running copy and verify addresses, hreflang, canonicals, Cyrillic leftovers on English pages and structured data.

## Content

**Services.** The list and order live in `lib/services.ts` (`SERVICE_SLUGS`, `SERVICE_CONFIG`); the text of each page is in `locales/*.json` under `servicePages.items.<slug>`. To add a service: add the slug and its config, add a scene to `components/services/ServiceIllustration.tsx`, write the copy in both locale files (English prices in dollars), then bump `CONTENT_UPDATED` in `lib/site.ts`.

**Blog.** One Markdown file per article in `content/blog/<slug>.md` (Russian) and `content/blog/en/<slug>.md` (English); the file name is the URL, and the same name in both folders is what ties the two versions together. An article without an English file simply does not appear on the English pages. The file starts with a front matter block of `key: value` lines between two `---` lines (the English file has the same keys and the same `category`, `date`, `service` and `related`; only `title`, `description` and `query` are translated):

| Key | Meaning |
| --- | --- |
| `title`, `description` | H1 and `<title>`; meta description and card text (about 140-160 characters) |
| `category` | `sites`, `seo`, `ads` or `apps` |
| `date`, `updated` | `YYYY-MM-DD`; `updated` defaults to `date` |
| `service` | Slug of the service page the article leads to |
| `related` | Comma-separated slugs of neighbouring articles |
| `query` | Main search query (for reference only) |
| `draft` | `true` keeps the article out of the build, the list and the sitemap |

`title`, `description`, `date`, `category` and `service` are required; a bad header fails the build with a clear message. To publish: add the file, commit, push.

**Privacy policy.** Plain HTML in `content/privacy.html`; `content/privacy.en.html` is its English translation (the Russian text prevails, and the English page says so). After editing either, bump `POLICY_UPDATED` in `lib/privacy.ts`. The files must be committed: the site is built from the repository, and an empty file makes that language's page `noindex` and drops it from the sitemap. `tools/i18n-check/check_privacy.py` compares the two files clause by clause.

**Dates.** `CONTENT_UPDATED` in `lib/site.ts` is the `lastmod` of the pages in the sitemap. Set it by hand when content changes.

## Theme

The site has a dark theme (default) and a light theme, switched by the `data-theme` attribute on `<html>`. A small inline script in the root layouts (`components/RootShell.tsx`, source in `lib/theme.ts`) applies the saved choice before the first paint, so the page does not flash; the header button is `components/ThemeToggle.tsx`.

Components are written in the dark palette. In the light theme the neutral Tailwind colors are mirrored in `app/globals.css`, so `text-white` means "primary text color", `bg-white/5` and `border-white/10` are tints of that ink, and `text-gray-*` steps are inverted. Write new code with the same classes and do not use hex colors. Surfaces and effects have variables (`bg-page`, `bg-card`, `bg-popover`, `shadow-shade/NN`, `var(--glow)` and so on). Use `text-snow` for text that must stay white on a colored fill.

The dark theme is a deep navy (page `#0b0f1a`), not black; the surface variables are listed at the top of `app/globals.css` and keep the order deep < page < band < band-home < footer < card, with `--deep` only a hair below `--page` (a deeper edge shows as a dark stripe between two lighter sections). Do not use `bg-black` for page-level surfaces (it is pure `#000` in the dark theme): use `bg-deep`, `bg-page` or `bg-band`.

Large soft gradients between the dark page colors can show as stripes and rings on bright monitors (a dark page has only a few dozen distinct colors). Do not write raw `radial-gradient` or `linear-gradient` for glows and section edges: use `.glow-wash`, `.fade-top` and `.fade-ends` from `app/globals.css`, which ease the color with a smoothstep curve. A fine grain layer over the dark page (`body::after`, tile in `public/grain.png`) hides the steps that remain; keep it. The tools that check this are in `../tools/banding/`.

## Contact form

`POST /api/contact` validates the request with the same rules as the form (`lib/contactSchema.ts`) and delivers the lead through two independent channels:

- Telegram bot: needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
- Email through the Resend HTTPS API: needs `RESEND_API_KEY`, `LEADS_EMAIL_TO` and `LEADS_EMAIL_FROM`.

A channel with missing variables is skipped; if no channel delivers, the endpoint answers 502. Spam protection needs no captcha: a hidden honeypot field, a minimum fill time, a limit on links in the message, and a per-IP rate limit kept in memory (one server instance). Set the variables in `.env.local` for local runs and in the server environment in production; never commit them.

## Free tools

- `/site-check`: a website check on the page, about 28 checks in five groups (access and speed, security, domain and mail, search, the home page). `POST /api/site-check` keeps a per-visitor limit in memory and passes the request to the checks API of the Pulse bot on the same server (`http://127.0.0.1:3200/check`, override with `PULSE_API_URL`), with the shared key from `PULSE_API_KEY`. For local work, run that API from the `kel-pulse` project next to this one: `PULSE_API_PORT=3200 node dist/src/serve-api.js`.
  - The API answers with rows (`lib/sitecheck.ts`): a group, a status and a `case` with data, but no words. `components/sitecheck/useRowText.ts` turns a row into text from `siteCheck.rows.<id>.<case>` in the locales (dates, sizes, plurals and variants by i18next). A case the bot sends and the locales do not have yet is left out of the table, so the bot can be updated first.
  - "Save as PDF" prints the report: the print styles in `app/globals.css` leave only the report, `CheckReport` switches to the light theme and all rows for the print and names the file after the site and the date (Metrika goal `report_pdf`).
  - While a check runs, `CheckProgress` shows the scanner (`ScanVisual`) and the steps by time. The form on the home page (`SiteCheckTeaser`) opens a curtain with the same scanner from its button (`components/LaunchCurtain.tsx`, mounted in `RootShell`), which stays up until the check page is there.
- `/llms.txt` (`lib/llms.ts`): the studio's services with prices and terms, the tools and the contacts for AI assistants, built from the same texts as the pages.
- `/pulse`: the page of the free monitoring bot `@kel_pulse_bot`. Buttons open the bot with a start parameter that tells where the visitor came from (`lib/pulse.ts`).

## SEO and analytics

- `app/sitemap.ts`, `app/robots.ts`, social images (route handlers named `opengraph-image/route.tsx` in each language group: the metadata-file convention puts a hash into the address inside route groups), and JSON-LD (`lib/schema.ts`: one graph per page with the organization, the page, breadcrumbs, and service, FAQ or article data, in the page's language).
- `INDEXABLE` in `lib/site.ts` switches the robots meta tag, `/robots.txt` and the `X-Robots-Tag` header together. Set it to `false` to close the site from search engines.
- Search engine ownership codes are in `VERIFICATION` (`lib/site.ts`) and rendered as meta tags.
- Yandex Metrika is loaded after the page has loaded and only on the production domain. The goals sent from the site are listed in `lib/metrika.ts`.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`:

1. Install dependencies with the frozen lockfile and build on a GitHub runner (the server is too small to build).
2. Assemble the standalone bundle (`server.js`, its `node_modules`, static assets, `public/`).
3. `rsync` it to a new release directory on the server, switch the `current` symlink, restart the systemd service.
4. Check that https://kel.agency/ answers 200.

Repository secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`.

On the server the site is a systemd service (`kel-studio`, Node on `127.0.0.1:3000`) behind nginx with HTTPS from Let's Encrypt. Releases live in `/var/www/kel-studio/releases/<sha>`, the three latest are kept, and `current` points to the active one. Runtime secrets come from an environment file loaded by the service. To roll back, point `current` at an older release and restart the service.

```bash
journalctl -u kel-studio -n 50 --no-pager     # site logs, run on the server
```

## Conventions

- Code comments and this README are written in English. User-facing text (Russian and English) lives in `locales/` and `content/`.
- Page width: the content of every section lines up with the header (the logo on the left, the language switch on the right). A container with its own sides is `max-w-7xl mx-auto px-5 sm:px-6`, like the header's; inside a section that already has `px-5 sm:px-6`, the content sits in `mx-auto max-w-page` (77rem, `--container-page` in `app/globals.css`). Narrow reading columns (FAQ) start at that left edge: `max-w-page *:max-w-3xl`.
- `<html data-scroll-behavior="smooth">` (`components/RootShell.tsx`) is needed for Next.js 16 to open a new page at its top while the site scrolls smoothly; without it a page opened from far down the home page stays at its bottom.
- No secrets in the repository.
- Detailed working notes (in Russian) are kept next to the repository, outside it: `KEL-STUDIO-CONTEXT.md`, `BLOG-PLAN.md`, `SEO-AUDIT.md`.
