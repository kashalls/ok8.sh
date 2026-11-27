---
title: Privacy Policy
description: What ok8.sh keeps when you visit, sign the guestbook or send a message, and what it doesn't.
updated: 2026-11-27
---

The short version: ok8.sh has no analytics, no ads and no tracking cookies. It only keeps what it needs to count visits, show guestbook entries and comments, and pass along messages you choose to send.

## Visiting the site

**The visitor count:** when a page loads, you're counted once per day. To tell visitors apart, the site hashes your IP address and browser user agent together with a random value that changes every day (UTC). Only the hash is stored, and the day's hashes and random value are deleted at the first visit of the next day, so nobody can be recognised afterwards or followed from one day to the next. The only thing kept long term is the total.

**Hosting:** the site runs on Cloudflare Workers. Cloudflare handles every request, including your IP address, to serve and protect the site, and the site keeps request and error logs on Cloudflare for troubleshooting. See [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/).

**Your browser:** display settings (reduced motion, text size and the readable font) are saved in your browser's local storage. They never leave your device.

## Things loaded from other sites

Some parts of the page come straight from other services, which see your IP address and browser like any web request:

- **Lanyard** (`api.lanyard.rest`), for my Discord status on the home page, and **Discord's CDN** for avatars, decorations and emoji.
- **GitHub**, for avatars next to guestbook entries and comments.
- **Cloudflare Turnstile**, which loads when you open the contact form.

Fonts are served from ok8.sh itself.

## Guestbook and comments

Signing the guestbook or commenting on a post needs a GitHub account.

- **When you sign in,** the site keeps your GitHub account's ID, username, display name, avatar and creation date in an encrypted cookie in your browser. It doesn't keep your GitHub access token. A second cookie remembers which page to send you back to, for up to ten minutes.
- **When you post,** your message is stored with your GitHub ID, username, display name and avatar, and shown publicly. Hearting a comment stores your GitHub ID with it.
- **You can delete your own entries and comments** at any time. A comment with replies has its text and your details removed, and everything else is deleted outright.

## The contact form

Messages are emailed to me through [Resend](https://resend.com/legal/privacy-policy) with your name, email address and message, and [Cloudflare Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/) checks that you're not a bot first. Nothing from the form is stored on the site; your message lives in my inbox, and I only use your email address to reply.

## Copyright

Writing, images and artwork on ok8.sh are © 2026 Kashall or their artists, all rights reserved. Please don't republish them or pass them off as your own without asking.

The site's code is open source under the [MIT license](https://github.com/kashalls/ok8.sh/blob/main/LICENSE). Feel free to read it, learn from it and reuse it with credit. The fonts and commissioned art aren't covered by that license and belong to their creators.

## Questions or removal

If you'd like something removed, or have a question about any of this, use the email button at the top of any page.
