# Deploying the portfolio

This is a static site (Vite + React). There is no server and no database, so any static host works:
Netlify, Vercel, Cloudflare Pages, GitHub Pages and so on.

## 1. Build settings

| Setting       | Value           |
| ------------- | --------------- |
| Build command | `npm run build` |
| Output folder | `dist`          |
| Node version  | 20 or newer     |

It is a single page, so no redirect or rewrite rules are needed.

## 2. Make the contact form send real messages

Right now **the form does not send anything by itself**. With no form service configured, the
button reads "Open in email app" and opens the visitor's mail client with the message prefilled.
It never claims a message was sent.

To receive messages directly:

1. Create a free form on a form-handling service such as [Formspree](https://formspree.io) and set
   it to deliver to `vijaypn.in@gmail.com`.
2. Copy the form's endpoint URL (for Formspree it looks like `https://formspree.io/f/xxxxxxxx`).
3. In your host's settings, add an environment variable named `VITE_CONTACT_ENDPOINT` with that URL,
   then rebuild.

The button then reads "Send message", and the page only reports success when the service confirms
it. The endpoint is a public address, not a secret, and no API keys belong in this repository.
Production only accepts `https://` endpoints.

## 3. Social-sharing links

Link previews (the card shown when the site is shared) need absolute URLs, and the domain is not
known yet. Once you have it, add an environment variable named `VITE_SITE_URL` with the full
`https://` address (for example `https://example.com`) and rebuild. This adds the canonical link
and the absolute preview-image URLs. Until then those tags are left out rather than guessed.

Copy `.env.example` to `.env` to try either value locally. `.env` is git-ignored.

## 4. Before going live

- Move `public/images/white red image.png` (the original 1.3 MB portrait) out of `public/`. The site
  uses the optimised `profile.webp` and the original is shipped to visitors for nothing.
- Open the LinkedIn link in a browser (some sites refuse automated checks).
- Check the Namma-Yojane card still says "In progress", or remove that label when it is finished.
- Optionally add project screenshots at `public/images/projects/<id>.png` (16:10). Until they exist,
  each card shows an illustration. The ids are `web-rag-evaluator`, `namma-yojane`, `visionguard-ai`
  and `flood-water-quality`.

## 5. After the first deploy

- Send yourself a test message through the form (only meaningful once step 2 is done).
- Paste the live address into a link-preview checker (LinkedIn Post Inspector, or the Facebook
  Sharing Debugger) to confirm the card and image.
- Test on a real phone and a real laptop GPU: the 3D sculpture, the neural background and the custom
  cursor were verified in a headless browser, not on physical hardware.
- Run Lighthouse in Chrome DevTools against the live address.
