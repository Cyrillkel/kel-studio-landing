---
title: Yandex Webmaster: how to add your site and what its messages mean
description: A step-by-step guide to Yandex Webmaster: adding a site, confirming ownership, the sitemap and recrawl, plus two common messages explained on our own site.
category: seo
date: 2026-10-04
service: seo-audit
query: yandex webmaster
related: website-builder-or-custom, what-is-a-landing-page
---

Yandex Webmaster is a free panel where a site owner sees how the search engine reads their pages: which ones it found, which ones it added to search, what gets in the way of indexing and for which queries the site is shown. It is worth connecting on the very first day after launch: until then Yandex knows about your site only what it happens to find on its own.

Below: how to add a site, how to confirm ownership, what to do with the sitemap and recrawl, and how to read the panel's messages. We use our own site, kel.agency, as the example, since we went through all of this there recently.

## What Yandex Webmaster shows

The panel answers four questions:

- **Does Yandex see the site.** How many pages the robot downloaded, which ones it added to search and which it excluded, and why.
- **Are there technical errors.** Unavailable pages, server errors, a ban in robots.txt, problems with addresses.
- **Which queries bring people to you.** Impressions and clicks in Yandex search, positions for queries.
- **What Yandex itself recommends.** The block of messages: no sitemap, site icon not found, violations noticed.

This is the main source of data about search. Metrica shows what people do on the site; Webmaster shows how they got to it and whether they got to it at all.

## How to add a site

1. Sign in to Webmaster with a Yandex account. It is better to use an account that belongs to the company or to you personally, not to an employee who will leave later.
2. Click "Add site" and enter the address. Give the version you consider the main one: with `www` or without, `https`. Our main address is `https://kel.agency`, and `www` redirects to it.
3. Confirm your rights to the site.

If you have versions with and without `www`, Yandex treats them as different addresses, so set up a redirect on the server and add the main address to Webmaster.

## Confirming rights to the site

Yandex has to make sure the site is yours. It offers three ways:

- **Meta tag.** Copy the suggested tag and paste it into the `head` element of the home page.
- **HTML file.** Create a file with the suggested name and content and put it in the root of the site.
- **DNS record.** Add a TXT record with the suggested value to the domain's DNS records. DNS does not update instantly, so the check may not pass right away.

We confirmed rights with a meta tag: it is stored in the site's code and survives any rebuild, while a file in the root can be lost by accident during a move. Which way to choose in your case depends on where changes are easiest to make: in the code, on the hosting or in DNS.

Rights have to be confirmed for each site separately. After confirmation do not delete the meta tag or the file: if it disappears, Yandex loses the confirmation.

## Sitemap: a map of the site for the robot

A sitemap is a file with a list of the site's pages (usually `sitemap.xml`). It helps the robot find new pages faster.

You can point to it in two ways, and one is enough:

- a line `Sitemap: https://your-site/sitemap.xml` in the robots.txt file;
- in the "Indexing" - "Sitemap files" section of the Webmaster panel.

According to Yandex's help, after you add it the file goes into a queue and the robot downloads it within two weeks. You can speed it up with the refresh button: after it the robot downloads the data within three days, but you can use it no more than ten times per site.

A good habit: after adding the file, go back to the section and look at the status. "OK" means the file has been downloaded and recognized. The status "Not indexed" means access to the file is closed by a `Disallow` directive in robots.txt.

## Page recrawl

When you have added a new page or noticeably changed an old one, you do not have to wait for the robot to come on its own. In the "Indexing" - "Page recrawl" section you can submit addresses and ask the robot to visit them with priority.

According to the help, the robot comes no later than in three days, usually faster, and the data in search is updated within two weeks. The number of addresses per day is limited and is calculated for each site separately; the limit is shown under the input field. If it has run out, the tool works again the next day.

## What else is in the panel

Yandex changes section names from time to time, so go by the meaning:

- **Diagnostics** - errors and warnings about the site, including problems with access and speed.
- **Indexing** - pages that were downloaded and added to search, the sitemap, recrawl, a check of the server response.
- **Search queries** - impressions, clicks and positions for queries. For a new site it is empty at first, and that is normal.
- **Security and violations** - viruses and violations because of which a site may be lowered in the results.
- **Links** - what links lead to the site and from where.

## Two messages explained, with our site as the example

After launch we opened the site for indexing on September 29 and confirmed rights. A few days later two recommendations appeared in the panel.

**"No sitemap files used by the robot."** We had a `sitemap.xml` file, and the server returned it with code 200. But the server logs show that on that day the robot visited the home page and six service pages and took the fonts, and did not come for `sitemap.xml`. The `Sitemap:` line was not yet in robots.txt at that moment, and we had not added the file in Webmaster. The robot had no way of learning about it. We added the directive to robots.txt on October 3; what remains is to add the file in the "Sitemap files" section and wait for the robot to come.

**"Favicon file not found."** The site icon lay in the root and opened, but the robot did not come for it either: as of October 3 it had been on the site only once, on September 29. According to Yandex's help, the icon has to lie in the root of the site under the name `favicon`, be available with a 200 response and not be closed in robots.txt, and a link to it has to be in the `head` of the home page. The recommended sizes are 16 by 16, 32 by 32 or 120 by 120 pixels, or SVG. After that you need to send the home page for recrawl: the icon updates within three days.

The conclusion from our case: many Webmaster messages say not that the site has an error, but that the robot has not yet had time to check something. Before fixing anything, open the file yourself: if it responds with 200 and lies where it should, do a recrawl and wait.

## What to do if the site is not indexed

1. Open `your-site/robots.txt`: is there a `Disallow: /` for the Yandex robot?
2. Check that the pages have no `robots` meta tag with the value `noindex` and no `X-Robots-Tag: noindex` header. They are left during development to close the site, and people forget to remove them.
3. Make sure the home page and important pages respond with code 200 without a chain of redirects.
4. Add the sitemap and send the home page for recrawl.
5. Check that links to the new pages come from other pages of the site. A page with no links to it is harder for the robot to find.
6. Wait. A new site usually needs weeks, especially if nobody links to it.

Google has a similar panel: Search Console. It is connected the same way, on the same principle, and shows the same things for that search engine. We connected both.

If you already have a working site and errors and unclear messages have piled up in the panels, an [SEO audit](/services/seo-audit) will help sort them out in order, and [site promotion](/services/seo) will turn indexing into traffic. It is easier to do a site that is only getting ready for launch right from the start: we wrote about this in the article on [choosing between a builder and custom development](/blog/website-builder-or-custom).
