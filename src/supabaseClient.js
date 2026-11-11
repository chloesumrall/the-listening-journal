import { createClient } from '@supabase/supabase-js';

// Read from Vite env vars (set locally in .env and in Netlify's dashboard).
// The publishable/anon key is public by design and safe in the browser —
// data access is governed by the row-level security rules in supabase/schema.sql.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing, `supabase` is null and the app runs in local-only
// mode (entries stay in the browser, no accounts). This keeps dev builds working.
export const supabase = url && key ? createClient(url, key) : null;
export const hasBackend = !!supabase;
