---
title: How to choose a VPS configuration: CPU, RAM and storage
description: Choose a VPS configuration for a website, WordPress, Next.js, online store or bot. Starting CPU, RAM and storage, load checks and server selection advice.
category: sites
date: 2026-11-04
service: support
query: which vps configuration to choose
related: website-hosting, pagespeed-insights, website-cms
---

For a small WordPress website or Node.js application, we recommend considering a VPS with 2 vCPU, 4 GB of RAM and at least 30 GB of SSD storage. This is a starting point for a project with light traffic. A landing page made of ready-built HTML may need fewer resources, while a store with catalogue search may need more.

Choose the configuration around the work your website does: what runs on the server, where the database lives and how many requests arrive at once. Below are starting configurations, signs that you need more resources and a provider we have used for a long time.

## When you need a VPS

A VPS, also called a VDS, gives you access to a virtual server where you install applications and configure how they run. It suits projects that need Node.js, background jobs, their own database or several services with different settings.

For an ordinary WordPress website, consider shared hosting first. If its features are sufficient, maintenance is simpler because the provider handles part of the work. With a VPS, updates, access management and backups need a separate owner. Our [guide to choosing hosting](/blog/website-hosting) explains the options.

## Starting configurations for different projects

Use this table to choose a configuration to test. These are our starting estimates for one small Linux-based project with moderate traffic and the application built elsewhere. The WordPress and store configurations include a small database on the same VPS. A control panel, extra applications and media processing need their own allowance.

| Project | CPU | RAM | SSD storage | What to consider |
| --- | --- | --- | --- | --- |
| Landing page or website made of ready-built HTML | 1 vCPU | 1-2 GB | 20-30 GB | Only a web server and files; a separate VPS may be unnecessary |
| Small WordPress website or blog | 2 vCPU | 4 GB | 30-50 GB | Use page caching and review plugins; photos increase storage needs |
| Small Next.js or Node.js application | 2 vCPU | 4 GB | 30-50 GB | Build elsewhere; frequent server rendering and a local database increase usage |
| Telegram bot without video processing or local AI models | 1-2 vCPU | 2 GB | 20-30 GB | Account for background jobs, message history and concurrent requests |
| Small online store with its database on the same server | 4 vCPU | 8 GB | 60-100 GB | A starting configuration for testing the catalogue, search, cart and inventory integration |

We do not assign a daily visitor limit to these configurations. A thousand views of a ready-built page and a thousand catalogue searches create different workloads. Measurements from your own application determine the final server size.

## Which provider we recommend

<aside class="blog-card hosting-recommendation" aria-label="Timeweb provider recommendation">
  <div class="hosting-recommendation__header">
    <span class="blog-chip">We use it ourselves</span>
    <a class="hosting-recommendation__banner hosting-recommendation__banner--compact" href="https://timeweb.com/ru/?i=137995&amp;a=373" target="_blank" rel="sponsored noopener noreferrer">
      <img src="https://wm.timeweb.ru/images/posters/139x31/139x31-1.jpg" alt="Timeweb" width="139" height="31" loading="lazy" decoding="async">
    </a>
  </div>
  <p>We have used <strong>Timeweb</strong> for a long time and recommend considering it when choosing hosting or a server. Open the provider's VPS/VDS section and compare the available configurations with your project's requirements.</p>
  <a class="hosting-recommendation__button" href="https://timeweb.com/ru/?i=137995&amp;a=373" target="_blank" rel="sponsored noopener noreferrer">View Timeweb offers <span aria-hidden="true">↗</span></a>
  <p class="hosting-recommendation__note">The Timeweb links and banners in this article are affiliate links. If you order a service through them, we may receive a commission.</p>
</aside>

