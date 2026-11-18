---
title: Landing page for targeted ads and Yandex Direct: structure and checks
description: What a landing page for targeted ads and Yandex Direct needs: how the two differ, page structure, Yandex site rules, UTM tags, goals and checks before launch.
category: ads
date: 2026-11-18
service: landing
query: landing page for targeted ads
related: what-is-a-landing-page, yandex-metrika-goals, pagespeed-insights
---

A landing page for targeted ads and Yandex Direct is the page a person reaches after clicking an ad. The ad starts the conversation, and the page has to carry it on to a request. It decides what each lead costs: with the same budget and the same bids, a page that answers the visitor's question faster brings more requests.

We covered landing pages in general in [what is a landing page](/blog/what-is-a-landing-page). Here the subject is a page made for ads: how a landing page for Direct differs from one for targeted ads, which blocks it consists of, what Yandex moderation checks and what to set up before launch. If you need a page for a ready campaign, see our [landing page development](/services/landing).

## Why the page matters as much as the ads

The cost of a lead comes from two numbers: the price of a click and the share of visitors who send a request. A made-up example: a click costs $1, so a hundred clicks cost $100. If two visitors out of a hundred send a request, each lead costs $50. If the page brings four out of a hundred to a request, the same ads give a lead for $25. Bids and audiences did not change.

There is a second reason. Direct's automatic strategies can look for people who are more likely to send a request, but they need [Yandex Metrica](https://metrica.yandex.com/) goals from the page for that. In the "Maximum conversions" strategy you can choose Metrica goals and pay only for conversions that happen within 21 days of the click, according to the [Direct help](https://yandex.com/support/direct/en/strategies/average-cpa-conversions). Without goals the strategy has nothing to learn from.

## Landing page for Direct versus landing page for targeted ads

The main difference is how ready the person is to talk.

- **Direct in search.** The person typed the query themselves, for example "boiler repair at home". They are already looking for a contractor, and the page has to confirm at once that they came to the right place: the same service, the price or what it depends on, timing, a contact button. What matters more to them are reasons to pick you: price, timing, reviews.
- **Targeted ads on VK.** The person was not searching for anything; the ad appeared in their feed because they match the customer profile. They need more explanation: what problem you solve, why it matters now, who you are. Make the first action an easy one: getting an estimate, a consultation or a selection.
- **Yandex Advertising Network.** Ads on sites and in apps are also seen by people who were reading something else at that moment. In readiness they are closer to targeted ads, and the page for them is built the same way.

So the same landing page rarely works equally well for search and for a feed. You can make two first screens, a short one for search and a detailed one for targeted ads, and keep the other blocks shared.

## Lead form or landing page

VK Ads can collect requests without a website: a lead form is built into the ad, and its fields are filled in from the user's profile. That is faster and cheaper at the start. But the person learns almost nothing about you before leaving their contacts, and a prefilled form is easy to send without reading closely. Your sales team then has to explain from scratch who you are and what you offer.

A landing page is needed when the service is expensive or complex, when it matters to show work and prices before the call, and when you send Direct traffic to the same page. A lead form suits a simple offer and a quick demand test. If in doubt, run both on a small budget and compare how many requests from each turned into deals.

## Landing page structure for ads

1. **The first screen repeats the ad's promise.** The same words, the same service, the same price or promotion. This is also a moderation rule: under the [Direct rules](https://yandex.com/support/direct/en/moderation/ad-rules), information about a discount, promotion or specific product mentioned in the ad must be clearly present on the page.
2. **A contact button and contacts right away.** Phone and messengers are visible without scrolling. Some people are ready to call at once and will not read further.
3. **Offer details.** What is included, on what terms, how long it takes.
4. **How the work goes.** Three to five steps from request to result: specifics remove the fear of the unknown.
5. **Proof.** Work, reviews, documents, client logos. Only what can be checked.
6. **Price or estimate.** If you cannot name an exact amount, a calculator or a "from" price with an explanation of what it depends on.
7. **Answers to questions.** Every objection you hear on the phone gets answered here.
8. **A form and company details.** A short form and the organisation's details. Direct advises listing the legal name, address, phone, registration number (OGRN or OGRNIP) and taxpayer number (INN) on the site, and for some topics, such as legal services and loans, it is mandatory.

This is how our landing page for a bank guarantee service, [garant-bg.ru](https://garant-bg.ru/), is built: the offer and a "Calculate the cost" button on the first screen, then a calculator, types of guarantees, four steps to a guarantee, issued guarantees, partner banks, about the company, questions and a form. Each block answers a question a person would ask a manager.

## One page or several

If a campaign has several different offers, each should lead to its own first screen. Someone who searched for "boiler maintenance" should see maintenance, and someone who searched for "boiler repair" should see repair. There are two ways to do it:

- **Several versions of the page** with different first screens and a shared lower part. Simple and reliable.
- **Swapping the headline by a tag in the link.** There is one page, and the headline changes depending on the ad group. Handy when there are many groups, but the swap has to be checked for every tag.

## What to set up before launch

**UTM tags.** Without them Metrica does not show which campaign and which query brought a request. The [Direct help](https://yandex.com/support/direct/en/statistics/url-tags) names three tags as required: `utm_source`, `utm_medium` and `utm_campaign`. You can also add `utm_term` with the keyword. Direct fills in the dynamic parameters in curly brackets itself:

```
https://example.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_term={keyword}
```

Here `{campaign_id}` becomes the campaign number, and `{keyword}` the keyword the ad was shown for. Write values in Latin letters and lowercase, as the help advises: Cyrillic in tags can arrive garbled. For targeted ads use your own values, for example `utm_source=vk`.

**Goals in Metrica.** At a minimum, form submission and clicks on the phone and messengers: some people write in a messenger and skip the form. On our own site we track eight goals, and clicks carry a parameter showing exactly where the person tapped. How to set this up is described in our article on [Yandex Metrica goals](/blog/yandex-metrika-goals). For targeted ads on VK you also need the VK Ads pixel with the same events.

**Where requests go.** A request should land where someone will see it within minutes: Telegram, email or a CRM. Our forms send requests to Telegram: the notification arrives at once, and you can reply from your phone.

## Checks before launch

- The page opens without errors on phones and computers. Under the Direct rules it must display correctly in all browsers and cannot be a stub like "Website under development".
- The page has no pop-ups. Moderation allows only contact forms, for example an online consultation window.
- The page loads fast on a phone. How to read a PageSpeed report, and what we changed on a client's site when we raised its mobile score from 71 to 96, is covered in our article on [PageSpeed Insights](/blog/pagespeed-insights).
- A test request reaches you, and the goal in Metrica was counted.
- The links in the ads carry tags, and the values show up in reports.
- The form has consent to personal data processing and a link to the privacy policy.

## After launch

Judge the page by weeks rather than by the first day: with a small budget one day gives too little data. Look at the step where people drop off: if they start filling in the form but do not send it, the problem is the form itself. If they hardly reach the form, look higher up: at the first screen or the price. Change one element at a time, otherwise you will not know what worked.

## What it costs

A [landing page](/services/landing) with us costs from $500 and takes 1-2 weeks. The price includes the structure, design for phones and computers, a form that sends requests to Telegram, email or a CRM, and Metrica with goals. We name the price after a brief and fix it in the contract.

We also set up the ads: [Yandex Direct](/services/yandex-direct) management from $200, and we estimate [VK targeted ads](/services/vk-ads) after a brief. The platforms charge the ad budget separately. Other guidelines are on the [prices](/prices) page. If you do not have a site yet and are not planning ads, you can start with a simple [business card website](/blog/business-card-website).
