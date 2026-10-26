---
title: How to build a keyword map for a website: our step-by-step example
description: What a keyword map (semantic core) is and how to build one: seed phrases, Wordstat, frequencies, negative keywords, clusters. Our map: 773 queries, 19 pages.
category: seo
date: 2026-10-26
service: seo
query: keyword map
related: sitemap-robots-txt, yandex-webmaster, how-to-create-a-website
---

A keyword map, which Russian SEO calls a "semantic core", is a list of the search queries people use to look for what you sell, distributed across the pages of the site. It tells you which pages you need, what to call them, what to write in the text and which topics to leave for the blog. Without one, a site is built on the owner's guesses, and later it turns out there is nowhere to send people who search for a "business card website".

Below: how to build a keyword map on your own, from the first phrases to assigning queries to pages. We use the map we built for kel.agency on September 30, 2026: 219 seed phrases, 773 commercial queries for 19 pages and 320 queries for articles. Our market is Russian and the data comes from Yandex, so the queries below are shown in translation.

## What a keyword map consists of

A keyword map has three parts:

- **Queries with their frequency.** What people type into search and how many times a month. The frequency comes from Yandex Wordstat.
- **Groups (clusters).** Queries that one page can answer. For example, "order a landing page", "turnkey landing page development" and "landing page price" are one group.
- **Pages.** Each group belongs to one page, and the page has a main query. It goes into the title, the address and the first paragraph.

A list of keywords without groups and pages is not a keyword map yet: it does not tell you what to do next.

## Why a site needs one

The map answers questions that are otherwise settled by guesswork:

- **Which pages you need.** Ours showed 12 groups of queries the site had no pages for. After that, 11 new service pages appeared (business card sites, SEO audit, Telegram bots, Mini Apps and others), plus a pricing page.
- **What to call a page.** People search for "business card website", not "the company's representative online resource". Words from the queries go into the headings, and Yandex understands more easily what the page is about.
- **What to write about in the blog.** Informational queries ("how to build a semantic core", "what is a landing page") fit service pages poorly, but they make a plan of articles. Our blog plan is 74 topics from the map.
- **Which ads to run.** The same queries and negative keywords are useful for [Yandex Direct](/services/yandex-direct) campaigns.

## Step 1. Write seed phrases

A seed phrase (Russian SEO calls it a "mask") is a short phrase of one or two words that collection starts from: "website creation", "turnkey website", "website promotion". Wordstat shows every query that contains these words.

How to make the list of seed phrases:

1. Write down all your services and products, even minor ones.
2. Add synonyms and colloquial variants to each: "creation", "development", "making", "build".
3. Add buyer actions: "order", "buy", "price", "cost".
4. For the blog, add the questions people start with when they explore a topic: "what is", "how to choose", "how to make".

We ended up with 219 seed phrases. The broadest of the ones about websites were "make a website" (179,351 queries a month with all their tails) and "website creation" (124,481).

## Step 2. Collect queries in Wordstat

Yandex Wordstat is a free Yandex service with query statistics. Enter a seed phrase, and it shows the queries containing it, with the number of searches over the last 30 days.

Before collecting, set:

- **Region.** If you work in one city, choose it. We work across Russia, so we collected for the whole country and removed queries with city names.
- **Devices.** Usually all of them: phones and computers.
- **Frequency threshold.** Queries searched a couple of times a month only bloat the table at the start. We cut off everything below 3 to 15 searches, depending on the seed phrase.

Collection for one phrase is limited in rows, and for a broad seed phrase the list gets cut off: for "website creation" ours hit 2,000 rows. If that happens, split the seed phrase into narrower ones: instead of "website creation", separately "business card website creation", "online store creation" and so on.

By hand this takes long: hundreds of seed phrases, each with several pages of results. For big maps people use programs that collect Wordstat data automatically, but the logic is the same.

## Step 3. Check the exact frequency

