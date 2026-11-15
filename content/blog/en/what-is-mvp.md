---
title: MVP in development: what it is and how to launch a first version
description: What an MVP is in software development: how it differs from a prototype, what to put in it, what a first version costs and how to tell whether the idea works.
category: apps
date: 2026-11-15
service: web-apps
query: mvp in software development
related: telegram-bot-for-business, what-is-a-landing-page, yandex-metrika-goals
---

An MVP (minimum viable product) is the first working version of a service: it solves one main task for the user and lets you test the idea on real people at the lowest cost. In development, the MVP sits between the idea and the full product: first you find out whether people need the service, and only then invest in everything else.

The term was popularised by Eric Ries in The Lean Startup (2011). By his definition, an MVP is the version of a product that gives the team the most validated knowledge about customers for the least effort. Below we cover how an MVP differs from a prototype, what kinds of first versions there are, how to go through the stages and what it costs. At the end there is an example from our own work: how the first version of a free tool changed our plan. If you already have an idea and need an estimate, see our [web application development](/services/web-apps) page.

## Why a business needs an MVP

The most expensive risk of a new service is spending half a year and the whole budget on a product nobody uses. An MVP tests the main assumption before you pay for everything else:

- whether people have the problem the service solves;
- whether they are ready to change their habit: a spreadsheet, a messenger, a call to a manager;
- which feature matters most to them and which can wait;
- whether they will pay, and how much.

Each of these answers changes the development plan. If people happily use one feature and ignore the rest, build the second version around it. If nobody opened the first version a second time, it is better to learn that in a few weeks than in a year.

> A minimum product is small in scope but solid in quality. If sign-up breaks on a phone, you are testing your users' patience, and the value of the idea stays unknown.

## MVP, prototype and pilot: the difference

These words are often mixed up, although they answer different questions.

- **A prototype** shows what the service will look like and how to move around it. It is usually a set of clickable mock-ups with no real data. It tests whether the interface is clear, and it is shown to a few people in person or on a video call.
- **An MVP** works for real: it accepts data, stores it, sends notifications. Real customers use it for their own tasks, and their behaviour tells you what to do next.
- **A pilot** is an almost finished product launched for some of the customers or in one branch. It tests how the service behaves in daily work and under load, once nobody doubts the value of the idea.

A prototype usually comes before the MVP: it is easier and cheaper to rework before any code is written. Screen mock-ups are part of our [web design service](/services/design).

## Kinds of MVP

The first version does not have to be an application. Pick the cheapest format that still answers your question.

### A landing page with a sign-up form

One page describes the future service and invites people to leave a request or join a waiting list. If out of a hundred interested visitors nobody signs up, you get the signal before development starts. What such a page needs is covered in [what is a landing page](/blog/what-is-a-landing-page).

### A manual service

You serve the first customers yourself: take orders in a messenger, calculate in a spreadsheet, send the result by hand. This way you learn the process from the inside and later automate what really repeats.

### Automation on the surface

To the user everything looks like a finished service: a form, a personal page, notifications. Behind the interface, people do part of the work. This fits when complex automation is expensive and demand is not yet confirmed.

### A single feature

The service does one thing and does it well: for example, calculates delivery cost or reminds a customer about an appointment. You add the rest once you see that this feature is used.

### A bot or a Mini App in Telegram

The customer installs nothing, and the audience is already in the messenger. Signing in with a Telegram account removes the separate registration. How bots work is described in [how to create a Telegram bot for business](/blog/telegram-bot-for-business), and a service with a full interface inside the messenger is built as a [Telegram Mini App](/services/telegram-mini-apps).

## How to launch an MVP: the stages

1. **State the hypothesis.** One sentence: who, what their problem is and what they will do in your service. For example: *owners of small websites will connect free monitoring if it works in Telegram and needs no sign-up*.
2. **Pick a metric and a threshold before launch.** For example: out of 100 people who open the page, 10 connect the service and half of them come back a week later. A threshold invented after launch can be bent to fit any result.
3. **List the features and cut the list.** Keep what the main scenario cannot work without. Move the rest to the second round: roles and access rights, complex settings, an admin panel (a spreadsheet will do at first), an app for the App Store and Google Play.
4. **Agree on the prototype.** Walk through the main scenario on mock-ups before writing code. A mistake in a mock-up is cheaper to fix than in a working service.
5. **Build and prepare the launch.** We release in stages and show intermediate results, so you see what you are paying for.
6. **Bring the first users.** Decide in advance where they will come from: your customers, a mailing list, ads, communities. A service nobody heard of tests nothing.
7. **Measure and decide.** Using the metric from step two, choose one of three: keep developing, change the approach, or drop the idea and keep the budget.

