# KEL Studio website

Marketing site of KEL Studio, a web studio: https://kel.agency

The site is in Russian, with an English UI option for the main pages. The blog is Russian only.

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
| `app/` | Routes: home, `/services`, `/services/[slug]`, `/prices`, `/blog`, `/blog/[slug]` (plus `rss.xml` and a per-article social image), `/privacy`, `api/contact`, `robots.ts`, `sitemap.ts`, the 404 page, `globals.css` |
| `components/` | Page sections (Hero, Services, Pricing, Portfolio, Process, Faq, Contact), `hero/` (technology icons animation), `services/` (service pages), `blog/`, `ui/` (buttons), header and footer, cookie notice, contact form and modal |
| `lib/` | Site constants (`site.ts`), service config (`services.ts`), blog loader (`blog.ts`), JSON-LD builders (`schema.ts`), theme logic (`theme.ts`), contact form validation (`contactSchema.ts`), Yandex Metrika goals (`metrika.ts`), privacy policy loader (`privacy.ts`) |
| `locales/` | `ru.json` and `en.json`: UI strings and the copy of every service page |
| `content/` | `blog/*.md` (articles) and `privacy.html` (privacy policy) |
| `public/` | Static files: portfolio screenshots, video |

## Content

**Services.** The list and order live in `lib/services.ts` (`SERVICE_SLUGS`, `SERVICE_CONFIG`); the text of each page is in `locales/*.json` under `servicePages.items.<slug>`. To add a service: add the slug and its config, add a scene to `components/services/ServiceIllustration.tsx`, write the copy in both locale files, then bump `CONTENT_UPDATED` in `lib/site.ts`.

**Blog.** One Markdown file per article in `content/blog/<slug>.md`; the file name is the URL. The file starts with a front matter block of `key: value` lines between two `---` lines:

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

**Privacy policy.** Plain HTML in `content/privacy.html`. After editing it, bump `POLICY_UPDATED` in `lib/privacy.ts`. The file must be committed: the site is built from the repository, and an empty file makes the page `noindex` and drops it from the sitemap.

**Dates.** `CONTENT_UPDATED` in `lib/site.ts` is the `lastmod` of the pages in the sitemap. Set it by hand when content changes.

## Theme

The site has a dark theme (default) and a light theme, switched by the `data-theme` attribute on `<html>`. A small inline script in `app/layout.tsx` (source in `lib/theme.ts`) applies the saved choice before the first paint, so the page does not flash; the header button is `components/ThemeToggle.tsx`.

Components are written in the dark palette. In the light theme the neutral Tailwind colors are mirrored in `app/globals.css`, so `text-white` means "primary text color", `bg-white/5` and `border-white/10` are tints of that ink, and `text-gray-*` steps are inverted. Write new code with the same classes and do not use hex colors. Surfaces and effects have variables (`bg-page`, `bg-card`, `bg-popover`, `shadow-shade/NN`, `var(--glow)` and so on). Use `text-snow` for text that must stay white on a colored fill.

## Contact form

`POST /api/contact` validates the request with the same rules as the form (`lib/contactSchema.ts`) and delivers the lead through two independent channels:

- Telegram bot: needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
- Email through the Resend HTTPS API: needs `RESEND_API_KEY`, `LEADS_EMAIL_TO` and `LEADS_EMAIL_FROM`.

A channel with missing variables is skipped; if no channel delivers, the endpoint answers 502. Spam protection needs no captcha: a hidden honeypot field, a minimum fill time, a limit on links in the message, and a per-IP rate limit kept in memory (one server instance). Set the variables in `.env.local` for local runs and in the server environment in production; never commit them.

## SEO and analytics

- `app/sitemap.ts`, `app/robots.ts`, social images, and JSON-LD (`lib/schema.ts`: one graph per page with the organization, the page, breadcrumbs, and service, FAQ or article data).
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

- Code comments and this README are written in English. User-facing text (Russian, plus the English UI) lives in `locales/` and `content/`.
- No secrets in the repository.
- Detailed working notes (in Russian) are kept next to the repository, outside it: `KEL-STUDIO-CONTEXT.md`, `BLOG-PLAN.md`, `SEO-AUDIT.md`.