The number Wordstat shows for a phrase without operators is the broad frequency. It includes every query containing these words, in any form and with any tails. The real demand for the phrase itself only shows up with operators. According to the [Wordstat help](https://yandex.ru/support2/wordstat/en/content/operators):

- `" "` - quotes fix the number of words: only this phrase without extra words is counted;
- `!` before a word fixes its form: Russian words change their endings, and `!` counts only this exact form;
- `+` fixes prepositions and other function words;
- `[ ]` fix the word order;
- `-` excludes a word;
- `( )` and `|` list alternatives: "order (website|landing page)".

The exact frequency is checked like this: the phrase in quotes with "!" before every word, for example `"!order !website"`. The difference can be huge. In our map:

- "order a website": broad frequency 107,174, exact 431;
- "website creation": broad 124,483, exact 1,608;
- "order a landing page": broad 450, exact 115.

So "order a website" on its own is typed 431 times a month across all of Russia. The other hundred thousand are "order a website for a business", "order a website cheap", "order a restaurant website" and thousands of other phrases, including some that have nothing to do with web development. Make decisions about pages by the exact frequency, and use the broad one to size the whole topic.

## Step 4. Clean the map with negative keywords

The collected list has a lot of noise: queries with the words from the seed phrase, but about something else. Everything that will not bring you a client has to go.

Two examples from our map. The seed phrase "order a website" pulls in queries about pharmacies, medicines, tickets and delivery: the words "order" and "website" are there, but the person wants to buy pills, not a website. That is why in our table this seed phrase is written with exclusions: `order website -pharmacy -official -medicines -tickets -delivery -buy -catalog -goods -groceries`. The seed phrase "indexing" for SEO articles gave 654,610 searches, and most of them were about the indexation of pensions: those queries had to go as well.

Negative keywords are easiest to keep as a list by group. We have 11 groups; here are the main ones:

- education and jobs: courses, vacancy, resume, earnings;
- "do it yourself": free, on my own, template, download;
- website builders and platforms we do not work with;
- social networks and marketplaces;
- navigational: login, personal account, official, reviews;
- games, films, music, adult topics;
- cities, since we work across the whole country.

The same list is useful in advertising: in Yandex Direct a negative keyword cuts off all of its forms.

## Step 5. Work out what the person wants to find

The same words are searched with different goals. Three types of queries are usually distinguished:

- **Commercial** - the person is looking for a contractor or a price: "order a landing page", "online store development". They lead to service pages.
- **Informational** - the person is figuring things out: "what is a landing page", "how to build a semantic core". They lead to the blog.
- **Navigational** - the person is looking for a specific site or service. They are usually left alone: there is no getting in there.

Frequency is deceptive here. "Yandex Direct" has an exact frequency of 137,835 searches a month, but most of these people probably want to open the service itself, not to order ad setup. "Landing page" has 5,734 exact searches, but the query is mixed: some people look for a contractor, others want to understand what it is.

The most reliable way to check a query is to open the search results. If the top ten are articles and dictionaries, the query is informational, and a service page will not rank for it. If it shows studios and prices, the query is commercial. Of the 773 queries for our service pages, 633 turned out to be purely commercial and 140 mixed: their results show both articles and services.

## Step 6. Distribute queries across pages

Clustering means grouping the queries that one page answers. The main rule: queries go into one group if their search results show similar sites. If "business card website" and "business card website creation" show the same sites in the top ten, that is one group. If the results differ, as with "landing page" and "business card website", those are different pages.

For each group:

1. Choose the main query, the most frequent of those that are definitely about this page.
2. Check that the site has such a page. If not, that is the first task.
3. Do not make two pages for one group: they will compete with each other in search, and both will rank lower.

A few groups from our map:

- **Landing page** (`/services/landing`): main query "order a landing page", 62 queries, 7,929 searches a month by exact frequency.
- **SEO promotion** (`/services/seo`): main query "website promotion", 188 queries, 13,541 searches.
- **Online store** (`/services/ecommerce`): main query "online store development", 29 queries, 1,485 searches.
- **Business card website** (`/services/vizitka`): main query "business card website", 15 queries, 848 searches. We had no such page before the map.

Distributing hundreds of queries by hand takes long. There are services that compare the search results for queries and group them automatically, but the result is still worth reviewing yourself.

## What to do with the map next

A finished keyword map is a work plan:

1. **Create the missing pages.** For us that was 11 services and the pricing page.
2. **Rewrite titles and descriptions.** The main query goes into `title`, `h1`, the address and the first paragraph; the other queries of the group go into subheadings and the text, without repeating them for the sake of it.
3. **Link the pages.** Blog articles lead to services, services lead to related services.
4. **Plan the blog.** Informational groups become article topics, the most frequent ones closest to your services first.
5. **Check that search engines see the pages.** New addresses have to get into the sitemap and must not be closed in robots.txt: see our article on [robots.txt and sitemap.xml](/blog/sitemap-robots-txt).

After two or three months, open the search queries section in [Yandex Webmaster](/blog/yandex-webmaster): it shows which phrases the site already appears for. Add new phrases from this report to the map. Rebuild the whole map every six months to a year, or when you add new services.

## Common mistakes

- **Going by the broad frequency.** "A hundred thousand a month" for a phrase without quotes can turn out to be a few hundred real queries, as it did for us with "order a website".
- **Not looking at the search results.** A query with a good frequency can be purely informational, and a service page will not rank for it.
- **Leaving the noise in.** Without negative keywords the map keeps "vacancies", "free" and other companies' brands, and the texts get written for the wrong people.
- **Chasing only the frequent queries.** A new site gets ahead faster on narrow, low-frequency phrases: "turnkey corporate website development" instead of "website creation".
- **Building it and forgetting it.** A keyword map without pages, titles and articles changes nothing.

If you want the map built and turned into a site structure and a plan of texts, that is part of our [SEO promotion](/services/seo) work. If the site already works and it is unclear why it does not grow, start with an [SEO audit](/services/seo-audit): it shows which pages and queries are missing. And if the site is only being planned, first read [how to create a website for a business](/blog/how-to-create-a-website): a keyword map is best built before the structure is drawn.
