---
title: Responsive web design: how to make a site work well on phones
description: What responsive web design is, how a responsive site differs from a separate mobile version, how it affects search and what to check on a phone before launch.
category: sites
date: 2026-11-15
service: support
query: responsive web design
related: pagespeed-insights, website-structure, how-to-create-a-website
---

Responsive web design is a way of building a site so that the same page at the same address adapts to the width of the screen. On a computer the blocks sit in several columns, on a phone they line up in one, the menu folds into a button, and the text is readable without zooming. Today this is the main way to give a site a mobile version, and Google calls it the easiest pattern to implement and maintain.

Below we cover how a responsive site differs from a separate mobile version, how the layout works inside, what Yandex and Google expect from the mobile version, and the checklist we go through on our own projects. If an old site is awkward to open on a phone, it can be reworked: more on that at the end of the article and on the [website support and improvement](/services/support) page.

## Responsive site or a separate mobile version

[Yandex Webmaster help](https://yandex.com/support/webmaster/en/recommendations/mobile-site) describes three ways to serve a site on phones:

- **Responsive design.** One address and one HTML for all devices, the layout rearranges itself for the screen. There is one site, and every change is made once.
- **Dynamic serving.** The address is the same, but the server detects the device and sends phones a different HTML and CSS. You maintain two variants of every page and make sure the server recognises devices correctly.
- **A separate mobile version** on a subdomain like `m.example.com`. Its structure has to repeat the main site completely, and every desktop page needs a redirect to the matching mobile page plus a `rel="alternate"` attribute. In practice it is a second site that has to be filled and fixed.

We build new sites only as responsive ones. A separate mobile version is found on older projects, where reworking the main layout was hard and a phone version was needed urgently.

One more distinction from older articles: fluid versus adaptive layout. A fluid layout stretches blocks in percentages of the window width, an adaptive one switches layouts at set screen widths. Modern sites combine both: sizes scale smoothly, and the layout changes at breakpoints.

## How responsive layout works

### The viewport meta tag

Without it, a mobile browser draws the page in a virtual window about 980 pixels wide and shrinks it to fit the screen, as the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport) explains. The text comes out tiny, and the styles for narrow screens never apply. The fix is one line in `<head>`, the same one Yandex recommends:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Media queries and breakpoints

