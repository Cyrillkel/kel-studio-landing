---
title: How to choose and buy a domain for a website: name, zone, renewal
description: How to choose a domain name and zone, where to buy a domain for a website, whose name to register it in and how not to lose it at renewal, with our own example.
category: sites
date: 2026-10-28
service: vizitka
query: buy a domain for a website
related: website-hosting, how-to-create-a-website, yandex-webmaster
---

A domain is the address of a website on the internet, for example `kel.agency`. It is rented for a year or more and then renewed. Choosing a domain is not hard, but it is easy to make a mistake you will be fixing for years: registering the address in a contractor's name, forgetting about renewal, or buying a zone that becomes six times more expensive a year later.

Below, step by step: how to choose the name and the zone, where and how to buy a domain for a website, what to set up after buying and how not to lose the address. The examples come from our own work: this site lives on `kel.agency`, which we bought in September 2026 and set up ourselves.

## What a domain is

A domain consists of a name and a zone: in `kel.agency` the name is `kel` and the zone is `.agency`. A zone can be national (`.ru`, `.de`, `.uk`), generic (`.com`, `.net`, `.org`) or themed (`.agency`, `.studio`, `.shop`).

A domain and hosting are different services. The domain is the address, hosting is the place where the site's files live. You can buy both from one company, but you do not have to: our domain is with one registrar, while the site runs on a separate server. How to choose the server is covered in our article on [hosting for a website](/blog/website-hosting).

## How to choose the name

A good name is easy to dictate over the phone and to remember the first time. Check it against this list:

- **Short.** Up to 10-12 letters, ideally one or two words. Long addresses get mistyped more often.
- **No hyphens or digits.** They have to be spelled out separately: "with a hyphen", "as a digit or a word".
- **No ambiguous spelling.** Words that sound the same but are spelled differently send people to someone else's site.
- **Matches the company name.** If the exact name is taken, add a relevant word: the city, the service, `studio`, `group`.
- **Not someone else's brand.** A domain with someone else's trademark can be taken away in court. Check trademark registers before buying.
- **A clean history.** If the name was used before, look it up in the Web Archive and in search: the address may still be in spam databases or under search engine filters.

## Which zone to choose

- **`.ru`** is the most familiar zone for an audience in Russia. It suits almost everyone there.
- **The Cyrillic zone of Russia** (`.xn--p1ai` in its technical form) gives an address in Cyrillic letters, easy to dictate in Russian. But in email, messengers and ad accounts it often turns into that technical form, so email on such a domain is rare.
- **`.com`** is for international projects and a spare address if you work beyond one country.
- **Themed zones** like `.agency`, `.studio`, `.online` are for when the short name in the main zone is taken. That is how we chose `kel.agency`.

The zone barely affects search rankings. The region where the site should be shown is set in [Yandex Webmaster](/blog/yandex-webmaster) (and the target country in Google Search Console): for a site on a generic zone it is worth setting right away.

## Where and how to buy a domain

A domain is bought from a registrar. For `.ru` and the Cyrillic zone these are companies accredited by the Coordination Center for TLD RU, listed on `cctld.ru`. International zones are sold by ICANN-accredited registrars.

What to look at when buying:

1. **Whose name the domain is in.** The domain's registrant is its legal owner. Register the domain in your own name or your company's, even if the developer makes the purchase. An address registered to a contractor will have to be bought back or recovered in court when you part ways.
2. **Identity check for the Russian zones.** Since September 1, 2026, a domain in these zones can be registered and renewed only after the owner's identity is confirmed through Gosuslugi, the Russian state services portal. This is required by Federal Law 569-FZ; details are in the [Coordination Center's FAQ](https://cctld.ru/help/faq/) (in Russian). A company needs a Gosuslugi account of its own with an employee who has rights to manage domains.
3. **The renewal price.** The first year is often sold at a discount. Our `kel.agency` cost 5.18 dollars for the first year, and renewal costs about 32.70 dollars a year. Check the price of the second year before buying.
4. **The contact email.** Use a shared company mailbox, not an employee's personal email: renewal notices are sent there.

## What to set up after buying

A domain on its own does not lead anywhere yet. After buying:

- **Point the domain at the server.** In DNS you add an A record with the server's address for the domain and for `www`. One of the two addresses becomes the main one, the other redirects to it. Ours is `kel.agency` without `www`.
- **Set up email on the domain.** The MX, SPF, DKIM and DMARC records come from the email service. We moved DNS to the provider that hosts our email, and it added these records itself.
- **Issue an HTTPS certificate.** A free Let's Encrypt certificate renews automatically, and almost any server supports it.
- **Add the site to the search engines' panels:** Yandex Webmaster and Google Search Console.

## How not to lose the domain

Domains are most often lost because of a missed renewal: the card expired, notices went to a former employee's mailbox, and the site and email stopped working on the same day.

- **Turn on auto-renewal** and keep some money on the registrar account.
- **Remember the period after expiry.** Domains in `.ru` and the Cyrillic zone have 30 days during which the previous owner can still renew the address. But all that time the domain is taken out of delegation: the site and email do not work.
- **Mind the transfer restriction.** A domain in an international zone usually cannot be moved to another registrar for the first 60 days after purchase. We ran into this when we wanted to keep the domain and the email with one provider, and in the end moved only DNS.
- **Watch the date automatically.** Our free [site monitoring](/pulse) in Telegram looks up in the registry when the domain is paid until and warns 30, 14, 7, 3 and 1 day ahead. The domain's expiry date is also shown by our free [site check](/site-check).

## Common mistakes

- The domain is registered to a freelancer or a web studio, and the company owner cannot manage it.
- The zone was chosen by the first-year price, and renewal costs much more.
- The name is hard to dictate, clients mistype it and end up on other sites.
- Renewal notices go to a mailbox nobody reads.

A domain is the first step towards a website. Next come hosting, design and the site itself: see our [overview of the ways to create a website for a business](/blog/how-to-create-a-website). If you need a small company website built for you, look at our [business card website](/services/vizitka) service: we will help you choose the domain and register it in your name, set up email and HTTPS.
