# Launching The Listening Journal

**Current state:** v2 (four artists + accounts + friends/sharing) is merged to `main`
and auto-deploys to https://thelisteningjournal.netlify.app on every push.

Two steps remain to finish the public launch. Both are in your own accounts.

## 1. Point your GoDaddy domain at the site (Netlify first, then GoDaddy)

1. Netlify → your project → **Domain management → Add a domain** → enter your domain.
2. Use the exact DNS values Netlify shows you (not any from memory). Easiest path:
   - **Netlify DNS:** Netlify gives you 4 nameservers. In GoDaddy → your domain →
     **Nameservers → "I'll use my own nameservers"** → paste Netlify's four.
3. HTTPS/SSL turns on automatically once DNS resolves (minutes to a few hours).

## 2. Secure real sign-ups (Supabase auth)

Email confirmation was turned off for testing. Before sharing the site publicly, turn it
back on and tell Supabase which URLs are allowed:

1. Supabase → **Authentication → URL Configuration**:
   - **Site URL:** your live URL — your custom domain once it resolves; until then,
     `https://thelisteningjournal.netlify.app`.
   - **Redirect URLs:** add `https://YOURDOMAIN`, `https://www.YOURDOMAIN`, and
     `https://thelisteningjournal.netlify.app`.
2. Supabase → **Authentication → Providers → Email** → turn **on** "Confirm email."

After this, new users get a confirmation email whose link returns them to the site,
logged in. The app already handles that redirect automatically (no code change needed).

## Rollback

If anything looks wrong on the live site, restore the previous version from
Netlify → **Deploys** → pick an earlier deploy → **Publish deploy** — or revert the
merge commit on `main` and push.

## Quick smoke test after launch

- Sign up (two accounts in two browsers), pick usernames.
- Add each other as friends; accept.
- On one account, mark a song "Shared with friends"; confirm it appears in the other's
  Friends feed, and that a "Private" entry does **not**.
- Reflect on a song, refresh — it persists (cloud sync).
