# Supabase setup (one-time)

Two quick steps connect the app to your Supabase project.

## 1. Create the database tables

1. In your Supabase project, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy all of it, paste it in, and click **Run**.
3. You should see "Success." This creates the `profiles`, `friendships`, and
   `entries` tables and the security rules that enforce private vs friends-only
   entries. It's safe to re-run if needed.

## 2. Add the connection values to Netlify

So the live build can reach Supabase, add two environment variables:

1. Netlify → your project → **Project configuration → Environment variables → Add a variable**.
2. Add these two (values are public/safe):
   - `VITE_SUPABASE_URL` = `https://deesothawraeonekpvsn.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_…` (your publishable key)
3. Trigger a redeploy (Deploys → Trigger deploy) so the new build picks them up.

That's it — accounts, friends, and sharing will work once the code that uses
them is merged in. Local development reads the same two values from a `.env`
file (already set up, and git-ignored so it never gets committed).

## Note on keys
The publishable/anon key is meant to live in the browser and is protected by the
row-level security rules in `supabase/schema.sql`. Never add the **secret /
service_role** key to this project or to Netlify's build env — it bypasses all
security rules.
