import React from 'react';
import { ARTISTS } from './data';
import {
  hasBackend, getSessionUser, onAuth, signUpEmail, signInEmail, signOutUser,
  getProfile, createProfile, loadEntries, saveEntryRow, importLocal,
  searchUsers, sendRequest, incomingRequests, listFriends, acceptRequest, removeFriendship, friendsFeed,
} from './db';

const songMeta = (id) => SONGS.find((s) => s.id === id) || null;

/*
 * The Listening Journal — reflect on songs across your favorite artists,
 * era by era. Entries save to the browser (accounts/sharing come next).
 */

const KEY = 'swiftie-listening-journal-v1';

// Flatten every artist → album → track into a single song list.
const SONGS = [];
ARTISTS.forEach((ar) => ar.albums.forEach((al) => al.tracks.forEach((title, i) => {
  SONGS.push({
    id: ar.id + ':' + al.id + '-' + (i + 1),
    artistId: ar.id, artist: ar.name,
    albumId: al.id, album: al.name, accent: al.accent,
    track: 'Track ' + (i + 1), title,
  });
})));

const findArtist = (id) => ARTISTS.find((a) => a.id === id);
const findAlbum = (artistId, albumId) => {
  const ar = findArtist(artistId);
  return ar ? ar.albums.find((al) => al.id === albumId) : null;
};

const PALETTE = [
  { name: 'red', hex: '#d1352b' }, { name: 'orange', hex: '#e07a2a' }, { name: 'gold', hex: '#e0b23a' },
  { name: 'green', hex: '#5b9c6a' }, { name: 'teal', hex: '#2fae8f' }, { name: 'sky', hex: '#5b9bd0' },
  { name: 'navy', hex: '#2c4670' }, { name: 'indigo', hex: '#6b4e9e' }, { name: 'lavender', hex: '#b79ad8' },
  { name: 'pink', hex: '#eaa9c4' }, { name: 'maroon', hex: '#7c1f26' }, { name: 'sepia', hex: '#a5824f' },
  { name: 'black', hex: '#2a2a2a' }, { name: 'silver', hex: '#c9ccd2' },
];

