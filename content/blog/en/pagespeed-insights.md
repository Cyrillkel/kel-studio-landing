---
title: PageSpeed Insights: what the scores mean and how to speed up a site
description: What PageSpeed Insights scores and the LCP, CLS and TBT metrics mean, why the numbers jump around and how we raised a client's mobile score from 71 to 96.
category: seo
date: 2026-10-16
service: seo-audit
query: pagespeed insights
related: yandex-webmaster, how-to-create-a-website, yandex-metrika-goals
---

PageSpeed Insights is a free Google service: it opens a page, measures its speed and gives a score from 0 to 100, separately for a phone and for a computer. This figure is often taken as the final verdict, although behind it there are several metrics and two different sets of data. Below we look at how to read the report, which metrics matter, why the result changes from run to run and what finally speeds a site up. As an example we took the corporate WordPress site of one of our clients: its mobile score rose from 71 to 96.

We include a speed check in the [SEO audit](/services/seo-audit), so we work with these reports regularly.

## How to read the report

The report has two blocks of data. Confusion between them is a frequent reason for arguments like "I have 95, and the contractor has 70".

**Real-visitor data.** The block at the top of the report. According to [Google's help](https://developers.google.com/speed/docs/insights/v5/about), these are measurements of real Chrome users over the last 28 days. The final value is taken at the 75th percentile: three loads out of four meet it. New and small sites often do not have this block, because there is too little data.

**The lab run.** The block with the round score. Google loads the page once on an emulator. For a phone it is a mid-range smartphone on a throttled mobile network, for a computer an ordinary PC with a wired connection. The run happens in a Google data center, and the result is affected by the load on the network, the hardware and the server. The help says directly that such measurements fluctuate, so two runs in a row give different numbers.

The score is divided into three zones: 90-100 is good, 50-89 needs improvement, below 50 is poor.

With our client the spread was visible at once. On one day Google showed 87 points for the phone, while our measurement of the same site with the Lighthouse program, run on our side, gave 94-99. So compare the numbers of one tool before and after the changes, and run the check several times.

## Which metrics to look at

Google singles out three page quality metrics, called Core Web Vitals. According to [web.dev](https://web.dev/articles/vitals), a result counts as good if three loads out of four fit within these limits:

- **LCP** shows how long it takes for the main block of the page to appear on screen: a large picture or a paragraph. Good is no more than 2.5 seconds.
- **INP** shows how quickly the page reacts to taps and input. Good is no more than 200 milliseconds.
- **CLS** shows how much the elements shift and "jump" during loading. Good is no more than 0.1.

In the lab run, reaction to taps is replaced by the TBT metric: how long the page was busy with scripts and did not respond. For a first acquaintance three questions are enough. Does the main block appear quickly (LCP)? Does the page jump while loading (CLS)? Does it freeze (INP and TBT)?

## An example: a client's site, from 71 to 96 points

In August the corporate WordPress site scored about 95 points on a phone. Then new blocks were added to it: a quiz, prices, geography and others, and the page became noticeably heavier. By mid-October PageSpeed showed 71 points on the phone: the main block appeared in 8.0 seconds, the first content in 2.7. On the computer the score jumped between 91 and 98, because the layout shifted during loading (CLS 0.16 against the allowed 0.1).

We measured the site with the Lighthouse program and analyzed the load recordings. We found seven causes:

1. **The first screen "jumped".** The starting styles did not match the full ones: when the main styles were connected, the page shifted. We rebuilt the starting styles from the real stylesheet, and now the first screen looks the same before and after loading.
2. **The page was laid out three times.** It had grown to 19 blocks, and the browser laid it out in full three times during loading: at the first paint, when the full styles were connected and when the scripts started. Now blocks below the first screen are not painted until the visitor scrolls to them.
3. **Extra emoji images.** The built-in WordPress script replaced 64 emoji with images if the browser did not pass its check: 41 additional requests to the server. We turned the replacement off, and the system draws the emoji itself. Flags that do not exist in Windows are still replaced with images.
4. **The icon font.** It weighed 274 KB for 70 icons out of about 2,500 that lay in the file. We kept the 70 needed ones, and now it is 9 KB.
5. **The photo slider.** It loaded all 12 photos at once, more than 800 KB. Now the photos load when the card scrolls close to the screen.
6. **Visits from advertising.** Links from advertising and search with tags (`utm`, `yclid`) bypassed the cache, and the server built the page anew in 1.3-2.4 seconds. Now the tags do not interfere with the cache, and the page is served ready in 0.2-0.26 seconds.
7. **The Metrica counter.** It started at once and competed with the rendering of the page. Now it is requested after the first frame appears.

All of it took about two days. The result according to PageSpeed Insights reports and our measurements on the live site:

- **Score on a phone:** 71 → 96.
- **Main block on screen (LCP) on a phone:** 8.0 s → 2.2 s.
- **First content on a phone:** 2.7 s → 0.9 s.
- **Score on a computer:** 91-98 (jumping from run to run) → 99.
- **Requests when loading the home page:** 76 → 19.
- **Weight of the home page when loading:** 1.5 MB → about 350 KB.

Three conclusions are useful from this case. Speed falls as a site grows: the client had no breakage, the points left together with the new blocks. The same number hides different causes, and the report has to be taken apart item by item. It is best to start with the findings that save the most time.

## What most often slows sites down

- **Images.** Huge files and no set sizes: the page shifts when the picture has loaded.
- **Fonts and icons.** The full set of characters is connected, although the site uses a small part.
- **Scripts.** Analytics, online chats and widgets load before the content.
- **Heavy blocks.** Sliders, maps and videos that load completely when the page opens. A map can be loaded when the visitor scrolls to it.
- **Cache.** There is none, or it does not work because of tags in the links.
- **Server.** The page starts to be served in more than a second.
- **CMS plugins and themes.** Each adds its own files, and together dozens of them add up.

Specific findings with an estimate of the gain in seconds and kilobytes are listed in the diagnostics block at the bottom of the report. Google changes its name from time to time, so go by the meaning.

## Do you need to get to 100 points

Not necessarily. Google [writes](https://developers.google.com/search/docs/appearance/core-web-vitals) that it strongly recommends site owners to achieve good Core Web Vitals, and counts them as page quality that its core ranking systems reward. The metrics are not named there as a direct ranking factor. Speed does not replace content: a page that opens slowly and does not answer the query loses on two counts at once. The practical sense is simpler: a person who waits several seconds for a page to load leaves, and you have already paid for the click on the ad.

A reasonable goal is the green zone on a phone, from 90 points, and "good" real-visitor metrics. A visitor will not notice the difference between 96 and 100, while it costs a lot.

## How to check your site in ten minutes

1. Open [pagespeed.web.dev](https://pagespeed.web.dev/), paste the address of the home page and click "Analyze".
2. Start with the "Mobile" tab: most visitors come from phones.
3. Look at the real-data block, if there is one, and at the three metrics: LCP, INP and CLS.
4. Run the check two more times and take the typical value.
5. Open the diagnostics block and write down the three items with the biggest savings.
6. Check a second page: a service or a product card. The home page is often lighter than the rest.
7. Repeat the check after every noticeable change on the site: our client's site lost points while it grew.

If red and orange items remain in the report and the causes are unclear, an [SEO audit](/services/seo-audit) will go through speed together with indexing and structure. Changes in the code and in cache settings on [WordPress](/services/wordpress) and [React and Next.js](/services/react-nextjs) we make ourselves. About other steps after a site launch read in the articles on [Yandex Webmaster](/blog/yandex-webmaster) and [goals in Metrica](/blog/yandex-metrika-goals).
