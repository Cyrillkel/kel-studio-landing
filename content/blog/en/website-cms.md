---
title: How to identify a website's CMS and choose one for your business
description: Identify a website's CMS from its source and choose a system for your business. WordPress, headless, sites without a CMS, upkeep and our KEL Studio example.
category: sites
date: 2026-11-01
service: wordpress
query: identify website cms
related: website-structure, website-builder-or-custom, how-to-create-a-website
---

You can identify a website's CMS by looking at its page source, the addresses of loaded files and technical information from the developer. This is useful before modifying an existing project or handing it to a new contractor. When choosing a system for a new website, you also need to know who will edit the content and what work will follow the launch.

A CMS, or content management system, lets people edit text, images and pages through an administration panel. This article covers ways to detect a website's CMS, the limits of those checks and how to choose a system for your business. If you already know your editor needs a familiar admin panel, see our [WordPress development service](/services/wordpress).

## What a CMS changes in daily work

Suppose a company publishes news and changes service prices every week. An employee opens the panel, finds the page, edits the text and saves it. They do not have to find a line in a file and ask a developer to publish the change.

What the panel allows depends on the implementation. Some projects only let editors change prepared fields: a heading, a price, a photo. Others let them build pages from blocks. Full freedom is useful until someone accidentally breaks the spacing or the mobile layout. Shared templates and clear limits usually help with recurring page types.

Before choosing a system, list the actual tasks: add a service, update the price list, publish an article, upload documents. These are the actions to test in a demonstration.

## How to identify a website's CMS yourself

Start with a public page. A browser is enough for an initial check; you do not need server access.

### Look at the page source

On a computer, open the page's context menu and choose the option to view its source. In most browsers, `Ctrl+U` also works. Then search the page for `generator`, `wp-content` and `wp-includes`.

The `generator` tag sometimes names the system directly. For example, WordPress has a built-in function that [adds information about the page generator](https://developer.wordpress.org/reference/functions/wp_generator/). This information can be removed, so a missing tag proves nothing.

File addresses containing `/wp-content/` or `/wp-includes/` often point to WordPress. This is an indirect clue: files might remain after a migration or load from another site. Look at several matching signs together.

### Check resource addresses

Open the Network tab in your browser's developer tools and reload the page. Look at where images, styles and scripts come from. Directory and file names sometimes help identify the CMS even when the generator tag has been removed.

It is easy to confuse different parts of the project here. For example, files under `/_next/` indicate that Next.js is used for the interface. On their own, they do not show where the editor manages content: a separate CMS might sit behind that interface.

### Ask the project owner for details

If you are checking your own website, ask the previous contractor for the system's name and version, a list of extensions, panel access and licence details. You also need hosting information and the procedure for restoring a backup.

During a handover, this is more reliable than guesses based on a public page. To estimate changes, the developer will still need to understand the forms, templates and integrations.

## Why online detectors can be wrong

Technology detection services match visible signs against known systems. Their results can be useful clues, but the final conclusion should follow a review of the project.

There are practical reasons for uncertainty:

- standard directory addresses have changed and the generator tag has been removed;
- scripts and images are served through a separate domain or cache;
- the public website is built separately from its administration panel;
- the site is built from files and does not use a CMS at all.

The message "CMS not detected" means the service did not find enough clues. It tells you nothing conclusive about the site's quality or security.

## Which CMS to choose for a new website

First, describe how the team will work. Who publishes content, how many people approve it, do they need drafts and which sections will grow? Then compare the options.

| Task | What to consider | What to see in a demonstration |
|---|---|---|
| Company services and regular articles | An established CMS such as WordPress | Creating a page, working with images and publishing |
| A catalogue with orders | A CMS with an ecommerce module or a dedicated platform | Product imports, variants, stock and checkout |
| A complex interface and several publishing channels | A separate interface and a headless CMS | Previewing, publishing and updating data |
| A small site with occasional changes made by a developer | A site without a separate CMS | How changes, publishing and handover work |

For an [online store](/services/ecommerce), check compatibility with the payment, delivery and inventory systems you need. The existence of an extension in a directory does not confirm that it will handle your particular workflow.

### WordPress for a company website and blog

WordPress includes pages, posts, drafts and user roles. Themes handle the appearance, while plugins add functionality. The core features are described on the [official WordPress features page](https://wordpress.org/about/features/). It is an option for a company that needs to manage its own services and blog.

During a demonstration, ask someone to add your typical page. For example, a new service with a price, photographs and an enquiry form. This shows which fields the editor can access and where a developer becomes necessary.

The number of installed plugins says little about quality on its own. The purpose of each plugin, compatibility and having someone responsible for updates matter more.

### A headless CMS for a separate interface

With a headless approach, content lives in a management system while visitors see a separately developed interface. The two exchange data through an API. WordPress can work this way too: its [REST API can deliver content to separate applications](https://developer.wordpress.org/rest-api/).

This approach is worth discussing if the same content is needed by a website and an app, or the interface needs specific logic. That flexibility brings extra work: connecting publication, previews and page updates. For a straightforward service website, first check whether this complexity is needed.

### A site without a separate CMS

If changes are occasional and a developer makes them, content can live in files. This approach needs a clear publishing process and a way to hand over the source files.

The trade-off changes when a manager needs to make frequent edits. Even changing a price starts to depend on the developer's availability. Account for that time when choosing the architecture.

For a broader comparison of development approaches, see ["Website builder or custom development"](/blog/website-builder-or-custom). A CMS addresses editing, while choosing how to build a website also involves design, functionality and ongoing support.

## How content management works at KEL Studio

Our website runs on Next.js. Articles live in individual Markdown files, while interface and service text live in language dictionaries. Each article has a Russian and an English version. After the files change, the site is rebuilt with updated pages.

We do not use a separate editor panel for this blog. Files and Git suit us because a developer maintains the website. For a team where an editor publishes articles daily, we would consider a panel with previews and publishing controls.

This also illustrates the limits of an external check. You can spot Next.js on the public page, but the way articles are stored becomes clear from the project itself. When commissioning [React and Next.js development](/services/react-nextjs), agree on the content editing process separately.

## The cost of owning a website with a CMS

Compare the entire first year's costs. Include development, content entry, hosting, paid extensions and ongoing support. A free system still involves people's time and infrastructure costs. With a paid solution, also check the licence term and renewal conditions.

A WordPress backup needs to include both the files and the database. This is covered in the [backup handbook](https://developer.wordpress.org/advanced-administration/security/backup/). Test recovery too: where the copy is stored, who will restore it and which state the website will return to.

Before starting, agree on who updates the system, checks forms after updates and responds to failures. Those tasks can be included in [website support](/services/support).

## What to check before making the final choice

Ask the contractor for a short demonstration using material similar to yours:

1. Create a new service or product, fill in its fields and upload an image.
2. Show how the page looks on a phone and how to fix a mistake before publishing.
3. Explain which changes employees can make and which are charged as development work.
4. List the access rights, source files, licences and backups the owner receives.
5. Describe a handover to another contractor and recurring costs after launch.

Before choosing the system, prepare your [website structure](/blog/website-structure): the pages and the links between them. Then the demonstration can test work on specific future sections.

If you are planning a website your team can edit, send us your list of pages and tasks for [WordPress development](/services/wordpress). If you have not chosen the format yet, start with our [overview of ways to create a business website](/blog/how-to-create-a-website).