### What not to cut even in an MVP

You cut features, but build the foundation carefully. Otherwise the second version has to be written from scratch.

- **Security and data.** Passwords, access and customers' personal data are protected from day one. If you collect names and phone numbers, you need consent to processing and a privacy policy.
- **Analytics.** Without events and goals, the hypothesis cannot be measured. How to set up goals is shown in our article on [Yandex Metrica](/blog/yandex-metrika-goals).
- **Backups and rollback.** Early users must not lose data because of a failed update.
- **Code and access stay with you.** The repository, server and domain are registered to the product owner, and the contractor hands over all access after launch.

## What an MVP costs and how long it takes

The cost of an MVP depends on the number of scenarios, user roles and integrations. The budget grows most with:

- payments and subscriptions;
- several roles: customer, manager, administrator;
- integrations with a CRM, accounting system, payment services;
- mobile apps for the App Store and Google Play;
- a complex admin panel with its own reports.

We work by the hour, from $20 an hour, and after reviewing the task we give an estimate by stage. Say the review comes to 80 hours: at $20 an hour that is $1,600, and you accept each stage separately. The fastest way to test demand, a landing page with a sign-up form, starts at $500 and takes 1-2 weeks.

Ready-made solutions keep the budget down: sign-in through Telegram or email instead of your own account system, a payment service instead of your own payment logic, a spreadsheet instead of an admin panel. They can be replaced later, once it is clear the product is needed.

## Example: how a first version changed our plan

We wanted to build a free tool for website owners that finds problems on its own. Our first hypothesis was a monitoring bot in Telegram: a person sends a site address, and the bot checks the site every 10 minutes and writes if it stops opening or if the SSL certificate or the domain is about to expire. That is how [Site Pulse](/pulse) appeared.

To launch it quickly, we deliberately put a lot off:

- one site is connected for free, and paid plans and payments are not built yet;
- the bot keeps all its data in one file, without a separate database: for the first users that is enough;
- the bot runs on the same server as the studio website, with memory and CPU limits so it does not slow the site down.

Then we checked demand in Yandex Wordstat. The Russian query for "website monitoring" is barely searched, while "free website analysis", "check a website for errors" and "website availability check" get 900 to 1,600 searches a month each. People more often need a one-off check, and constant monitoring is searched for far less. We built a [free website check](/site-check) right on the page, and the bot became its continuation for those who want to watch their site all the time.

The check runs on the same engine as the bot, so the new part did not have to be written from scratch. The first version showed a few cards: availability, SSL, domain and search. Now it is a table of 35 checks with a PDF report. Had we started by building paid monitoring plans, we would have spent time on the feature people search for least.

## Common mistakes when launching an MVP

- **Everything at once.** The "it would also be nice to have" list grows faster than the budget. Test each feature with one question: can the hypothesis be checked without it?
- **No metric.** A month later any numbers look decent. Write the success threshold down before launch.
- **No users.** The budget went into development, and nothing is left to attract people. Set aside money and time for the first customers.
- **A first version that looks like a draft.** If the interface is rough and off-putting, people leave because of the inconvenience, and you wrongly decide the idea is not needed.
- **No conclusions.** You launched, looked, and carried on with the old plan. An MVP only makes sense if its results change a decision.

## What to prepare before talking to a developer

- Who your user is and what task of theirs the service solves, in one or two sentences.
- The main scenario step by step: what a person does from sign-in to result.
- The hypothesis and the metric that will show the idea works.
- Which systems need connecting: CRM, payments, spreadsheets, accounting.
- Where the first users will come from and how many you expect.
- The budget and the date you need the result by.

With this list, a developer can propose the shortest version that tests the idea. If you want to discuss yours, write to us through the [web application development](/services/web-apps) page: we will review the task and give an estimate by stage. For services inside the messenger, see [Telegram bot development](/services/telegram-bots).
