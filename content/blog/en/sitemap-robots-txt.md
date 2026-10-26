---
title: Robots.txt and sitemap.xml: how to set up site indexing
description: How to write robots.txt and sitemap.xml so that Google and Yandex see the right pages: directives, examples, common mistakes and checks, using our own site.
category: seo
date: 2026-10-26
service: seo-audit
query: robots.txt
related: yandex-webmaster, semantic-core, pagespeed-insights
---

Robots.txt and sitemap.xml are two service files in the root of a site, and they are among the first things the Yandex and Google robots read. Robots.txt tells the robot where it does not need to go, and sitemap.xml lists the pages worth finding and indexing. A mistake in either one is expensive: a single `Disallow: /` line left over from development closes the whole site to search.

Below: how both files work, which directives an ordinary company site needs, which mistakes come up most often and how to check everything. At the end, how it is done on our own site, kel.agency.

## What robots.txt is

Robots.txt is a text file with rules for search robots. It lives strictly in the root: `https://your-site/robots.txt`. The robot requests it before crawling and decides which addresses to download.

Requirements worth remembering:

- **One file per address.** The rules apply to the protocol and subdomain where the file lies. `shop.your-site.com` needs its own robots.txt.
- **Response 200.** According to [Yandex help](https://yandex.com/support/webmaster/en/controlling-robot/robots-txt), the file has to be served with code 200 and weigh no more than 500 KB. If it does not meet the requirements, Yandex treats the whole site as open for indexing.
- **Case matters in paths.** `/Admin/` and `/admin/` are different addresses, while directive names can be written any way you like.

## Robots.txt directives

Yandex help currently lists five directives:

- **User-agent** - which robot the rules are for. `*` is for all of them, `Yandex` for the Yandex robots, `Googlebot` for the main Google robot.
- **Disallow** - forbids crawling a section or a page.
- **Allow** - permits crawling, including inside a closed section.
- **Sitemap** - the address of the sitemap. You can list several.
- **Clean-param** - Yandex only: which parameters in an address do not change the page content. The robot stops treating addresses with tracking tags as separate pages.

Two special characters work in paths: `*` is any sequence of characters, `$` is the end of the address. `Disallow: /*?sort=` closes all addresses with sorting, `Disallow: /search$` closes only the `/search` page, but not `/search/results`.

Old guides still mention `Host` and `Crawl-delay`. They are not in the current Yandex list of directives, and crawl speed is set in Webmaster itself. Google does not take `Crawl-delay` into account either.

## An example robots.txt for a company site

A typical file for a service site with a client area, site search and ad tracking tags:

```
User-agent: *
Disallow: /admin/
Disallow: /cabinet/
Disallow: /search
Disallow: /*?sort=

Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term

Sitemap: https://example.com/sitemap.xml
```

Yandex reads `Clean-param` anywhere in the file, and Google simply skips the line, so it does not need a separate Yandex block. The syntax, per [Yandex help](https://yandex.com/support/webmaster/en/robot-workings/clean-param): parameters joined with `&`, then, if needed, the path the rule applies to. Without a path it works for the whole site.

Close what is not needed in search: the admin panel, client areas, the cart, site search results, sorting and filters that produce thousands of identical pages. Everything else is open by default, so a separate `Allow: /` is optional.

## Robots.txt does not remove a page from search

This is the most common confusion. Disallow forbids the robot to download a page, but it does not promise the page will stay out of the results. [Google help](https://developers.google.com/search/docs/crawling-indexing/robots/intro) says it plainly: a page closed in robots.txt can still be indexed if other sites link to it. In the results it then appears without a description. Yandex help says the same.

To keep a page out of search, you need the `noindex` tag:

```
<meta name="robots" content="noindex">
```

or the HTTP header `X-Robots-Tag: noindex`. An important detail: such a page must not be closed in robots.txt. The robot has to download it, otherwise it will not see `noindex`.

That is how our privacy policy page worked: while the policy had no text yet, the page opened, but carried `noindex` and was left out of the sitemap. Once the text appeared, the tag went away by itself and the page was added to the sitemap.

## Common robots.txt mistakes

- **A forgotten `Disallow: /`.** The site is closed entirely during development and nobody opens it after launch. The site works, but it is not in search.
- **Closed styles and scripts.** If the robot cannot load CSS and JavaScript, it sees the page worse than a person does. Google warns about this separately.
- **Closing a page to remove it from search.** As above: you need `noindex`, and Disallow gets in its way.
- **A one-character mistake.** `Disallow: /` instead of `Disallow: /admin`, or a stray space in a path, changes the meaning of the rule.
- **A separate Yandex block without the shared rules.** If the file has `User-agent: Yandex`, the Yandex robot reads only that block and ignores the rules for `*`. Restrictions meant for everyone have to be repeated in such a block.

## What sitemap.xml is

Sitemap.xml is a map of the site for robots: a list of the addresses you want to see in search, with the date of the last change. It looks like this:

```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/services/landing</loc>
    <lastmod>2026-10-20</lastmod>
  </url>
</urlset>
```

Rules worth following:

- **Full addresses.** With the protocol and the same domain as the site: if the site runs on `https` without `www`, the sitemap uses `https` without `www` too.
- **Only working pages.** Addresses that answer 200 and are the main (canonical) ones. Redirects, pages with `noindex`, pages closed in robots.txt and deleted pages stay out of the sitemap.
- **An honest date.** According to [Google help](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), `lastmod` is used only if it consistently matches real changes to the page. Google ignores `priority` and `changefreq`.
- **Limits.** One file holds up to 50,000 addresses and up to 50 MB uncompressed. For more, split it into several sitemaps and gather them in an index file.

You do not have to write a sitemap by hand. CMSs and frameworks build it themselves; what matters is checking what goes into it.

## How to tell Yandex and Google about the sitemap

One way is enough, but it is better to do both:

1. A line `Sitemap: https://example.com/sitemap.xml` in robots.txt. Every search engine will find it, even those where you have no account.
2. Add the file by hand: in Yandex Webmaster under "Indexing" - "Sitemap files", in Google Search Console in the "Sitemaps" report.

For search engines a sitemap is a hint, not an order. It speeds up the discovery of new pages, but only the pages the robot finds useful get indexed. How to add a site to Webmaster and send pages for recrawl is covered in our article on [Yandex Webmaster](/blog/yandex-webmaster).

## How it works on our site

Our robots.txt is short:

```
User-Agent: *
Allow: /

Sitemap: https://kel.agency/sitemap.xml
```

We have nothing to close: there is no client area, cart or site search. The file's main job is to point to the sitemap. We added the `Sitemap` line on October 3, after Webmaster reported "No sitemap files used by the robot": the file was on the site, but the robot had no way of learning about it.

The sitemap is built automatically on every build of the site, so a new article or service gets into it without manual work. Three decisions we made on purpose:

- **Two versions of every page.** The site has Russian and English versions, and in the sitemap each address lists its counterpart in the other language. That way search engines understand these are translations, not duplicates.
- **An honest `lastmod`.** For articles the date comes from the article itself: the date of publication or of the last substantial edit. For the other pages we change the date by hand when the content changes. The build date does not work: it would say every page changes on every release, and search engines would stop trusting the field.
- **Only what can be indexed.** The privacy policy got into the sitemap only after it had text.

## How to check robots.txt and sitemap.xml

- **Yandex Webmaster.** Under "Tools" there is "Robots.txt analysis": it shows errors in the file and checks whether crawling specific addresses is allowed. "Sitemap files" shows whether the sitemap has been loaded and how many addresses the robot found in it.
- **Google Search Console.** The robots.txt report is in the settings: which file Google received, when, and with which errors. "Sitemaps" shows the status of the sitemap. URL Inspection shows whether crawling a particular page is allowed.
- **Our free [site check](/site-check).** In half a minute it reads robots.txt and the sitemap, checks whether the sitemap is listed in robots.txt, whether it contains redirects, whether the site is closed with `noindex`, and whether robots.txt lets in the bots of Yandex, Google and AI search.
- **[Site monitoring](/pulse) in Telegram.** Every night the bot checks whether `noindex` or a ban in robots.txt has appeared on the home page, and writes to you if the site was accidentally closed to search.

## A short checklist

1. Robots.txt opens at `/robots.txt` and answers 200.
2. It has no `Disallow: /` for everyone or for Yandex and Google.
3. Service sections are closed: the admin panel, client area, cart, search, sorting.
4. Styles and scripts are open.
5. Robots.txt has a `Sitemap` line with the full address of the sitemap.
6. The sitemap has only working main addresses, with no redirects and no `noindex`.
7. The `lastmod` dates change together with the pages.
8. The sitemap is added to Yandex Webmaster and Google Search Console.
9. Pages that should not be in search are closed with `noindex`, not Disallow.

Robots.txt and the sitemap are the foundation of indexing, but not all of it. If the files are fine and pages still do not get into search, the reason may be speed, duplicates or content, and an [SEO audit](/services/seo-audit) helps there. And to give new pages a reason to be indexed, build them from a [keyword map](/blog/semantic-core).