A media query turns on part of the styles only at the right window width. It is easiest to write from phone to computer: base styles for a narrow screen, and columns added for wider ones.

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  .cards { grid-template-columns: repeat(4, 1fr); }
}
```

On a phone the cards go in one column, on a tablet in two, on a computer in four. Breakpoints are chosen by the content: the layout changes where it starts to break. Fitting the layout to particular phone models is pointless, there are hundreds of them.

### Flexible sizes

Images get `max-width: 100%` so they never stick out past the edge. Heading sizes are handy to set with `clamp()`: for example, `font-size: clamp(2rem, 7vw, 4.5rem)` shrinks the type smoothly with the screen, but never below or above the set limits. That is how the first-screen heading on our site works: on narrow phones it gets smaller, and long words stay inside the edge.

A separate trap is the screen height. On a phone the address bar hides and reappears, and a block that is `100vh` tall can slide under the browser panel. CSS has the `dvh` and `svh` units for this, which account for the visible part of the screen.

### Images sized for the screen

The `srcset` and `sizes` attributes let a phone browser load a smaller copy of an image instead of the large one. Mobile connections are slower, and heavy images are a frequent cause of a low speed score. How to measure it is covered in our article on [PageSpeed Insights](/blog/pagespeed-insights).

## How the mobile version affects search

**Google** indexes and ranks sites by the mobile version of their pages, crawled by the smartphone crawler. This is stated directly in [Google's guide](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing). From July 5, 2024, Google [moved to the smartphone crawler](https://developers.google.com/search/blog/2024/06/mobile-indexing-vlast-final-final.doc) the last sites it was still crawling as a desktop. If part of the text is removed from the mobile version, for Google it does not exist. Text inside expandable blocks and tabs is visible to it, as long as it is in the page code.

**Yandex**, in the same help article, lists its recommendations for mobile pages: a 200 server response, CSS and JavaScript open to the robot in robots.txt, the viewport meta tag, and no horizontal scrolling on screens from 320 pixels. Pages can be checked in Webmaster under "Tools" → "Audit pages for mobile compatibility". How to connect a site to Webmaster is in a [separate article](/blog/yandex-webmaster), and robots.txt setup is in the article on [sitemap and robots.txt](/blog/sitemap-robots-txt).

Even leaving search engines aside, an awkward page loses leads. A person on a phone will not zoom into small text and aim at a tiny link; they will go back to the results and open the next site.

## What to check on a phone: a checklist

1. **No horizontal scrolling** at widths from 320 pixels. It usually comes from a wide image, a table or a long word in a heading.
2. **Text is readable without zooming.** Body text is usually 16 pixels or more, and lines do not stick to the screen edges.
3. **Buttons are easy to tap with a finger.** The WCAG 2.2 accessibility standard requires [at least 24 by 24 pixels](https://www.w3.org/TR/WCAG22/#target-size-minimum), and for comfort people aim for 44-48 pixels with space between neighbouring links.
4. **The menu opens, closes and scrolls.** A long list of services should not run off the bottom of the screen without scrolling.
5. **Forms are easy to fill in.** The phone field has `type="tel"`, which opens the number keypad; email has `type="email"`; fields do not shrink or hide under the keyboard.
6. **Phone and messenger links work.** The number is a `tel:` link, Telegram and WhatsApp have their own links, and they open the app.
7. **Tables do not break the page.** A wide table scrolls sideways inside its block or is replaced with a list.
8. **Landscape orientation.** Turn the phone: the header and pop-ups should not take up the whole screen.
9. **Pop-ups and the cookie banner** do not cover the content and are easy to close.
10. **Speed on a mobile connection.** The phone score is checked separately, and it is almost always lower than the desktop one.

## How to test a site without a dozen phones

- **Device mode in the browser.** In Chrome and Firefox it opens with Ctrl+Shift+M (Cmd+Shift+M on a Mac) from the developer tools. Go through widths of 320, 390, 768, 1024 and 1440 pixels and rotate the screen.
- **Two real phones:** an iPhone with Safari and an Android with Chrome. An emulator will not show how the address bar, keyboard and fonts behave on a real device.
- **A link from a messenger.** Open the site from a link in Telegram or WhatsApp: many customers reach a site exactly that way, in the app's built-in browser.
- **Services.** "Audit pages for mobile compatibility" in Yandex Webmaster, the "Mobile" tab in PageSpeed Insights, and our [free website check](/site-check): among its 35 checks there is the phone setup as well.

## What we fixed on our own site

We regularly check the studio site on a phone, landscape included. A few real cases:

- **A squashed form field.** On the website check page, the address field sits in a row with the button on a computer and stretches in width. On a phone the block becomes a column, and the same rule started controlling the height: the field collapsed. The fix: stretching now applies only where the field sits in a row, and the height is set explicitly.
- **The article contents column.** On a wide screen, the contents and the "Need help" card travel on the right next to the text. We pin them only on screens at least 1024 pixels wide and 720 tall. On a phone everything goes in one column: the contents above the text, the card at the end.
- **Tables in the blog.** On a phone they scroll sideways, so we write important comparisons as lists, as in this article.
- **The services block on the home page.** On a computer it is a panel and a grid of cards, on a tablet the grid sits above the panel, on a phone it is a row of buttons that scrolls sideways.
- **"A white strip above the header".** It was spotted on a phone and taken for a layout bug. It turned out to be the frame of the built-in browser of the app the link was opened from: in regular Chrome it is not there.
- **Widths before release.** Before launching the English version, we went through 35 pages at widths of 390, 768 and 1440 pixels and made sure none of them scrolled horizontally.

> Responsiveness is checked on every new block. A site that was comfortable on a phone at launch breaks from a single wide table or image added a year later.

## What responsive layout costs

For a new site there is nothing extra to pay: the phone version is included in the price of our [landing pages](/services/landing) (from $500) and [business card websites](/services/vizitka) (from $200). Mock-ups for computer and phone are also part of [web design](/services/design) if you order it separately.

For an existing site, the price depends on how it was built. If the theme or template already supports phones, fixing individual blocks is usually enough: tables, forms, the menu. If the site was laid out for a fixed screen width, rebuilding the layout or doing a redesign is often cheaper than fixing every page. Prices and timelines for a new site are collected in the article [how to create a website for a business](/blog/how-to-create-a-website).

If your site is awkward to open on a phone, send us the address through the [website support and improvement](/services/support) page. We will look at the layout, name what to fix first and estimate the work.
