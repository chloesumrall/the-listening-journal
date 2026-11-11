import { supabase, hasBackend } from './supabaseClient';

export { hasBackend };

// ---- field mapping between the app's camelCase and the DB's snake_case ----
export function toRow(songId, userId, e) {
  return {
    user_id: userId, song_id: songId,
    mood: e.mood || '', song_type: e.songType || '', where_when: e.where || '',
    fav_line: e.favLine || '', bridge_line: e.bridgeLine || '', relates: e.relates || '',
    colors: e.colors || [], overall: e.overall || 0, replay: e.replay || 0,
    bridge_power: e.bridgePower || 0, visibility: e.visibility || 'private',
    updated_at: new Date().toISOString(),
  };
}
export function fromRow(r) {
  return {
    mood: r.mood || '', songType: r.song_type || '', where: r.where_when || '',
    favLine: r.fav_line || '', bridgeLine: r.bridge_line || '', relates: r.relates || '',
    colors: r.colors || [], overall: r.overall || 0, replay: r.replay || 0,
    bridgePower: r.bridge_power || 0, visibility: r.visibility || 'private',
  };
}

// ---- auth ----
export async function getSessionUser() {
  if (!hasBackend) return null;
  try { const { data } = await supabase.auth.getSession(); return data.session ? data.session.user : null; }
  catch (e) { return null; }
}
export function onAuth(cb) {
  if (!hasBackend) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session ? session.user : null));
  return () => { try { data.subscription.unsubscribe(); } catch (e) {} };
}
export async function signUpEmail(email, password) {
  if (!hasBackend) return { error: 'Accounts are not configured.' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  // If email confirmation is on, there is no session yet.
  return { needsConfirm: !data.session, user: data.user };
}
export async function signInEmail(email, password) {
  if (!hasBackend) return { error: 'Accounts are not configured.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { error: error.message } : {};
}
export async function signOutUser() { if (hasBackend) { try { await supabase.auth.signOut(); } catch (e) {} } }

// ---- profiles ----
export async function getProfile(userId) {
  if (!hasBackend) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data || null;
}
export async function createProfile(userId, handle, displayName) {
  if (!hasBackend) return { error: 'Accounts are not configured.' };
  const clean = (handle || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (clean.length < 3) return { error: 'Username needs at least 3 letters, numbers, or underscores.' };
  const { data, error } = await supabase.from('profiles')
    .insert({ id: userId, handle: clean, display_name: (displayName || '').trim() || clean })
    .select().maybeSingle();
  if (error) {
    if ((error.message || '').toLowerCase().includes('duplicate')) return { error: 'That username is taken — try another.' };
    return { error: error.message };
  }
  return { profile: data };
}

// ---- entries ----
export async function loadEntries(userId) {
  if (!hasBackend) return {};
  const { data, error } = await supabase.from('entries').select('*').eq('user_id', userId);
  if (error || !data) return {};
  const out = {};
  data.forEach((r) => { out[r.song_id] = fromRow(r); });
  return out;
}
export async function saveEntryRow(userId, songId, entry) {
  if (!hasBackend) return;
  try { await supabase.from('entries').upsert(toRow(songId, userId, entry), { onConflict: 'user_id,song_id' }); }
  catch (e) {}
}
export async function importLocal(userId, entries) {
  if (!hasBackend) return 0;
  const rows = Object.keys(entries || {}).map((songId) => toRow(songId, userId, entries[songId]));
  if (!rows.length) return 0;
  const { error } = await supabase.from('entries').upsert(rows, { onConflict: 'user_id,song_id' });
  return error ? 0 : rows.length;
}
