# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

One unified site at `outli.live`, hosted on Vercel (team `nikolai4`, project `outli-live`) since 2026-11-09; DNS is at Namecheap (`legal` CNAME still points to GitHub Pages for the old legal site). The marketing homepage is the entry point; legal and support pages are integrated sub-pages.

## Tech Stack

- Vanilla HTML5 + CSS + minimal JS only
- No UI frameworks, no Tailwind, no build step, no package manager
- Mobile-first responsive design
- No analytics/tracking scripts
- Prefer CSS for behavior (`scroll-behavior: smooth`) over JS where possible
- Deploy: push to `main` on the `outlilive` remote, then `vercel deploy --prod --scope nikolai4` (until the Vercel GitHub app is installed for this repo, pushes don't deploy by themselves). `/a/` is rendered by `api/a.js` so link previews show each activity's card (`api/card.js`); both read the `activityPreview` function in the GroupItV2 repo. `vercel.json` must keep serving `.well-known/apple-app-site-association` as JSON or universal links break.

## File Structure

- `index.html` — Marketing homepage (entry point)
- `privacy.html` — Privacy Policy (GDPR-compliant, renamed from `index.html`)
- `termsofuse.html` — Terms of Use
- `support.html` — Support page with FAQ
- `styles.css` — Shared stylesheet (common styles extracted from inline `<style>` blocks)
- `outli_homepage_build_brief.md` — Spec for the marketing homepage
- `a/index.html` — Shared activity page (`outli.live/a/?id=<activityId>`), the link the app's Share button sends. Reads the public activity from Firestore's REST API without signing in (the same fields a guest sees in the app: want, when/area or plan, first name and photo, how many are in) and links to the App Store; an ended or private activity shows "This one has ended". Static Open Graph tags with `Assets/og-share.png`.
- `.well-known/apple-app-site-association` — Universal links: `/a/*` opens in the Outli app (team `YLP246S525`, bundle `com.nikolaialtergott.GroupItV2`). Served because of `.nojekyll`; keep both.

## Architecture & Conventions

- Shared styles live in `styles.css`, linked from all pages
- Page-specific styles can live in `<style>` tags within each file
- Legal page navbar includes a "Home" link to `index.html`
- Homepage footer links to `privacy.html` (not `index.html`)
- When updating legal content, keep the `Last updated:` date at the top of the file in sync
- All pages share the same iOS-inspired aesthetic (`-apple-system` font stack, `#007aff` link color)
- Note: CNAME must be updated from `legal.outli.live` → `outli.live` when going live

## App Context

**Outli** is a location-based iOS social app for students. Key data points relevant to the legal pages:
- Auth: Sign in with Apple only
- Backend: Google Firebase (auth, database, analytics) + Google Places
- Data collected: Name, Email, Date of Birth, Gender, Profile Picture, location (at sign-in only)
- Public visibility: Name, Age, Gender, Profile Picture shown to other activity participants
- Core entity: **Activities** (users create activities; others request to join)
- Minimum age: 13 (Germany digital consent age: 16)
- Data Controller: Nikolai Altergott, Lange Äcker 1, 71543 Wüstenrot, Deutschland
- Contact: support@outli.live

## Marketing Homepage Spec

See `outli_homepage_build_brief.md` for full details. Key constraints:
- Single HTML file, no frameworks, no build step
- Mobile-first (majority of visitors on iPhone/Android)
- No analytics/tracking scripts
- Must be live before April 1, 2026 (TU Berlin orientation deadline)
- Sections: Hero, How It Works, The Feeling, For Partners/Orgs, Footer
- Partner contact: hello@outli.live

## Brand assets

- `Assets/app-icon.png` — the G3 flower app icon (white petals on amber, 512 px), used for favicons and the nav/hero logo. Source: Logo / Mark in the Outli-Assets Figma file; the app's own icon is `GroupItV2/AppIcon4.icon`.
- `Assets/AppMockups/*.png` — phone mockups for "How it works", rendered from the app's screenshot-mode captures (`marketing/app-store/raw/` in the app repo).
- `Assets/samples/*.jpg` — AI-generated sample portraits used by the app's screenshot mode. Not linked from any page.