Before paying, check the upgrade process and any downtime it may require. [Timeweb's VDS documentation](https://timeweb.com/ru/docs/vds/) (in Russian) describes scaling CPU, RAM and storage. It also notes that moving to a plan with a smaller disk is not possible. Check current prices and included services when ordering.

## What CPU, RAM and storage affect

### CPU: handling requests

vCPU means a virtual processor available to the server. The vCPU count helps estimate parallel processing capacity, but performance also depends on the physical processor and the plan's terms. Two plans with the same vCPU count can deliver different speeds.

Extra cores help with concurrent requests, background jobs and image processing. If one operation is limited by a single thread, first investigate the operation and single-core performance. Ask the provider whether CPU time is shared and whether sustained workloads face restrictions.

### RAM: applications and the database

The operating system, web server, application and database all use RAM. If several processes run on the VPS, account for their combined usage. A memory shortage can cause the system to terminate an application, while heavy swap use slows request processing.

For a small project, we recommend leaving spare memory for traffic spikes and maintenance jobs. Check available memory and process usage during busy periods. High used RAM alone does not prove a problem: Linux uses some memory for the file cache.

### Storage: files, the database, logs and application releases

Storage holds the operating system, application, uploaded images, database and logs. Keeping previous application releases for rollback also takes space. Measure usage after deployment and estimate how uploads and the database will grow.

Compare SSD or NVMe storage alongside I/O limits, latency and application test results. An NVMe label alone does not guarantee a faster website. For a small site, check response times and database performance on the chosen plan.

Set log size limits. Store backups separately from this VPS and test restoration.

## What to check for WordPress and Next.js

**For WordPress**, check compatible PHP and database versions. At the time of writing, WordPress recommends PHP 8.3 or newer, MariaDB 10.11 or newer or MySQL 8.0 or newer, and HTTPS. Check the [official WordPress requirements](https://wordpress.org/about/requirements/) and plugin compatibility before ordering.

Page caching reduces repeated processing of identical requests. For a store, test the cart and customer account separately: personalised pages must not be served indiscriminately from a shared cache. Many plugins, expensive queries and catalogue imports may need more resources than the table suggests.

**For Next.js and Node.js**, separate build resources from runtime resources. Builds can consume substantial memory; the [Next.js documentation](https://nextjs.org/docs/app/guides/memory-usage) covers ways to monitor it. You can build in CI, such as GitHub Actions, and deliver the finished build to the VPS.

Ready-built HTML pages require less computation per request than pages with frequent server rendering. If you add a database, job queue or image processing to the same server, review the starting configuration. For self-hosting, Next.js also recommends a reverse proxy such as Nginx in front of the application, as described in its [self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting).

## How to test a configuration before launch

1. Deploy the application and a database close to the expected production size. An empty catalogue will not show how product search performs.
2. Test the main actions: opening pages, submitting a form, searching, signing in and placing an order.
3. Apply the expected concurrent load to your own test server. Compare latency and errors during normal activity and a spike.
4. Monitor CPU usage, available RAM, swap activity, disk latency and database resource use at the same time.
5. Test during backups, imports and background jobs. Those processes use resources too.
6. Set up external availability checks and alerts. Our [site monitoring](/pulse) helps detect downtime; collect resource metrics separately.

Use [PageSpeed Insights](/blog/pagespeed-insights) to check individual pages. It helps identify loading problems but does not replace testing the server under concurrent load.

## When to add resources

If CPU stays busy during normal operation, identify the processes and queries responsible. After reviewing caching and code, consider adding CPU capacity. If the application runs out of memory or constantly uses swap, investigate RAM consumption and add memory if necessary.

Increase storage to accommodate database and upload growth. Set disk space alerts and remove old logs. When database requests become heavy, moving the database to a separate server can be more useful than expanding the shared VPS.

Choose a configuration you have tested with your project and check the upgrade terms in advance. For a new small website, start with the table's estimate and adjust it after your first measurements.

<aside class="hosting-banner" aria-label="Timeweb affiliate banner">
  <a class="hosting-banner__link" href="https://timeweb.com/ru/?i=137995&amp;a=437" target="_blank" rel="sponsored noopener noreferrer">
    <img src="https://wm.timeweb.ru/images/posters/890x90/890x90-1.jpg" alt="Timeweb" width="890" height="90" loading="lazy" decoding="async">
  </a>
  <p class="blog-muted">Timeweb affiliate link.</p>
</aside>

## What else to check before ordering

Check the data centre location, support scope, backup costs and plan change rules. If nobody on your team administers Linux, budget for maintenance or consider a provider-managed service.

If you need a server for an existing website, migration and backup setup, see our [website technical support](/services/support). To size the server, we will need the project's stack, database size, file storage usage and current server metrics if available.
