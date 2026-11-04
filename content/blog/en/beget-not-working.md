---
title: Beget outage: what happened and what to do if your site is down
description: Beget is down and your website will not open: what is known about the cyberattack, how to check your project and prepare backup hosting with another provider.
category: sites
date: 2026-11-04
service: support
query: beget what happened
related: website-hosting, vps-configuration, domain-for-website
---

If Beget is down and your website will not open, start with the provider's official updates and checks of your own project. For a business, the next question is practical: where to find current data and how to restore visitor access while the primary hosting recovers.

We explain the incident, ways to distinguish a DNS problem from an application error, and the role of backup hosting with another provider. For a standby location, we recommend considering Timeweb, which we have used for a long time.

## What happened to Beget

Beget reported a cyberattack overnight on 1-2 November 2026. The company says attackers reached management servers and ran data-erasing software. Servers were disconnected to contain the attack. This account appears in [Beget's official incident timeline](https://beget.com/ru) (in Russian).

**Information snapshot: 4 November 2026, 01:00 Moscow time.** By this update, the company reported the first websites running after restoration of part of its shared hosting. Check individual projects separately. Consult the provider's page and [official channel](https://t.me/beget_official) for later developments.

## Why a website hosted on Beget may not open

An outage can affect the server, database, email and domain management at the same time. One browser error does not reveal the state of the whole infrastructure. Identify where the request fails.

| What visitors see | Possible cause | What to check |
| --- | --- | --- |
| The browser cannot find the website address or shows a DNS error | DNS, domain delegation or zone record problems | Domain expiry, nameservers, A and AAAA records |
| A connection attempt times out | The server is offline, the network is unavailable or a connection is blocked | Availability from another network and provider updates |
| A 502 or 504 error | The proxy cannot get a valid or timely application response | Application status, logs and database connectivity |
| The home page opens but a form or cart fails | A particular service, database or integration is failing | Form delivery, checkout, APIs and background jobs |

These are diagnostic possibilities rather than a description of every Beget customer's situation. Once the home page returns, check the actions that bring enquiries and sales.

## Beget is down: what a website owner can do

1. Read the official update and identify the affected service: shared hosting, VPS, DNS or email. Keep the support ticket number.
2. Open the site through a home connection and a mobile network. This can reveal a problem affecting only some visitors.
3. Find the latest accessible backup. Check the dates of files, the database export and user-uploaded documents. Keep the original backup separately from the working copy.
4. Check access to the domain registrar and DNS. Changing servers usually requires record changes; transferring the domain registration to another company is not always necessary.
5. Assess what you can restore now: the complete project, a catalogue without checkout or a contact page. A form on the temporary page must deliver enquiries through an available service.

If the site accepts orders, temporarily direct advertising traffic to a working contact channel. Tell staff that notifications may be delayed. An empty inbox does not prove that no customers tried to contact you.

## Why keep servers with different providers

A second server is useful when its environment is ready, a current project copy is available and the switching process is understood. Searching for an archive and reconstructing application settings during an outage adds recovery time.

We recommend separating primary hosting, the standby location and backup storage. Choose different data centres where practical and check shared dependencies. Two VPS instances with one provider may rely on the same control panel, network or account.

Different companies can share some dependencies too. Alongside the provider choice, check who runs DNS, how secrets are stored and who can delete backups. Use the Beget outage as a reason to test recovery from a failure at any hosting company.

| Backup arrangement | Suitable for | What to prepare |
| --- | --- | --- |
| Backups outside primary hosting | A small website that can tolerate deployment time | An archive, database export and recovery instructions |
| A standby server with its environment ready | An enquiry website, catalogue or company portal | Compatible software, data updates and a tested manual switch |
| Automatic failover | A project with strict availability requirements | Health checks, an independent switching point and consistent database handling |

First define acceptable data loss and downtime. A daily database export may suit a rarely updated business card website. A store receiving orders throughout the day needs more frequent synchronisation and separate checks of payment and inventory recovery.

## Timeweb as backup hosting

<aside class="blog-card hosting-recommendation" aria-label="Timeweb as a standby hosting location">
  <div class="hosting-recommendation__header">
    <span class="blog-chip">We use it ourselves</span>
    <a class="hosting-recommendation__banner hosting-recommendation__banner--compact" href="https://timeweb.com/ru/?i=137995&amp;a=373" target="_blank" rel="sponsored noopener noreferrer">
      <img src="https://wm.timeweb.ru/images/posters/139x31/139x31-1.jpg" alt="Timeweb" width="139" height="31" loading="lazy" decoding="async">
    </a>
  </div>
  <p>We have used <strong>Timeweb</strong> for a long time and recommend considering it as a standby location for a project currently hosted on Beget. Check plan compatibility in advance, deploy a copy and test the switch.</p>
  <a class="hosting-recommendation__button" href="https://timeweb.com/ru/?i=137995&amp;a=373" target="_blank" rel="sponsored noopener noreferrer">Choose backup hosting on Timeweb <span aria-hidden="true">↗</span></a>
</aside>

For a CMS-based website, consider shared hosting with the required PHP and database versions. Node.js, background jobs or a custom set of services usually call for a VPS. Our [server configuration recommendations](/blog/vps-configuration) cover starting resources, while the [hosting selection guide](/blog/website-hosting) explains the service types.

Test whether the standby can handle the expected workload. It needs updates, protected access and backups outside its own infrastructure too. Our Timeweb recommendation comes from experience using it; test your own project before relying on the arrangement.

## How to move a website from Beget to a standby server

1. Prepare a clean environment with compatible software versions. After a security incident, check backups for malicious files, update the application and replace affected passwords, keys and tokens.
2. Restore files and a matching database backup. Transfer user uploads and integration settings separately.
3. Test through a temporary address or a local domain mapping. Check HTTPS, forms, email, payments and scheduled jobs.
4. For a store, decide which database accepts new orders. Restrict writes on the old location during the switch or use a synchronisation process prepared in advance. Two diverging databases can lose orders and create inventory conflicts.
5. Update A and AAAA records where the corresponding protocols are used. Check the root domain and www separately. If moving DNS, preserve required MX and TXT records so email and service verification keep working.
6. Confirm that visitors reach the standby and enquiries arrive. When the primary server returns, reconcile data before planning a switch back.

DNS records are cached, with cache duration controlled by TTL. Lower it in advance: a new value does not cancel an old cached response. [Cloudflare's TTL documentation](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/) explains caching behaviour. A low TTL also cannot fix unavailable authoritative nameservers or lost access to zone management.

## Keep backups and monitoring separate

A backup must remain accessible when the primary hosting control panel is unavailable. Keep several versions, restrict deletion rights and test restoration. CISA recommends isolated encrypted backups and regular recovery testing in its [ransomware protection guide](https://www.cisa.gov/sites/default/files/2023-10/StopRansomware-Guide-508C-v3_1.pdf).

Synchronisation can carry deletions or corrupted data to the standby. Returning to a point before the incident requires a retained previous version. A standby server and backup history serve different purposes.

External [site monitoring](/pulse) helps detect downtime and sends a Telegram notification. A home page check does not confirm that a visitor can place an order. Important operations need separate application or support team checks.

<aside class="hosting-banner" aria-label="Timeweb banner">
  <a class="hosting-banner__link" href="https://timeweb.com/ru/?i=137995&amp;a=437" target="_blank" rel="sponsored noopener noreferrer">
    <img src="https://wm.timeweb.ru/images/posters/890x90/890x90-1.jpg" alt="Timeweb" width="890" height="90" loading="lazy" decoding="async">
  </a>
</aside>

## Handling SEO during an outage

If primary content is temporarily unavailable and you control the server response, serve a maintenance page with HTTP status 503. Restore complete pages with status 200 afterwards. Google says 5xx errors reduce crawling and persistently unavailable URLs can eventually leave the index. Its [HTTP status code documentation](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes) explains the behaviour.

Keep the domain, page URLs, canonical links and redirect rules when switching hosting. Check robots.txt and sitemap.xml availability, accidental noindex directives and internal links. After recovery, request recrawling of important URLs in the webmaster tools you use.

## Where to start preparing a standby

Check the date of the latest backup and restore it at a separate location. Record who changes DNS, where they obtain access and how they check enquiries after switching. Rehearse recovery and measure how long it takes.

For help moving a website from Beget, preparing a Timeweb standby or setting up backups and monitoring, see our [website technical support](/services/support). To begin, we need the project's stack, data volume and acceptable downtime.