// Parse an inline CSS string into a React style object.
function css(str) {
  const o = {};
  if (!str) return o;
  str.split(';').forEach((part) => {
    const i = part.indexOf(':');
    if (i < 0) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (!k) return;
    o[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  });
  return o;
}

export default class ListeningJournal extends React.Component {
  state = {
    view: 'artists', activeArtist: null, activeAlbum: null, activeSong: null, colorFilter: null, entries: {},
    user: null, profile: null, authReady: !hasBackend,
    authView: null, authMode: 'login', accountMenu: false,
    fEmail: '', fPassword: '', fHandle: '', fDisplay: '', authMsg: '', authBusy: false,
    friendQuery: '', friendResults: [], requested: {}, incoming: [], friends: [], feed: [], friendsLoading: false,
  };
  saveTimers = {};

  componentDidMount() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) || {};
        // Migrate old single-artist keys ("lover-2") to artist-scoped ("taylor:lover-2").
        const migrated = {};
        let changed = false;
        Object.keys(parsed).forEach((k) => {
          if (k.includes(':')) { migrated[k] = parsed[k]; }
          else { migrated['taylor:' + k] = parsed[k]; changed = true; }
        });
        this.setState({ entries: migrated }, changed ? this.persistLocal : undefined);
      }
    } catch (e) {}

    if (hasBackend) {
      getSessionUser().then((u) => this.handleUser(u)).catch(() => this.setState({ authReady: true }));
      this.unsub = onAuth((u) => this.handleUser(u));
    }
  }
  componentWillUnmount() { if (this.unsub) this.unsub(); }

  // React to sign-in / sign-out: load the right profile + entries.
  handleUser = async (u) => {
    this.setState({ user: u || null });
    if (!u) { this.setState({ profile: null, authReady: true }); return; }
    try {
      const prof = await getProfile(u.id);
      if (!prof) { this.setState({ profile: null, authView: 'profile-setup', authReady: true }); return; }
      const cloud = await loadEntries(u.id);
      this.setState({ profile: prof, authView: null, entries: cloud, authReady: true });
    } catch (e) { this.setState({ authReady: true }); }
  };

  persistLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(this.state.entries)); } catch (e) {} };
  // Save one song's entry. Signed in -> cloud only (debounced), so a user's
  // reflections aren't left behind in a shared browser. Signed out -> localStorage.
  saveEntry = (id) => {
    if (this.state.user) {
      clearTimeout(this.saveTimers[id]);
      this.saveTimers[id] = setTimeout(() => saveEntryRow(this.state.user.id, id, this.entry(id)), 600);
    } else {
      this.persistLocal();
    }
  };
  migrateKeys(obj) { const out = {}; Object.keys(obj || {}).forEach((k) => { out[k.includes(':') ? k : ('taylor:' + k)] = obj[k]; }); return out; }
  readLocal() { try { const raw = localStorage.getItem(KEY); return raw ? this.migrateKeys(JSON.parse(raw) || {}) : {}; } catch (e) { return {}; } }
  blank() { return { mood: '', songType: '', where: '', favLine: '', bridgeLine: '', relates: '', colors: [], overall: 0, replay: 0, bridgePower: 0, visibility: 'private' }; }
  entry(id) { return { ...this.blank(), ...(this.state.entries[id] || {}) }; }
  touched(e) { return !!(e.overall || e.replay || e.bridgePower || e.mood || e.songType || e.where || e.favLine || e.bridgeLine || e.relates || (e.colors && e.colors.length)); }

  setField(key, val) {
    const id = this.state.activeSong; if (!id) return;
    this.setState((s) => {
      const cur = { ...this.blank(), ...(s.entries[id] || {}) };
      cur[key] = val;
      return { entries: { ...s.entries, [id]: cur } };
    }, () => this.saveEntry(id));
  }
  toggleColor(name) {
    const cur = this.entry(this.state.activeSong);
    const has = cur.colors.includes(name);
    let colors = has ? cur.colors.filter((c) => c !== name) : [...cur.colors, name];
    if (colors.length > 5) colors = colors.slice(-5);
    this.setField('colors', colors);
  }

  exportJournal = () => {
    try {
      const blob = new Blob([JSON.stringify(this.state.entries || {}, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const d = new Date();
      const stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      a.href = url; a.download = 'my-listening-journal-' + stamp + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    } catch (e) {}
  };
  importJournal = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files && input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed && typeof parsed === 'object') this.setState({ entries: { ...this.state.entries, ...parsed } }, () => { this.persistLocal(); if (this.state.user) importLocal(this.state.user.id, this.state.entries); });
        } catch (e) { try { window.alert('That file could not be read as a journal backup.'); } catch (e2) {} }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  goArtists = () => this.setState({ view: 'artists', activeArtist: null, activeAlbum: null, activeSong: null });
  goInsights = () => this.setState({ view: 'insights', activeAlbum: null, activeSong: null });
  openArtist = (id) => this.setState({ view: 'library', activeArtist: id, activeAlbum: null, activeSong: null });
  openAlbum = (albumId) => this.setState((s) => ({ view: 'album', activeAlbum: albumId, activeSong: null }));
  backToArtist = () => this.setState({ view: 'library', activeAlbum: null, activeSong: null });
  backToAlbum = () => this.setState({ view: 'album', activeSong: null });
  parseSong(id) { const ci = id.indexOf(':'); const rest = id.slice(ci + 1); const di = rest.lastIndexOf('-'); return { artistId: id.slice(0, ci), albumId: rest.slice(0, di) }; }
  openSong = (id) => { const p = this.parseSong(id); this.setState({ view: 'song', activeSong: id, activeArtist: p.artistId, activeAlbum: p.albumId }); };
  pickColorFilter = (name) => this.setState((s) => ({ colorFilter: s.colorFilter === name ? null : name }));

  // ---- account actions ----
  openAuth = (mode) => this.setState({ authView: 'auth', authMode: mode, authMsg: '', fEmail: '', fPassword: '', accountMenu: false });
  closeAuth = () => this.setState({ authView: null, authMsg: '' });
  setForm = (key) => (ev) => this.setState({ [key]: ev.target.value });
  toggleAccountMenu = () => this.setState((s) => ({ accountMenu: !s.accountMenu }));

  doAuth = async () => {
    const { authMode, fEmail, fPassword } = this.state;
    if (!fEmail || !fPassword) { this.setState({ authMsg: 'Enter your email and password.' }); return; }
    this.setState({ authBusy: true, authMsg: '' });
    if (authMode === 'signup') {
      const r = await signUpEmail(fEmail.trim(), fPassword);
      this.setState({ authBusy: false });
      if (r.error) { this.setState({ authMsg: r.error }); return; }
      if (r.needsConfirm) { this.setState({ authMode: 'login', fPassword: '', authMsg: 'Check your email to confirm your account, then log in.' }); return; }
      this.setState({ authView: null });
    } else {
      const r = await signInEmail(fEmail.trim(), fPassword);
      this.setState({ authBusy: false });
      if (r.error) { this.setState({ authMsg: r.error }); return; }
      this.setState({ authView: null, fPassword: '' });
    }
  };

  doProfileSetup = async () => {
    const { user, fHandle, fDisplay } = this.state;
    if (!user) return;
    this.setState({ authBusy: true, authMsg: '' });
    const r = await createProfile(user.id, fHandle, fDisplay);
    this.setState({ authBusy: false });
    if (r.error) { this.setState({ authMsg: r.error }); return; }
    const cloud = await loadEntries(user.id);
    this.setState({ profile: r.profile, authView: null, entries: cloud, fHandle: '', fDisplay: '' });
  };

  doSignOut = async () => {
    await signOutUser();
    this.setState({ user: null, profile: null, accountMenu: false, authView: null, entries: this.readLocal() });
  };

  doImportLocal = async () => {
    if (!this.state.user) return;
    const local = this.readLocal();
    const n = await importLocal(this.state.user.id, local);
    const cloud = await loadEntries(this.state.user.id);
    this.setState({ entries: cloud, accountMenu: false });
    try { window.alert(n ? ('Imported ' + n + ' local entries into your account.') : 'No local entries found to import.'); } catch (e) {}
  };

  // ---- friends ----
  goFriends = () => { this.setState({ view: 'friends', activeSong: null, accountMenu: false }); this.loadFriends(); };
  loadFriends = async () => {
    if (!this.state.user) return;
    this.setState({ friendsLoading: true });
    try {
      const [incoming, friends, feed] = await Promise.all([
        incomingRequests(this.state.user.id), listFriends(this.state.user.id), friendsFeed(this.state.user.id),
      ]);
      this.setState({ incoming, friends, feed, friendsLoading: false });
    } catch (e) { this.setState({ friendsLoading: false }); }
  };
  doFriendSearch = async () => {
    if (!this.state.user) return;
    const results = await searchUsers(this.state.user.id, this.state.friendQuery);
    this.setState({ friendResults: results });
  };
  doSendRequest = async (toId) => {
    if (!this.state.user) return;
    const r = await sendRequest(this.state.user.id, toId);
    if (!r.error) this.setState((s) => ({ requested: { ...s.requested, [toId]: true } }));
    else try { window.alert(r.error); } catch (e) {}
  };
  doAccept = async (fid) => { await acceptRequest(fid); this.loadFriends(); };
  doRemoveFriend = async (fid) => { await removeFriendship(fid); this.loadFriends(); };

  hexOf(name) { const p = PALETTE.find((x) => x.name === name); return p ? p.hex : '#ccc'; }
  starStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  renderVals() {
    const S = this.state;
    const tab = (on) => 'font-family:Quicksand,sans-serif; font-size:13px; font-weight:700; letter-spacing:0.5px; cursor:pointer; padding:8px 18px; border-radius:20px; border:1.5px solid ' +
      (on ? '#a23a63; background:#a23a63; color:#fff;' : '#e6c2d2; background:transparent; color:#a23a63;');

    const isArtists = S.view === 'artists';
    const isLibrary = S.view === 'library' && !!S.activeArtist && !S.activeSong && S.view !== 'album';
    const isAlbum = S.view === 'album' && !!S.activeAlbum && !S.activeSong;
    const isInsights = S.view === 'insights';
    const isFriends = S.view === 'friends';
    const isEditor = S.view === 'song' && !!S.activeSong;
    const browsing = isArtists || isLibrary || isAlbum || isEditor;

    const vals = {
      goArtists: this.goArtists, goInsights: this.goInsights, goFriends: this.goFriends, backToArtist: this.backToArtist, backToAlbum: this.backToAlbum,
      exportJournal: this.exportJournal, importJournal: this.importJournal,
      iconBtnStyle: 'font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:8px 14px; border-radius:20px; border:1.5px solid #e6c2d2; background:transparent; color:#a23a63;',
      songsTabStyle: tab(browsing),
      insightsTabStyle: tab(isInsights),
      friendsTabStyle: tab(isFriends),
      isArtists, isLibrary, isAlbum, isInsights, isFriends, isEditor,
    };

    const loggedCount = SONGS.filter((s) => this.touched(this.entry(s.id))).length;

    // ---- artists home ----
    vals.artistCards = ARTISTS.map((ar) => {
      const songs = SONGS.filter((s) => s.artistId === ar.id);
      const done = songs.filter((s) => this.touched(this.entry(s.id))).length;
      return {
        name: ar.name, accent: ar.accent, blurb: ar.blurb, trackCount: songs.length, albumCount: ar.albums.length,
        progress: done ? done + ' / ' + songs.length + ' reflected' : 'not started',
        progressColor: done ? ar.accent : '#c9b3bd',
        open: () => this.openArtist(ar.id),
        cardStyle: 'background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:0 0 16px; cursor:pointer; overflow:hidden; box-shadow:0 2px 0 rgba(122,41,71,0.04);',
      };
    });
    vals.artistsSubtitle = loggedCount
      ? loggedCount + ' songs reflected on so far. Pick an artist to keep going.'
      : 'Four artists, every era, every track. Pick someone to start.';

    // ---- a chosen artist's album grid ----
    if (isLibrary) {
      const ar = findArtist(S.activeArtist);
      vals.ar = { name: ar.name, accent: ar.accent };
      vals.libraryHeaderStyle = 'border-bottom:2px solid ' + ar.accent + '33; padding-bottom:16px; margin-bottom:22px;';
      vals.albumCards = ar.albums.map((al) => {
        const done = al.tracks.filter((t, i) => this.touched(this.entry(ar.id + ':' + al.id + '-' + (i + 1)))).length;
        return {
          name: al.name, accent: al.accent, trackCount: al.tracks.length,
          progress: done ? done + ' / ' + al.tracks.length + ' done' : 'not started',
          progressColor: done ? al.accent : '#c9b3bd',
          open: () => this.openAlbum(al.id),
          cardStyle: 'background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:18px 20px 16px; cursor:pointer; box-shadow:0 2px 0 rgba(122,41,71,0.04);',
        };
      });
    }

    // ---- album track list ----
    if (isAlbum) {
      const ar = findArtist(S.activeArtist);
      const al = findAlbum(S.activeArtist, S.activeAlbum);
      const dividers = al.dividers || {};
      const dividerLabels = Object.keys(dividers).sort((a, b) => a - b).map((k) => dividers[k]);
      const bonusNote = dividerLabels.length ? ' · with ' + dividerLabels.join(' + ') : '';
      vals.al = { name: al.name, accent: al.accent, artist: ar.name, subtitle: al.tracks.length + ' tracks' + bonusNote + ' · tap any song to reflect on it' };
      vals.albumHeaderStyle = 'border-bottom:2px solid ' + al.accent + '33; padding-bottom:16px; margin-bottom:22px;';
      vals.dividerStyle = 'padding:11px 18px; background:' + al.accent + '12; border-top:1px solid #f4e2ea; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + al.accent + ';';
      vals.albumBack = '← ' + ar.name;
      vals.albumTracks = al.tracks.map((title, i) => {
        const id = ar.id + ':' + al.id + '-' + (i + 1);
        const e = this.entry(id);
        const divLabel = dividers[i + 1];
        return {
          num: i + 1, title, open: () => this.openSong(id),
          stars: this.starStr(e.overall),
          showDivider: !!divLabel, dividerLabel: divLabel || '',
          rowStyle: 'display:flex; align-items:center; gap:10px; padding:13px 18px; cursor:pointer; border-top:' + ((i && !divLabel) ? '1px solid #f4e2ea' : 'none') + ';',
          colorDots: e.colors.map((c) => ({ style: 'width:11px; height:11px; border-radius:50%; background:' + this.hexOf(c) + '; box-shadow:0 0 0 1px rgba(0,0,0,0.08);' })),
        };
      });
    }

    // ---- editor ----
    if (isEditor) {
      const meta = SONGS.find((s) => s.id === S.activeSong);
      const e = this.entry(S.activeSong);
      vals.e = { album: meta.album, artist: meta.artist, title: meta.title, trackLabel: meta.track, accent: meta.accent };
      vals.v = e;
      vals.backLabel = '← ' + meta.album;
      vals.editorHeaderStyle = 'border-bottom:2px solid ' + meta.accent + '33; padding-bottom:16px; margin-bottom:22px;';
      vals.fieldBoxStyle = 'background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:16px 18px;';
      vals.favBoxStyle = 'background:#fbe4ee; border:1.5px solid #f3c9dc; border-radius:16px; padding:16px 18px; margin-bottom:22px;';
      vals.bridgeBoxStyle = 'background:#e3f0f9; border:1.5px solid #c6e0f0; border-radius:16px; padding:16px 18px; margin-bottom:22px;';
      vals.fieldLabelStyle = 'font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#a23a63; margin-bottom:8px;';
      vals.inputStyle = 'width:100%; border:none; border-bottom:1.5px solid #e6c2d2; background:transparent; font-size:15px; color:#3a2530; padding:6px 2px;';
      vals.areaStyle = 'width:100%; border:none; background:transparent; font-size:15px; color:#3a2530; resize:none; line-height:1.6;';
      vals.areaStyleBlue = 'width:100%; border:none; background:transparent; font-size:15px; color:#274b66; resize:none; line-height:1.6;';

      vals.onMood = (ev) => this.setField('mood', ev.target.value);
      vals.onSongType = (ev) => this.setField('songType', ev.target.value);
      vals.onWhere = (ev) => this.setField('where', ev.target.value);
      vals.onFav = (ev) => this.setField('favLine', ev.target.value);
      vals.onBridge = (ev) => this.setField('bridgeLine', ev.target.value);
      vals.onRelates = (ev) => this.setField('relates', ev.target.value);
      vals.setVis = (val) => this.setField('visibility', val);
      const visPill = (on) => 'font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:7px 14px; border-radius:16px; border:1.5px solid ' + (on ? '#a23a63; background:#a23a63; color:#fff;' : '#e6c2d2; background:transparent; color:#a23a63;');
      vals.visPrivateStyle = visPill(e.visibility !== 'friends');
      vals.visFriendsStyle = visPill(e.visibility === 'friends');

      vals.editorPalette = PALETTE.map((p) => {
        const on = e.colors.includes(p.name);
        return {
          name: p.name, toggle: () => this.toggleColor(p.name),
          style: 'width:26px; height:26px; border-radius:50%; cursor:pointer; background:' + p.hex + '; border:2px solid ' + (on ? '#3a2530' : 'rgba(0,0,0,0.12)') + '; box-shadow:' + (on ? '0 0 0 2px #fffdfb, 0 0 0 3px ' + p.hex : 'none') + '; transform:' + (on ? 'scale(1.08)' : 'scale(1)') + '; transition:transform .1s;',
        };
      });
      vals.colorSummary = e.colors.length ? 'This song is ' + e.colors.join(', ') : 'Tap up to 5 colors this song paints in your head.';

      vals.overallStars = [1, 2, 3, 4, 5].map((n) => ({
        glyph: n <= e.overall ? '★' : '☆',
        set: () => this.setField('overall', n === e.overall ? 0 : n),
        style: 'cursor:pointer; font-size:26px; line-height:1; color:' + (n <= e.overall ? meta.accent : '#dcc5cf') + ';',
      }));
      vals.bridgeStars = [1, 2, 3, 4, 5].map((n) => ({
        glyph: n <= e.bridgePower ? '★' : '☆',
        set: () => this.setField('bridgePower', n === e.bridgePower ? 0 : n),
        style: 'cursor:pointer; font-size:24px; line-height:1; color:' + (n <= e.bridgePower ? '#3f6d92' : '#bcd6e8') + ';',
      }));
      vals.replayDots = [1, 2, 3, 4, 5].map((n) => ({
        set: () => this.setField('replay', n === e.replay ? 0 : n),
        style: 'width:20px; height:20px; border-radius:50%; cursor:pointer; border:2px solid ' + meta.accent + '; background:' + (n <= e.replay ? meta.accent : 'transparent') + ';',
      }));
    }

    // ---- insights (across all artists) ----
    if (isInsights) {
      const chip = 'display:flex; flex-direction:column; gap:2px; background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:14px; padding:11px 16px; cursor:pointer; color:#3a2530;';
      vals.emptyStyle = 'font-size:13px; color:#b58ea0; background:#faf1f5; border:1.5px dashed #ecccd9; border-radius:14px; padding:16px 18px;';
      const withEntry = SONGS.map((s) => ({ meta: s, e: this.entry(s.id) }));
      const openFor = (id) => () => this.openSong(id);

      const rated = withEntry.filter((x) => x.e.overall > 0);
      const avg = rated.length ? (rated.reduce((a, x) => a + x.e.overall, 0) / rated.length) : 0;
      const colorCounts = PALETTE.map((p) => ({ name: p.name, n: withEntry.filter((x) => x.e.colors.includes(p.name)).length })).filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
      vals.statCards = [
        { value: loggedCount, label: 'Songs logged' },
        { value: withEntry.filter((x) => x.e.overall === 5).length, label: 'Five-star' },
        { value: rated.length ? avg.toFixed(1) : '–', label: 'Avg rating' },
        { value: colorCounts.length ? colorCounts[0].name : '–', label: 'Top color' },
      ];

      const five = withEntry.filter((x) => x.e.overall === 5);
      vals.hasFiveStar = five.length > 0; vals.noFiveStar = five.length === 0;
      vals.fiveStarSongs = five.map((x) => ({ title: x.meta.title, album: x.meta.artist, open: openFor(x.meta.id), chipStyle: chip + 'border-left:4px solid ' + x.meta.accent + ';' }));

      const replay = withEntry.filter((x) => x.e.replay > 0).sort((a, b) => b.e.replay - a.e.replay).slice(0, 15);
      vals.hasReplay = replay.length > 0; vals.noReplay = replay.length === 0;
      vals.replayRank = replay.map((x, i) => ({
        rank: i + 1, title: x.meta.title, album: x.meta.artist + ' · ' + x.meta.album, open: openFor(x.meta.id),
        rowStyle: 'display:flex; align-items:center; gap:10px; padding:12px 16px; cursor:pointer; border-top:' + (i ? '1px solid #f4e2ea' : 'none') + ';',
        dots: [1, 2, 3, 4, 5].map((n) => ({ style: 'width:12px; height:12px; border-radius:50%; border:1.5px solid ' + x.meta.accent + '; background:' + (n <= x.e.replay ? x.meta.accent : 'transparent') + ';' })),
      }));

      vals.colorFilterPalette = PALETTE.map((p) => {
        const count = withEntry.filter((x) => x.e.colors.includes(p.name)).length;
        const active = S.colorFilter === p.name;
        return {
          name: p.name, count: count ? ('(' + count + ')') : '', pick: this.pickColorFilter.bind(this, p.name),
          style: 'display:flex; align-items:center; gap:7px; font-family:Quicksand,sans-serif; font-size:12px; font-weight:600; cursor:pointer; padding:6px 12px 6px 8px; border-radius:16px; border:1.5px solid ' + (active ? '#3a2530' : '#e6c2d2') + '; background:' + (active ? '#fff4f8' : '#fffdfb') + '; color:#5b3a49;',
          swatchStyle: 'width:16px; height:16px; border-radius:50%; background:' + p.hex + '; box-shadow:0 0 0 1px rgba(0,0,0,0.1);',
        };
      });
      if (S.colorFilter) {
        const res = withEntry.filter((x) => x.e.colors.includes(S.colorFilter));
        vals.hasColorResults = res.length > 0; vals.colorFilterEmpty = res.length === 0;
        vals.colorEmptyMsg = 'No songs colored ' + S.colorFilter + ' yet.';
        vals.colorResults = res.map((x) => ({ title: x.meta.title, album: x.meta.artist, open: openFor(x.meta.id), chipStyle: chip + 'border-left:4px solid ' + this.hexOf(S.colorFilter) + ';' }));
      } else {
        vals.hasColorResults = false; vals.colorFilterEmpty = true; vals.colorResults = []; vals.colorEmptyMsg = 'Pick a color above to filter.';
      }

      const bridges = withEntry.filter((x) => x.e.bridgePower > 0).sort((a, b) => b.e.bridgePower - a.e.bridgePower).slice(0, 15);
      vals.hasBridge = bridges.length > 0; vals.noBridge = bridges.length === 0;
      vals.bridgeRank = bridges.map((x) => ({ title: x.meta.title, stars: this.starStr(x.e.bridgePower), open: openFor(x.meta.id), chipStyle: chip + 'border-left:4px solid #3f6d92;' }));
    }

    return vals;
  }

  render() {
    const vals = this.renderVals();
    return (
      <div className="jrnl-scroll" style={css("min-height:100%; background:#efe6ea; font-family:'Quicksand',sans-serif; color:#5b3a49;")}>

        {/* TOP BAR */}
        <div style={css('position:sticky; top:0; z-index:10; background:rgba(255,253,251,0.92); backdrop-filter:blur(6px); border-bottom:1.5px solid #f0d7e1; padding:16px 32px; display:flex; align-items:center; justify-content:space-between; gap:20px;')}>
          <div style={css('display:flex; align-items:baseline; gap:12px; cursor:pointer;')} onClick={vals.goArtists}>
            <span style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#6b2440;")}>The Listening Journal</span>
          </div>
          <div style={css('display:flex; align-items:center; gap:8px;')}>
            <button onClick={vals.goArtists} style={css(vals.songsTabStyle)}>Artists</button>
            <button onClick={vals.goInsights} style={css(vals.insightsTabStyle)}>Insights</button>
            {this.state.user && this.state.profile && <button onClick={vals.goFriends} style={css(vals.friendsTabStyle)}>Friends</button>}
            <span style={css('width:1px; height:22px; background:#f0d7e1; margin:0 4px;')}></span>
            <button onClick={vals.exportJournal} title="Download a backup of your journal" style={css(vals.iconBtnStyle)}>⇩ Back up</button>
            <button onClick={vals.importJournal} title="Restore a journal backup file" style={css(vals.iconBtnStyle)}>⇧ Restore</button>
            {hasBackend && (this.state.user && this.state.profile ? (
              <div style={{ position: 'relative' }}>
                <button onClick={this.toggleAccountMenu} style={css('font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:8px 14px; border-radius:20px; border:1.5px solid #a23a63; background:#a23a63; color:#fff;')}>@{this.state.profile.handle}</button>
                {this.state.accountMenu && (
                  <div style={css('position:absolute; right:0; top:42px; background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:12px; padding:6px; min-width:190px; box-shadow:0 6px 20px rgba(122,41,71,0.14); z-index:30;')}>
                    <button onClick={this.doImportLocal} style={css('display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-family:Quicksand,sans-serif; font-size:13px; color:#5b3a49; padding:9px 12px; border-radius:8px;')}>Import local entries</button>
                    <button onClick={this.doSignOut} style={css('display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-family:Quicksand,sans-serif; font-size:13px; color:#a23a63; padding:9px 12px; border-radius:8px;')}>Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => this.openAuth('login')} style={css('font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:8px 16px; border-radius:20px; border:1.5px solid #a23a63; background:#a23a63; color:#fff;')}>Log in</button>
            ))}
          </div>
        </div>

        {/* ARTISTS HOME */}
        {vals.isArtists && (
          <div style={css('max-width:1080px; margin:0 auto; padding:34px 32px 60px;')}>
            <div style={css('margin-bottom:6px; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c98aa4;')}>Your listening journal</div>
            <h1 style={css("margin:0 0 6px; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:40px; color:#6b2440;")}>Pick an artist</h1>
            <div style={css('font-size:14.5px; color:#9a6a7c; margin-bottom:28px; max-width:640px;')}>{vals.artistsSubtitle}</div>
            <div style={css('display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:18px;')}>
              {vals.artistCards.map((a, idx) => (
                <div key={idx} onClick={a.open} style={css(a.cardStyle)}>
                  <div style={css('height:10px; background:' + a.accent + ';')}></div>
                  <div style={css('padding:16px 20px 0;')}>
                    <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:26px; color:#3a2530; line-height:1.1;")}>{a.name}</div>
                    <div style={css('font-size:12px; color:#9a6a7c; margin-top:4px;')}>{a.blurb} · {a.albumCount} eras</div>
                    <div style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:14px;')}>
                      <span style={css('font-size:12px; font-weight:600; color:#9a6a7c;')}>{a.trackCount} songs</span>
                      <span style={css('font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:' + a.progressColor + ';')}>{a.progress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY: a chosen artist's eras */}
        {vals.isLibrary && (
          <div style={css('max-width:1080px; margin:0 auto; padding:26px 32px 60px;')}>
            <button onClick={vals.goArtists} style={css("background:none; border:none; cursor:pointer; font-family:'Quicksand',sans-serif; font-size:13px; font-weight:600; color:#a23a63; padding:6px 0; margin-bottom:16px;")}>← All artists</button>
            <div style={css(vals.libraryHeaderStyle)}>
              <div style={css('font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + vals.ar.accent + ';')}>The Eras Of</div>
              <h1 style={css("margin:6px 0 0; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:40px; color:#3a2530;")}>{vals.ar.name}</h1>
            </div>
            <div style={css('display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:18px;')}>
              {vals.albumCards.map((a, idx) => (
                <div key={idx} onClick={a.open} style={css(a.cardStyle)}>
                  <div style={css('height:8px; border-radius:8px; background:' + a.accent + '; margin-bottom:16px;')}></div>
                  <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:26px; color:#3a2530; line-height:1.1; margin-bottom:6px;")}>{a.name}</div>
                  <div style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:14px;')}>
                    <span style={css('font-size:12px; font-weight:600; color:#9a6a7c;')}>{a.trackCount} tracks</span>
                    <span style={css('font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:' + a.progressColor + ';')}>{a.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALBUM: TRACK LIST */}
        {vals.isAlbum && (
          <div style={css('max-width:820px; margin:0 auto; padding:26px 32px 70px;')}>
            <button onClick={vals.backToArtist} style={css("background:none; border:none; cursor:pointer; font-family:'Quicksand',sans-serif; font-size:13px; font-weight:600; color:#a23a63; padding:6px 0; margin-bottom:16px;")}>{vals.albumBack}</button>
            <div style={css(vals.albumHeaderStyle)}>
              <div style={css('font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + vals.al.accent + ';')}>{vals.al.artist}</div>
              <h1 style={css("margin:6px 0 0; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:44px; color:#3a2530; line-height:1.05;")}>{vals.al.name}</h1>
              <div style={css('font-size:13px; color:#9a6a7c; margin-top:8px;')}>{vals.al.subtitle}</div>
            </div>
            <div style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; overflow:hidden;')}>
              {vals.albumTracks.map((t, idx) => (
                <div key={idx}>
                  {t.showDivider && (<div style={css(vals.dividerStyle)}>{t.dividerLabel}</div>)}
                  <div onClick={t.open} style={css(t.rowStyle)}>
                    <span style={css('font-size:13px; font-weight:700; color:' + vals.al.accent + '; width:26px; flex:none;')}>{t.num}</span>
                    <span style={css('flex:1; font-weight:600; font-size:15.5px; color:#3a2530;')}>{t.title}</span>
                    <div style={css('display:flex; align-items:center; gap:5px; margin-right:12px;')}>
                      {t.colorDots.map((d, di) => (<span key={di} style={css(d.style)}></span>))}
                    </div>
                    <span style={css('font-size:15px; letter-spacing:1px; color:' + vals.al.accent + ';')}>{t.stars}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SONG EDITOR */}
        {vals.isEditor && (
          <div style={css('max-width:820px; margin:0 auto; padding:26px 32px 70px;')}>
            <button onClick={vals.backToAlbum} style={css("background:none; border:none; cursor:pointer; font-family:'Quicksand',sans-serif; font-size:13px; font-weight:600; color:#a23a63; padding:6px 0; margin-bottom:16px;")}>{vals.backLabel}</button>
            <div style={css(vals.editorHeaderStyle)}>
              <div style={css('display:flex; align-items:center; gap:12px; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + vals.e.accent + '; flex-wrap:wrap;')}>
                <span>{vals.e.artist}</span>
                <span style={css('width:5px; height:5px; border-radius:50%; background:' + vals.e.accent + '; opacity:0.6;')}></span>
                <span>{vals.e.album}</span>
                <span style={css('width:5px; height:5px; border-radius:50%; background:' + vals.e.accent + '; opacity:0.6;')}></span>
                <span style={css('opacity:0.7;')}>{vals.e.trackLabel}</span>
              </div>
              <h1 style={css("margin:6px 0 0; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:44px; color:#3a2530; line-height:1.05;")}>{vals.e.title}</h1>
            </div>
            <div style={css('display:flex; align-items:center; gap:10px; margin-bottom:22px; flex-wrap:wrap;')}>
              <span style={css('font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#a23a63;')}>Visibility</span>
              <div style={css('display:flex; gap:6px;')}>
                <button onClick={() => vals.setVis('private')} style={css(vals.visPrivateStyle)}>Private</button>
                <button onClick={() => vals.setVis('friends')} style={css(vals.visFriendsStyle)}>Shared with friends</button>
              </div>
              {!this.state.user && <span style={css('font-size:11px; color:#b58ea0;')}>Log in to actually share these</span>}
            </div>
            <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:20px 28px; margin-bottom:22px;')}>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Mood / feeling</div>
                <input value={vals.v.mood} onChange={vals.onMood} placeholder="how does it make you feel?" style={css(vals.inputStyle)} />
              </div>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Song type / theme</div>
                <input value={vals.v.songType} onChange={vals.onSongType} placeholder="love song, revenge bop, closure…" style={css(vals.inputStyle)} />
              </div>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Color of the song</div>
                <div style={css('display:flex; flex-wrap:wrap; gap:9px; margin-top:4px;')}>
                  {vals.editorPalette.map((p, idx) => (<button key={idx} onClick={p.toggle} title={p.name} style={css(p.style)}></button>))}
                </div>
                <div style={css('font-size:11px; color:#a98; margin-top:8px;')}>{vals.colorSummary}</div>
              </div>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Where / when I listen</div>
                <input value={vals.v.where} onChange={vals.onWhere} placeholder="late-night drives, first snow…" style={css(vals.inputStyle)} />
              </div>
            </div>
            <div style={css(vals.favBoxStyle)}>
              <div style={css(vals.fieldLabelStyle)}>Favorite line</div>
              <textarea value={vals.v.favLine} onChange={vals.onFav} rows={2} placeholder="write the line that lives in your head…" style={css(vals.areaStyle)}></textarea>
            </div>
            <div style={css(vals.bridgeBoxStyle)}>
              <div style={css('display:flex; align-items:center; gap:8px; margin-bottom:12px;')}>
                <span style={css('font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3f6d92;')}>The Bridge</span>
                <span style={css('color:#8fb8d6;')}>✦</span>
              </div>
              <textarea value={vals.v.bridgeLine} onChange={vals.onBridge} rows={2} placeholder="what happens to you in the bridge?" style={css(vals.areaStyleBlue)}></textarea>
              <div style={css('display:flex; align-items:center; gap:10px; margin-top:16px;')}>
                <span style={css('font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#3f6d92;')}>Bridge power</span>
                <div style={css('display:flex; gap:3px;')}>
                  {vals.bridgeStars.map((s, idx) => (<span key={idx} onClick={s.set} style={css(s.style)}>{s.glyph}</span>))}
                </div>
              </div>
            </div>
            <div style={{ ...css(vals.fieldBoxStyle), marginBottom: '22px' }}>
              <div style={css(vals.fieldLabelStyle)}>How this song relates to me</div>
              <textarea value={vals.v.relates} onChange={vals.onRelates} rows={4} placeholder="the biggest space — say everything…" style={css(vals.areaStyle)}></textarea>
            </div>
            <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:18px;')}>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Overall</div>
                <div style={css('display:flex; gap:4px; margin-top:4px;')}>
                  {vals.overallStars.map((s, idx) => (<span key={idx} onClick={s.set} style={css(s.style)}>{s.glyph}</span>))}
                </div>
              </div>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Skip — Replay</div>
                <div style={css('display:flex; gap:8px; margin-top:8px; align-items:center;')}>
                  {vals.replayDots.map((d, idx) => (<span key={idx} onClick={d.set} style={css(d.style)}></span>))}
                </div>
              </div>
            </div>
            <div style={css('text-align:center; margin-top:24px; font-size:12px; color:#b58ea0;')}>♡ Saved automatically as you write</div>
          </div>
        )}

        {/* INSIGHTS */}
        {vals.isInsights && (
          <div style={css('max-width:960px; margin:0 auto; padding:34px 32px 70px;')}>
            <div style={css('margin-bottom:6px; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c98aa4;')}>What your ratings say</div>
            <h1 style={css("margin:0 0 24px; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:40px; color:#6b2440;")}>Insights</h1>
            <div style={css('display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:30px;')}>
              {vals.statCards.map((s, idx) => (
                <div key={idx} style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:18px 20px;')}>
                  <div style={css("font-family:'Playfair Display',serif; font-weight:700; font-size:32px; color:#6b2440; line-height:1;")}>{s.value}</div>
                  <div style={css('font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#c98aa4; margin-top:6px;')}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={css('margin-bottom:30px;')}>
              <div style={css('display:flex; align-items:center; gap:10px; margin-bottom:14px;')}>
                <span style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#3a2530;")}>Five-star songs</span>
                <span style={css('font-size:18px; color:#eaa9c4;')}>★★★★★</span>
              </div>
              {vals.hasFiveStar && (
                <div style={css('display:flex; flex-wrap:wrap; gap:10px;')}>
                  {vals.fiveStarSongs.map((s, idx) => (
                    <div key={idx} onClick={s.open} style={css(s.chipStyle)}>
                      <span style={css('font-weight:700;')}>{s.title}</span>
                      <span style={css('opacity:0.6; font-size:12px;')}>{s.album}</span>
                    </div>
                  ))}
                </div>
              )}
              {vals.noFiveStar && (<div style={css(vals.emptyStyle)}>No 5-star songs yet — go rate a favorite.</div>)}
            </div>
            <div style={css('margin-bottom:30px;')}>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#3a2530; margin-bottom:14px;")}>Most replayable</div>
              {vals.hasReplay && (
                <div style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; overflow:hidden;')}>
                  {vals.replayRank.map((r, idx) => (
                    <div key={idx} onClick={r.open} style={css(r.rowStyle)}>
                      <span style={css('font-size:12px; font-weight:700; color:#c98aa4; width:22px;')}>{r.rank}</span>
                      <span style={css('flex:1; font-weight:600; color:#3a2530;')}>{r.title}</span>
                      <span style={css('font-size:11px; color:#a98; margin-right:12px;')}>{r.album}</span>
                      <div style={css('display:flex; gap:5px;')}>
                        {r.dots.map((d, di) => (<span key={di} style={css(d.style)}></span>))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {vals.noReplay && (<div style={css(vals.emptyStyle)}>Set some skip–replay scores to see this ranking.</div>)}
            </div>
            <div style={css('margin-bottom:30px;')}>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#3a2530; margin-bottom:6px;")}>Songs by color</div>
              <div style={css('font-size:13px; color:#9a6a7c; margin-bottom:14px;')}>Tap a color to see every song you painted with it.</div>
              <div style={css('display:flex; flex-wrap:wrap; gap:10px; margin-bottom:18px;')}>
                {vals.colorFilterPalette.map((p, idx) => (
                  <button key={idx} onClick={p.pick} style={css(p.style)}>
                    <span style={css(p.swatchStyle)}></span>
                    <span>{p.name}</span>
                    <span style={css('opacity:0.6;')}>{p.count}</span>
                  </button>
                ))}
              </div>
              {vals.hasColorResults && (
                <div style={css('display:flex; flex-wrap:wrap; gap:10px;')}>
                  {vals.colorResults.map((s, idx) => (
                    <div key={idx} onClick={s.open} style={css(s.chipStyle)}>
                      <span style={css('font-weight:700;')}>{s.title}</span>
                      <span style={css('opacity:0.6; font-size:12px;')}>{s.album}</span>
                    </div>
                  ))}
                </div>
              )}
              {vals.colorFilterEmpty && (<div style={css(vals.emptyStyle)}>{vals.colorEmptyMsg}</div>)}
            </div>
            <div>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#3a2530; margin-bottom:14px;")}>Strongest bridges</div>
              {vals.hasBridge && (
                <div style={css('display:flex; flex-wrap:wrap; gap:10px;')}>
                  {vals.bridgeRank.map((b, idx) => (
                    <div key={idx} onClick={b.open} style={css(b.chipStyle)}>
                      <span style={css('font-weight:700;')}>{b.title}</span>
                      <span style={css('color:#8fb8d6; font-size:13px; letter-spacing:1px;')}>{b.stars}</span>
                    </div>
                  ))}
                </div>
              )}
              {vals.noBridge && (<div style={css(vals.emptyStyle)}>Rate a few bridges to crown the best ones.</div>)}
            </div>
          </div>
        )}

        {vals.isFriends && (
          <div style={css('max-width:860px; margin:0 auto; padding:34px 32px 70px;')}>
            <div style={css('margin-bottom:6px; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c98aa4;')}>Your circle</div>
            <h1 style={css("margin:0 0 24px; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:40px; color:#6b2440;")}>Friends</h1>

            <div style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:18px 20px; margin-bottom:22px;')}>
              <div style={css('font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#a23a63; margin-bottom:10px;')}>Find friends</div>
              <div style={css('display:flex; gap:8px; flex-wrap:wrap;')}>
                <input value={this.state.friendQuery} onChange={this.setForm('friendQuery')} onKeyDown={(e) => { if (e.key === 'Enter') this.doFriendSearch(); }} placeholder="search by username" style={css('flex:1; min-width:180px; border:1.5px solid #e6c2d2; border-radius:10px; background:#fff; font-size:15px; color:#3a2530; padding:9px 12px;')} />
                <button onClick={this.doFriendSearch} style={css('font-family:Quicksand,sans-serif; font-size:13px; font-weight:700; cursor:pointer; padding:9px 18px; border-radius:10px; border:none; background:#a23a63; color:#fff;')}>Search</button>
              </div>
              {this.state.friendResults.length > 0 && (
                <div style={css('margin-top:14px; display:flex; flex-direction:column; gap:8px;')}>
                  {this.state.friendResults.map((u, idx) => (
                    <div key={idx} style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 4px; border-top:' + (idx ? '1px solid #f4e2ea' : 'none') + ';')}>
                      <div><span style={css('font-weight:700; color:#3a2530;')}>@{u.handle}</span>{u.display_name && u.display_name !== u.handle && <span style={css('color:#9a6a7c; font-size:13px; margin-left:8px;')}>{u.display_name}</span>}</div>
                      {this.state.requested[u.id] ? <span style={css('font-size:12px; color:#9a6a7c;')}>Requested</span> : <button onClick={() => this.doSendRequest(u.id)} style={css('font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:6px 14px; border-radius:16px; border:1.5px solid #a23a63; background:transparent; color:#a23a63;')}>Add</button>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {this.state.incoming.length > 0 && (
              <div style={css('margin-bottom:22px;')}>
                <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:22px; color:#3a2530; margin-bottom:12px;")}>Friend requests</div>
                <div style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; overflow:hidden;')}>
                  {this.state.incoming.map((r, idx) => (
                    <div key={idx} style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 18px; border-top:' + (idx ? '1px solid #f4e2ea' : 'none') + ';')}>
                      <span style={css('font-weight:700; color:#3a2530;')}>@{r.from.handle}</span>
                      <div style={css('display:flex; gap:8px;')}>
                        <button onClick={() => this.doAccept(r.id)} style={css('font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:6px 14px; border-radius:16px; border:none; background:#a23a63; color:#fff;')}>Accept</button>
                        <button onClick={() => this.doRemoveFriend(r.id)} style={css('font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:6px 12px; border-radius:16px; border:1.5px solid #e6c2d2; background:transparent; color:#a23a63;')}>Ignore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={css('margin-bottom:26px;')}>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:22px; color:#3a2530; margin-bottom:12px;")}>Your friends</div>
              {this.state.friends.length > 0 ? (
                <div style={css('display:flex; flex-wrap:wrap; gap:8px;')}>
                  {this.state.friends.map((f, idx) => (
                    <span key={idx} style={css('display:inline-flex; align-items:center; gap:8px; background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:7px 8px 7px 14px; color:#3a2530; font-weight:700; font-size:13px;')}>@{f.handle}<button onClick={() => this.doRemoveFriend(f.friendshipId)} title="Remove friend" style={css('cursor:pointer; border:none; background:#f4e2ea; color:#a23a63; border-radius:50%; width:18px; height:18px; line-height:1; font-size:12px;')}>×</button></span>
                  ))}
                </div>
              ) : (<div style={css('font-size:13px; color:#b58ea0; background:#faf1f5; border:1.5px dashed #ecccd9; border-radius:14px; padding:16px 18px;')}>No friends yet — search above to add some.</div>)}
            </div>

            <div>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:22px; color:#3a2530; margin-bottom:12px;")}>Friends' recent journals</div>
              {this.state.feed.length > 0 ? (
                <div style={css('display:flex; flex-direction:column; gap:12px;')}>
                  {this.state.feed.map((item, idx) => { const m = songMeta(item.songId); if (!m) return null; return (
                    <div key={idx} style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:14px; padding:14px 18px; border-left:4px solid ' + m.accent + ';')}>
                      <div style={css('display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap;')}>
                        <div><span style={css('font-weight:700; color:#3a2530;')}>{m.title}</span> <span style={css('font-size:12px; color:#9a6a7c;')}>{m.artist} · {m.album}</span></div>
                        <span style={css('font-size:12px; color:#a23a63; font-weight:700;')}>@{item.by.handle}</span>
                      </div>
                      {item.entry.overall > 0 && <div style={css('color:' + m.accent + '; font-size:14px; letter-spacing:1px; margin-top:4px;')}>{this.starStr(item.entry.overall)}</div>}
                      {item.entry.mood && <div style={css('font-size:13px; color:#5b3a49; margin-top:6px;')}><span style={css('color:#9a6a7c;')}>Mood: </span>{item.entry.mood}</div>}
                      {item.entry.favLine && <div style={css('font-size:14px; color:#6b2440; font-style:italic; margin-top:6px;')}>“{item.entry.favLine}”</div>}
                      {item.entry.relates && <div style={css('font-size:13px; color:#5b3a49; margin-top:6px; line-height:1.5;')}>{item.entry.relates}</div>}
                    </div>
                  ); })}
                </div>
              ) : (<div style={css('font-size:13px; color:#b58ea0; background:#faf1f5; border:1.5px dashed #ecccd9; border-radius:14px; padding:16px 18px;')}>When your friends share entries, they'll show up here.</div>)}
            </div>
          </div>
        )}

        {this.state.authView === 'auth' && (
          <div onClick={this.closeAuth} style={css('position:fixed; inset:0; background:rgba(58,37,48,0.4); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px;')}>
            <div onClick={(ev) => ev.stopPropagation()} style={css('background:#fffdfb; border-radius:18px; border:1.5px solid #f0d7e1; padding:28px 26px; width:100%; max-width:380px;')}>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:26px; color:#6b2440; margin-bottom:4px;")}>{this.state.authMode === 'signup' ? 'Create your account' : 'Welcome back'}</div>
              <div style={css('font-size:13px; color:#9a6a7c; margin-bottom:18px;')}>{this.state.authMode === 'signup' ? 'Save your journal and share with friends.' : 'Log in to your listening journal.'}</div>
              <input value={this.state.fEmail} onChange={this.setForm('fEmail')} type="email" placeholder="email" style={css('width:100%; border:1.5px solid #e6c2d2; border-radius:10px; background:#fff; font-size:15px; color:#3a2530; padding:10px 12px; margin-bottom:10px;')} />
              <input value={this.state.fPassword} onChange={this.setForm('fPassword')} type="password" placeholder="password" style={css('width:100%; border:1.5px solid #e6c2d2; border-radius:10px; background:#fff; font-size:15px; color:#3a2530; padding:10px 12px; margin-bottom:14px;')} />
              {this.state.authMsg && <div style={css('font-size:12px; color:#a23a63; margin-bottom:12px;')}>{this.state.authMsg}</div>}
              <button onClick={this.doAuth} style={css('width:100%; font-family:Quicksand,sans-serif; font-size:14px; font-weight:700; cursor:pointer; padding:11px; border-radius:12px; border:none; background:#a23a63; color:#fff; margin-bottom:12px;')}>{this.state.authBusy ? '…' : (this.state.authMode === 'signup' ? 'Sign up' : 'Log in')}</button>
              <div style={css('text-align:center; font-size:12px; color:#9a6a7c;')}>
                {this.state.authMode === 'signup' ? 'Already have an account? ' : 'New here? '}
                <span onClick={() => this.setState({ authMode: this.state.authMode === 'signup' ? 'login' : 'signup', authMsg: '' })} style={css('color:#a23a63; font-weight:700; cursor:pointer;')}>{this.state.authMode === 'signup' ? 'Log in' : 'Create one'}</span>
              </div>
            </div>
          </div>
        )}

        {this.state.authView === 'profile-setup' && (
          <div style={css('position:fixed; inset:0; background:rgba(58,37,48,0.4); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px;')}>
            <div style={css('background:#fffdfb; border-radius:18px; border:1.5px solid #f0d7e1; padding:28px 26px; width:100%; max-width:380px;')}>
              <div style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:26px; color:#6b2440; margin-bottom:4px;")}>Pick a username</div>
              <div style={css('font-size:13px; color:#9a6a7c; margin-bottom:18px;')}>This is how friends will find you. Letters, numbers, and underscores.</div>
              <input value={this.state.fHandle} onChange={this.setForm('fHandle')} placeholder="username" style={css('width:100%; border:1.5px solid #e6c2d2; border-radius:10px; background:#fff; font-size:15px; color:#3a2530; padding:10px 12px; margin-bottom:10px;')} />
              <input value={this.state.fDisplay} onChange={this.setForm('fDisplay')} placeholder="display name (optional)" style={css('width:100%; border:1.5px solid #e6c2d2; border-radius:10px; background:#fff; font-size:15px; color:#3a2530; padding:10px 12px; margin-bottom:14px;')} />
              {this.state.authMsg && <div style={css('font-size:12px; color:#a23a63; margin-bottom:12px;')}>{this.state.authMsg}</div>}
              <button onClick={this.doProfileSetup} style={css('width:100%; font-family:Quicksand,sans-serif; font-size:14px; font-weight:700; cursor:pointer; padding:11px; border-radius:12px; border:none; background:#a23a63; color:#fff;')}>{this.state.authBusy ? '…' : 'Save and continue'}</button>
            </div>
          </div>
        )}

      </div>
    );
  }
}
