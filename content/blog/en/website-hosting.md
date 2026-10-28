---
title: How to choose website hosting in Russia: types, criteria, mistakes
description: Which hosting to choose for a website: shared, VPS or cloud. What to check before paying, and why a site with a request form in Russia needs a server in Russia.
category: sites
date: 2026-10-28
service: support
query: website hosting
related: domain-for-website, pagespeed-insights, how-to-create-a-website
---

Hosting is the server that holds a website's files, database and email. It decides how fast the site opens, whether it survives a rush of visitors and what happens to the data if the server breaks. For sites with a request form in Russia, the choice of hosting is also a legal matter.

Below: the types of hosting, which one suits whom, what to check before paying and how the hosting of this site is set up. There is no "best hosting" ranking here: we take no commission from providers and go through the criteria you can use to choose yourself.

## What hosting is

A website is files and a program that must run around the clock on a computer connected to the internet. A hosting provider rents out such a computer or a part of it. The site's address is bought separately, from a domain registrar: how to choose it is covered in our article on [a domain for a website](/blog/domain-for-website).

## Types of hosting

- **Shared hosting.** Hundreds of sites share one server. It is cheap and needs almost no setup: there is a control panel, databases, email. It suits a business card site, a landing page, a WordPress blog. The downsides: limits on resources and software, and neighbours on the server can slow your site down.
- **VPS (VDS).** A virtual server with guaranteed resources and full access. You can install anything: Node.js, your own database, queues. It needs someone to set up and update the server, otherwise it soon becomes vulnerable.
- **Dedicated server.** A whole physical machine for one project. Large stores and high-load services need it.
- **Cloud and developer platforms.** Resources grow with the project, and you pay for actual use. Convenient for web applications, but the bill is harder to predict.
- **Website builder hosting.** A site on a builder lives on the builder's servers, so no separate hosting is needed, but the site usually cannot be moved to another provider either.

## Where the server should be

If the site has a request form, you collect personal data: a name, a phone number, an email. Under part 5 of article 18 of [Federal Law 152-FZ](https://www.consultant.ru/document/cons_doc_LAW_61801/) (in Russian), the personal data of Russian citizens must be recorded and stored in databases located in Russia. So the server of such a site, and the database of requests with it, should be in a Russian data centre.

There is a practical reason as well: the closer the server is to visitors, the faster the site responds. For an audience in Russia, a server in Moscow, St Petersburg or Novosibirsk will respond faster than one in Europe or the US.

## What to check before buying

1. **Technologies.** WordPress and most CMSs run on PHP and MySQL, which any shared hosting has. Sites built with Next.js or Node.js need a VPS or a platform that can run Node.js.
2. **Resources.** CPU, memory and an SSD or NVMe disk. The smallest plan is enough for a business card site; an online store with a catalogue of thousands of products needs more.
3. **Server response time.** You can see it in [PageSpeed Insights](/blog/pagespeed-insights) as the time to first byte. Many providers offer a trial period: put the site there and measure before paying.
4. **Backups.** How often they are made, how long they are kept, whether you can restore the site yourself. A copy on the same server will not help if the server fails.
5. **HTTPS.** A free Let's Encrypt certificate with automatic renewal should be a couple of clicks away.
6. **Support.** Whether it works around the clock and answers to the point. Ask a question before buying and time the answer.
7. **The renewal price.** As with domains, the first period is often sold at a discount. Check the price of the second year.

## How the hosting of our site is set up

This site is built with Next.js. It first lived on a foreign developer platform and now runs on its own VPS in a Russian data centre. The server is modest: one CPU core and 2 GB of memory. To make that enough, the heavy build of the site runs on GitHub: after each change the finished build moves to the server by itself, the site restarts, and the system checks that it responds. The server keeps the last three versions, so rolling back takes a minute.

What we took from this experience:

- **A small VPS is enough for a fast site** if the pages are built in advance and the server hands out ready HTML. Mobile speed then depends more on the site itself than on the plan.
- **Check that outside services work from the server.** From our server, requests to Telegram go through with interruptions, so we made sending requests to Telegram retry.
- **Watch the site from the outside.** The server can be running while the site does not open: the certificate has expired, the application has crashed, the disk is full. Our free [site monitoring](/pulse) checks the site every 10 minutes and writes to Telegram if it stops opening or the certificate is about to expire.

## How to move to another hosting

A move is needed when the site has outgrown its plan, the provider works badly or has raised prices. The order is:

1. Copy the site's files and database to the new server.
2. Check the site on the new server at a temporary address.
3. Lower the time-to-live of the DNS records in advance so the change of address spreads faster.
4. Switch the domain's A record to the new server and issue a certificate.
5. Keep the old server for a few more days until everyone has moved to the new one.

## Common mistakes

- The cheapest shared hosting was taken for an online store, and the site slows down at peak hours.
- Backups are not set up or are kept on the same server.
- The hosting is registered to the contractor, and after parting there is no access to the server.
- The server with the database of requests is abroad.
- Nobody watches the site, and the business learns about an outage from its clients.

If the site already works and you need to move it, set up backups or simply hand off the server worries, that is what our [website technical support](/services/support) is for. And if there is no site yet, start with the [overview of the ways to create a website for a business](/blog/how-to-create-a-website).
