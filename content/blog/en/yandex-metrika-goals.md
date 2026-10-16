---
title: Yandex Metrica: how to install the counter and set up goals
description: How to install Yandex Metrica and which goals to set up for a services site: request, phone, Telegram and email clicks. Our eight goals and common mistakes.
category: seo
date: 2026-10-16
service: seo
query: yandex metrica for a website
related: yandex-webmaster, pagespeed-insights, how-to-create-a-website
---

Yandex Metrica is a free traffic counter: it shows how many people came to a site, from where and what they did there. Visits are not yet clients, though. To see requests and calls, you need to set up goals in Metrica. Below, in order: how to install the counter, which goals a services site needs, how the eight goals on our site are built and which mistakes spoil the statistics.

## Step 1. Install the counter

According to [Yandex's help](https://yandex.com/support/metrica/en/quick-start), the order is this:

1. Sign in with a Yandex ID and click "Add counter". Enter the site address and fill in the form.
2. Open "Settings", the "Counter" tab, and copy the code.
3. Paste the code on every page of the site, as close to its start as possible. The help notes that the completeness of the data depends on this.
4. Check that the counter appeared in the "My counters" list, visit the site and find your visit in the reports. According to the help, data collection starts right after installation.

If the site is made on a builder or a CMS, it usually has a field for the counter number or a ready-made code. Metrica changes the names of buttons from time to time, so go by the meaning.

The counter is the heaviest third-party script on our site, so we request it after the page has loaded, at a quiet moment. Everything that happened earlier it remembers and sends when it loads. The price for this is one thing: the visit of a person who left before the load finished is not seen by the counter. We decided that a fast site matters more. How speed shows in Google's reports is covered in the article on [PageSpeed Insights](/blog/pagespeed-insights).

## Step 2. Understand what a goal is

A goal is a visitor action that matters for the business: sent a request, called, wrote in a messenger. Metrica counts how many visits ended with a goal and from which sources they came. These numbers show which advertising and which pages bring inquiries and which bring only traffic.

The [help](https://yandex.com/support/metrica/en/general/goals) lists more than a dozen types of goals. For a services site the ready-made ones fit: "Form submission", "Click on a phone number", "Click on an email", "Switch to a messenger", "Button click". They are set up in the interface without code.

The universal type is "Target event" (older instructions call it "JavaScript event"). You invent an identifier, for example `form_sent`, and create a goal with this identifier. At the right moment the site sends a call in the [format from the help](https://yandex.com/support/metrica/en/objects/reachgoal): `ym(COUNTER_NUMBER, 'reachGoal', 'form_sent')`. The third argument can carry the visit parameters. We use this: that is how we see that a person clicked and in which place of the page.

## Which goals a services site needs

Six to eight goals are enough. We have eight:

| Identifier | When it fires | What it is for |
|---|---|---|
| `form_sent` | a request is sent | the main goal: how many requests and from where |
| `form_start` | a person started filling in the form | the difference from `form_sent` shows at which step people are lost |
| `cta_contact` | a click on any "contact" or "calculate" button | interest before the form |
| `telegram_click` | a switch to Telegram | some people write in a messenger and bypass the form |
| `whatsapp_click` | a switch to WhatsApp | the same |
| `phone_click` | a tap on the phone number | on a phone it starts a call |
| `email_click` | a click on the email address | opens the mail program |
| `lang_switch` | the site language is switched | shows whether a second language version is needed |

It is reasonable to count `form_sent` and clicks on the ways to contact as requests. Without clicks on Telegram, WhatsApp, phone and email, part of the inquiries would fall out of the statistics. The other goals show the path to a request.

Clicks have a `place` parameter: where the person clicked. It is the first screen, the menu, the footer, a section of the page or the address of a service page. After a few weeks it shows which button works and which can be removed. `form_sent` has a `service` parameter: which service the person chose.

## How it is done on our site

A short note for developers. There are many buttons on the site, and attaching a handler to each takes long and a new one is easy to forget. So one click handler is placed on the page. It looks at where a link leads and by its beginning decides which goal it is: `#contact` is a contact button, `https://t.me/` is Telegram, `https://wa.me/` is WhatsApp, `tel:` is the phone, `mailto:` is email. A new button with such a link gets into the statistics by itself. The request and the start of filling in the form are sent from the form itself.

Two more details. The counter counts only visits to the real domain, so local builds and test addresses do not spoil the numbers. And the site switches pages without a reload, and the counter itself sees only the first one: we send each following one manually with the [`hit`](https://yandex.com/support/metrica/en/objects/hit) method, which according to the help is needed for pages that change without a full reload.

## How to look at the results

A few days after launch, open the traffic source reports and add goals to them: the request and clicks on contacts. Metrica changes the names of reports, so go by the meaning. You need a table "source - visits - goals reached": it shows where the people who get in touch come from, not just those who visit. The `place` and `service` parameters can be examined in the visit parameter reports.

Three rules of reading:

- Look at weeks. With ten requests a month, one day shows nothing.
- Compare sources by the share of visits that ended with a request. The number of visits by itself says nothing: advertising may bring many people who do not get in touch.
- Open the report once a week and at the start of the month compare with the previous one.

## Common mistakes

1. **There are no goals.** The reports show visits and do not show requests, and there is nothing to judge advertising by.
2. **The identifier in the code and in the goal differs.** A difference of one letter or the case, and the goal is silent.
3. **Extra requests in the statistics.** The goal is tied to the "Thank you" page, and every visit to it counts, including from a bookmark or after a refresh. It is more reliable to send the event at the moment the form is successfully sent.
4. **Your own visits are not excluded.** Visits by the owner and tests by the developer distort the numbers. Exclude them with filters in the counter settings.
5. **The goal was not tested.** Send a test request and make sure the goal counted.
6. **A site without page reloads.** The counter sees only the first page, and the rest have to be sent manually, as described above.
7. **Too many goals.** When there are thirty, the reports are impossible to work out. Start with the request and the ways to contact.

## What next

When the goals have started collecting data, they can be used. Metrica goals can be connected to a campaign in [Yandex Direct](/services/yandex-direct), to judge advertising by requests, not by clicks. In site promotion they show which pages bring inquiries. Connecting Metrica and goals is part of our [SEO promotion](/services/seo): we set up the counter and goals so that you see the sources of requests. Before launching advertising it is worth checking that the site has got into search: how to do it is described in the article on [Yandex Webmaster](/blog/yandex-webmaster).
