import React from 'react';

/*
 * The Listening Journal — a Taylor Swift discography reflection app.
 * Ported from the original Claude artifact (dc-runtime) to standard React.
 * Behavior, data, and styling are preserved 1:1.
 */

const KEY = 'swiftie-listening-journal-v1';

const ALBUMS = [
  { id: 'debut', name: 'Taylor Swift', accent: '#1f7a78', tracks: [
    'Tim McGraw', 'Picture to Burn', 'Teardrops on My Guitar', 'A Place in This World', 'Cold as You', 'The Outside', 'Tied Together with a Smile', 'Stay Beautiful', 'Should’ve Said No', 'Mary’s Song (Oh My My My)', 'Our Song'] },
  { id: 'fearless', name: 'Fearless', accent: '#b58a1f', dividers: { 14: 'From the Vault · Taylor’s Version', 20: 'Platinum Edition' }, tracks: [
    'Fearless', 'Fifteen', 'Love Story', 'Hey Stephen', 'White Horse', 'You Belong with Me', 'Breathe', 'Tell Me Why', 'You’re Not Sorry', 'The Way I Loved You', 'Forever & Always', 'The Best Day', 'Change',
    'You All Over Me', 'Mr. Perfectly Fine', 'We Were Happy', 'That’s When', 'Don’t You', 'Bye Bye Baby',
    'Jump Then Fall', 'Untouchable', 'Come In with the Rain', 'Superstar', 'The Other Side of the Door', 'Today Was a Fairytale'] },
  { id: 'speaknow', name: 'Speak Now', accent: '#6b4e9e', dividers: { 15: 'From the Vault · Taylor’s Version', 21: 'Deluxe Edition' }, tracks: [
    'Mine', 'Sparks Fly', 'Back to December', 'Speak Now', 'Dear John', 'Mean', 'The Story of Us', 'Never Grow Up', 'Enchanted', 'Better than Revenge', 'Innocent', 'Haunted', 'Last Kiss', 'Long Live',
    'Electric Touch', 'When Emma Falls in Love', 'I Can See You', 'Castles Crumbling', 'Foolish One', 'Timeless',
    'Ours', 'If This Was a Movie', 'Superman'] },
  { id: 'red', name: 'Red', accent: '#a83a2c', dividers: { 17: 'From the Vault · Taylor’s Version', 26: 'Deluxe Edition' }, tracks: [
    'State of Grace', 'Red', 'Treacherous', 'I Knew You Were Trouble', 'All Too Well', '22', 'I Almost Do', 'We Are Never Ever Getting Back Together', 'Stay Stay Stay', 'The Last Time', 'Holy Ground', 'Sad Beautiful Tragic', 'The Lucky One', 'Everything Has Changed', 'Starlight', 'Begin Again',
    'Better Man', 'Nothing New', 'Babe', 'Message in a Bottle', 'I Bet You Think About Me', 'Forever Winter', 'Run', 'The Very First Night', 'All Too Well (10 Minute Version)',
    'The Moment I Knew', 'Come Back… Be Here', 'Girl at Home'] },
  { id: '1989', name: '1989', accent: '#3f7ba0', dividers: { 14: 'From the Vault · Taylor’s Version' }, tracks: [
    'Welcome to New York', 'Blank Space', 'Style', 'Out of the Woods', 'All You Had to Do Was Stay', 'Shake It Off', 'I Wish You Would', 'Bad Blood', 'Wildest Dreams', 'How You Get the Girl', 'This Love', 'I Know Places', 'Clean',
    '“Slut!”', 'Say Don’t Go', 'Now That We Don’t Talk', 'Suburban Legends', 'Is It Over Now?'] },
  { id: 'rep', name: 'reputation', accent: '#2a2a2a', tracks: [
    '…Ready for It?', 'End Game', 'I Did Something Bad', 'Don’t Blame Me', 'Delicate', 'Look What You Made Me Do', 'So It Goes…', 'Gorgeous', 'Getaway Car', 'King of My Heart', 'Dancing with Our Hands Tied', 'Dress', 'This Is Why We Can’t Have Nice Things', 'Call It What You Want', 'New Year’s Day'] },
  { id: 'lover', name: 'Lover', accent: '#a23a63', tracks: [
    'I Forgot That You Existed', 'Cruel Summer', 'Lover', 'The Man', 'The Archer', 'I Think He Knows', 'Miss Americana & the Heartbreak Prince', 'Paper Rings', 'Cornelia Street', 'Death by a Thousand Cuts', 'London Boy', 'Soon You’ll Get Better', 'False God', 'You Need to Calm Down', 'Afterglow', 'ME!', 'It’s Nice to Have a Friend', 'Daylight'] },
  { id: 'folklore', name: 'folklore', accent: '#5c6259', dividers: { 17: 'Bonus Track' }, tracks: [
    'the 1', 'cardigan', 'the last great american dynasty', 'exile', 'my tears ricochet', 'mirrorball', 'seven', 'august', 'this is me trying', 'illicit affairs', 'invisible string', 'mad woman', 'epiphany', 'betty', 'peace', 'hoax',
    'the lakes'] },
  { id: 'evermore', name: 'evermore', accent: '#a5552d', dividers: { 16: 'Bonus Tracks · Deluxe' }, tracks: [
    'willow', 'champagne problems', 'gold rush', '’tis the damn season', 'tolerate it', 'no body, no crime', 'happiness', 'dorothea', 'coney island', 'ivy', 'cowboy like me', 'long story short', 'marjorie', 'closure', 'evermore',
    'right where you left me', 'it’s time to go'] },
  { id: 'midnights', name: 'Midnights', accent: '#5a5b8c', dividers: { 14: '3am Edition', 21: 'The Late Night Edition' }, tracks: [
    'Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow on the Beach', 'You’re on Your Own, Kid', 'Midnight Rain', 'Question…?', 'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 'Sweet Nothing', 'Mastermind',
    'The Great War', 'Bigger Than the Whole Sky', 'Paris', 'High Infidelity', 'Glitch', 'Would’ve, Could’ve, Should’ve', 'Dear Reader',
    'You’re Losing Me'] },
  { id: 'ttpd', name: 'The Tortured Poets Department', accent: '#4a4a45', dividers: { 17: 'The Anthology' }, tracks: [
    'Fortnight', 'The Tortured Poets Department', 'My Boy Only Breaks His Favorite Toys', 'Down Bad', 'So Long, London', 'But Daddy I Love Him', 'Fresh Out the Slammer', 'Florida!!!', 'Guilty as Sin?', 'Who’s Afraid of Little Old Me?', 'I Can Fix Him (No Really I Can)', 'loml', 'I Can Do It with a Broken Heart', 'The Smallest Man Who Ever Lived', 'The Alchemy', 'Clara Bow',
    'The Black Dog', 'imgonnagetyouback', 'The Albatross', 'Chloe or Sam or Sophia or Marcus', 'How Did It End?', 'So High School', 'I Hate It Here', 'thanK you aIMee', 'I Look in People’s Windows', 'The Prophecy', 'Cassandra', 'Peter', 'The Bolter', 'Robin', 'The Manuscript'] },
  { id: 'showgirl', name: 'The Life of a Showgirl', accent: '#d15a2a', tracks: [
    'The Fate of Ophelia', 'Elizabeth Taylor', 'Opalite', 'Father Figure', 'Eldest Daughter', 'Ruin the Friendship', 'Actually Romantic', 'Wi$h Li$t', 'Wood', 'CANCELLED!', 'Honey', 'The Life of a Showgirl'] },
];

const SONGS = [];
ALBUMS.forEach((al) => al.tracks.forEach((title, i) => {
  SONGS.push({ id: al.id + '-' + (i + 1), albumId: al.id, album: al.name, accent: al.accent, track: 'Track ' + (i + 1), title });
}));

const PALETTE = [
  { name: 'red', hex: '#d1352b' }, { name: 'orange', hex: '#e07a2a' }, { name: 'gold', hex: '#e0b23a' },
  { name: 'green', hex: '#5b9c6a' }, { name: 'teal', hex: '#2fae8f' }, { name: 'sky', hex: '#5b9bd0' },
  { name: 'navy', hex: '#2c4670' }, { name: 'indigo', hex: '#6b4e9e' }, { name: 'lavender', hex: '#b79ad8' },
  { name: 'pink', hex: '#eaa9c4' }, { name: 'maroon', hex: '#7c1f26' }, { name: 'sepia', hex: '#a5824f' },
  { name: 'black', hex: '#2a2a2a' }, { name: 'silver', hex: '#c9ccd2' },
];

// Parse an inline CSS string into a React style object, so the original
// style strings from the artifact template carry over verbatim.
function css(str) {
  const o = {};
  if (!str) return o;
  str.split(';').forEach((part) => {
    const i = part.indexOf(':');
    if (i < 0) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (!k) return;
    const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[camel] = v;
  });
  return o;
}

export default class ListeningJournal extends React.Component {
  state = { view: 'library', activeAlbum: null, activeSong: null, colorFilter: null, entries: {} };

  componentDidMount() {
    try { const raw = localStorage.getItem(KEY); if (raw) this.setState({ entries: JSON.parse(raw) || {} }); } catch (e) {}
  }
  persist = () => { try { localStorage.setItem(KEY, JSON.stringify(this.state.entries)); } catch (e) {} };
  blank() { return { mood: '', songType: '', where: '', favLine: '', bridgeLine: '', relates: '', colors: [], overall: 0, replay: 0, bridgePower: 0 }; }
  entry(id) { return { ...this.blank(), ...(this.state.entries[id] || {}) }; }
  touched(e) { return !!(e.overall || e.replay || e.bridgePower || e.mood || e.songType || e.where || e.favLine || e.bridgeLine || e.relates || (e.colors && e.colors.length)); }

  setField(key, val) {
    const id = this.state.activeSong; if (!id) return;
    this.setState((s) => {
      const cur = { ...this.blank(), ...(s.entries[id] || {}) };
      cur[key] = val;
      return { entries: { ...s.entries, [id]: cur } };
    }, this.persist);
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
      const data = JSON.stringify(this.state.entries || {}, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
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
          if (parsed && typeof parsed === 'object') {
            const merged = { ...this.state.entries, ...parsed };
            this.setState({ entries: merged }, this.persist);
          }
        } catch (e) { try { window.alert('That file could not be read as a journal backup.'); } catch (e2) {} }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  goLibrary = () => this.setState({ view: 'library', activeAlbum: null, activeSong: null });
  goInsights = () => this.setState({ view: 'insights', activeAlbum: null, activeSong: null });
  openAlbum = (id) => this.setState({ view: 'album', activeAlbum: id, activeSong: null });
  backToAlbum = () => this.setState((s) => ({ view: 'album', activeSong: null, activeAlbum: s.activeAlbum || (s.activeSong ? s.activeSong.slice(0, s.activeSong.lastIndexOf('-')) : null) }));
  openSong = (id) => this.setState({ view: 'song', activeSong: id, activeAlbum: id.slice(0, id.lastIndexOf('-')) });
  pickColorFilter = (name) => this.setState((s) => ({ colorFilter: s.colorFilter === name ? null : name }));

  hexOf(name) { const p = PALETTE.find((x) => x.name === name); return p ? p.hex : '#ccc'; }
  starStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  renderVals() {
    const S = this.state;
    const tab = (on) => 'font-family:Quicksand,sans-serif; font-size:13px; font-weight:700; letter-spacing:0.5px; cursor:pointer; padding:8px 18px; border-radius:20px; border:1.5px solid ' +
      (on ? '#a23a63; background:#a23a63; color:#fff;' : '#e6c2d2; background:transparent; color:#a23a63;');

    const isLibrary = S.view === 'library';
    const isAlbum = S.view === 'album' && !!S.activeAlbum && !S.activeSong;
    const isInsights = S.view === 'insights';
    const isEditor = S.view === 'song' && !!S.activeSong;

    const vals = {
      goLibrary: this.goLibrary, goInsights: this.goInsights, backToAlbum: this.backToAlbum,
      exportJournal: this.exportJournal, importJournal: this.importJournal,
      iconBtnStyle: 'font-family:Quicksand,sans-serif; font-size:12px; font-weight:700; cursor:pointer; padding:8px 14px; border-radius:20px; border:1.5px solid #e6c2d2; background:transparent; color:#a23a63;',
      songsTabStyle: tab(S.view !== 'insights'),
      insightsTabStyle: tab(S.view === 'insights'),
      isLibrary, isAlbum, isInsights, isEditor,
    };

    const loggedCount = SONGS.filter((s) => this.touched(this.entry(s.id))).length;
    vals.librarySubtitle = loggedCount
      ? loggedCount + ' songs reflected on across the eras. Keep going, or check your Insights.'
      : 'Every studio era, every track. Open an era to start rating and coloring its songs.';

    // ---- album grid ----
    vals.albumCards = ALBUMS.map((al) => {
      const done = al.tracks.filter((t, i) => this.touched(this.entry(al.id + '-' + (i + 1)))).length;
      return {
        name: al.name, accent: al.accent, trackCount: al.tracks.length,
        progress: done ? done + ' / ' + al.tracks.length + ' done' : 'not started',
        progressColor: done ? al.accent : '#c9b3bd',
        open: () => this.openAlbum(al.id),
        cardStyle: 'background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; padding:18px 20px 16px; cursor:pointer; box-shadow:0 2px 0 rgba(122,41,71,0.04);',
      };
    });

    // ---- album track list ----
    if (isAlbum) {
      const al = ALBUMS.find((a) => a.id === S.activeAlbum);
      const dividers = al.dividers || {};
      const dividerLabels = Object.keys(dividers).sort((a, b) => a - b).map((k) => dividers[k]);
      const bonusNote = dividerLabels.length ? ' · with ' + dividerLabels.join(' + ') : '';
      vals.al = { name: al.name, accent: al.accent, subtitle: al.tracks.length + ' tracks' + bonusNote + ' · tap any song to reflect on it' };
      vals.albumHeaderStyle = 'border-bottom:2px solid ' + al.accent + '33; padding-bottom:16px; margin-bottom:22px;';
      vals.dividerStyle = 'padding:11px 18px; background:' + al.accent + '12; border-top:1px solid #f4e2ea; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + al.accent + ';';
      vals.albumTracks = al.tracks.map((title, i) => {
        const id = al.id + '-' + (i + 1);
        const e = this.entry(id);
        const divLabel = dividers[i + 1];
        return {
          num: i + 1, title, open: () => this.openSong(id),
          stars: this.starStr(e.overall),
          showDivider: !!divLabel,
          dividerLabel: divLabel || '',
          rowStyle: 'display:flex; align-items:center; gap:10px; padding:13px 18px; cursor:pointer; border-top:' + ((i && !divLabel) ? '1px solid #f4e2ea' : 'none') + ';',
          colorDots: e.colors.map((c) => ({ style: 'width:11px; height:11px; border-radius:50%; background:' + this.hexOf(c) + '; box-shadow:0 0 0 1px rgba(0,0,0,0.08);' })),
        };
      });
    }

    // ---- editor ----
    if (isEditor) {
      const meta = SONGS.find((s) => s.id === S.activeSong);
      const al = ALBUMS.find((a) => a.id === meta.albumId);
      const e = this.entry(S.activeSong);
      vals.e = { album: meta.album, title: meta.title, trackLabel: meta.track, accent: meta.accent };
      vals.v = e;
      vals.backLabel = '← ' + al.name;
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

    // ---- insights ----
    if (isInsights) {
      const chip = 'display:flex; flex-direction:column; gap:2px; background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:14px; padding:11px 16px; cursor:pointer; color:#3a2530;';
      const empty = 'font-size:13px; color:#b58ea0; background:#faf1f5; border:1.5px dashed #ecccd9; border-radius:14px; padding:16px 18px;';
      vals.emptyStyle = empty;

      const withEntry = SONGS.map((s) => ({ meta: s, e: this.entry(s.id) }));
      const openFor = (id) => () => this.openSong(id);

      const rated = withEntry.filter((x) => x.e.overall > 0);
      const avg = rated.length ? (rated.reduce((a, x) => a + x.e.overall, 0) / rated.length) : 0;
      const colorCounts = PALETTE.map((p) => ({ name: p.name, n: withEntry.filter((x) => x.e.colors.includes(p.name)).length }))
        .filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
      vals.statCards = [
        { value: loggedCount, label: 'Songs logged' },
        { value: withEntry.filter((x) => x.e.overall === 5).length, label: 'Five-star' },
        { value: rated.length ? avg.toFixed(1) : '–', label: 'Avg rating' },
        { value: colorCounts.length ? colorCounts[0].name : '–', label: 'Top color' },
      ];

      const five = withEntry.filter((x) => x.e.overall === 5);
      vals.hasFiveStar = five.length > 0; vals.noFiveStar = five.length === 0;
      vals.fiveStarSongs = five.map((x) => ({ title: x.meta.title, album: x.meta.album, open: openFor(x.meta.id),
        chipStyle: chip + 'border-left:4px solid ' + x.meta.accent + ';' }));

      const replay = withEntry.filter((x) => x.e.replay > 0).sort((a, b) => b.e.replay - a.e.replay).slice(0, 15);
      vals.hasReplay = replay.length > 0; vals.noReplay = replay.length === 0;
      vals.replayRank = replay.map((x, i) => ({
        rank: i + 1, title: x.meta.title, album: x.meta.album, open: openFor(x.meta.id),
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
        vals.hasColorResults = res.length > 0;
        vals.colorFilterEmpty = res.length === 0;
        vals.colorEmptyMsg = 'No songs colored ' + S.colorFilter + ' yet.';
        vals.colorResults = res.map((x) => ({ title: x.meta.title, album: x.meta.album, open: openFor(x.meta.id),
          chipStyle: chip + 'border-left:4px solid ' + this.hexOf(S.colorFilter) + ';' }));
      } else {
        vals.hasColorResults = false; vals.colorFilterEmpty = true; vals.colorResults = [];
        vals.colorEmptyMsg = 'Pick a color above to filter.';
      }

      const bridges = withEntry.filter((x) => x.e.bridgePower > 0).sort((a, b) => b.e.bridgePower - a.e.bridgePower).slice(0, 15);
      vals.hasBridge = bridges.length > 0; vals.noBridge = bridges.length === 0;
      vals.bridgeRank = bridges.map((x) => ({ title: x.meta.title, stars: this.starStr(x.e.bridgePower), open: openFor(x.meta.id),
        chipStyle: chip + 'border-left:4px solid #3f6d92;' }));
    }

    return vals;
  }

  render() {
    const vals = this.renderVals();
    return (
      <div className="jrnl-scroll" style={css("min-height:100%; background:#efe6ea; font-family:'Quicksand',sans-serif; color:#5b3a49;")}>

        {/* TOP BAR */}
        <div style={css('position:sticky; top:0; z-index:10; background:rgba(255,253,251,0.92); backdrop-filter:blur(6px); border-bottom:1.5px solid #f0d7e1; padding:16px 32px; display:flex; align-items:center; justify-content:space-between; gap:20px;')}>
          <div style={css('display:flex; align-items:baseline; gap:12px; cursor:pointer;')} onClick={vals.goLibrary}>
            <span style={css("font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:24px; color:#6b2440;")}>The Listening Journal</span>
            <span style={css('font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#c98aa4;')}>Swiftie Edition</span>
          </div>
          <div style={css('display:flex; align-items:center; gap:8px;')}>
            <button onClick={vals.goLibrary} style={css(vals.songsTabStyle)}>Eras</button>
            <button onClick={vals.goInsights} style={css(vals.insightsTabStyle)}>Insights</button>
            <span style={css('width:1px; height:22px; background:#f0d7e1; margin:0 4px;')}></span>
            <button onClick={vals.exportJournal} title="Download a backup of your journal" style={css(vals.iconBtnStyle)}>⇩ Back up</button>
            <button onClick={vals.importJournal} title="Restore a journal backup file" style={css(vals.iconBtnStyle)}>⇧ Restore</button>
          </div>
        </div>

        {/* LIBRARY: ALBUM GRID */}
        {vals.isLibrary && (
          <div style={css('max-width:1080px; margin:0 auto; padding:34px 32px 60px;')}>
            <div style={css('margin-bottom:6px; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c98aa4;')}>Your discography</div>
            <h1 style={css("margin:0 0 6px; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:40px; color:#6b2440;")}>Pick an era</h1>
            <div style={css('font-size:14.5px; color:#9a6a7c; margin-bottom:28px; max-width:640px;')}>{vals.librarySubtitle}</div>

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
            <button onClick={vals.goLibrary} style={css("background:none; border:none; cursor:pointer; font-family:'Quicksand',sans-serif; font-size:13px; font-weight:600; color:#a23a63; padding:6px 0; margin-bottom:16px;")}>← All eras</button>

            <div style={css(vals.albumHeaderStyle)}>
              <div style={css('font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:' + vals.al.accent + ';')}>The Era Of</div>
              <h1 style={css("margin:6px 0 0; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:44px; color:#3a2530; line-height:1.05;")}>{vals.al.name}</h1>
              <div style={css('font-size:13px; color:#9a6a7c; margin-top:8px;')}>{vals.al.subtitle}</div>
            </div>

            <div style={css('background:#fffdfb; border:1.5px solid #f0d7e1; border-radius:16px; overflow:hidden;')}>
              {vals.albumTracks.map((t, idx) => (
                <div key={idx}>
                  {t.showDivider && (
                    <div style={css(vals.dividerStyle)}>{t.dividerLabel}</div>
                  )}
                  <div onClick={t.open} style={css(t.rowStyle)}>
                    <span style={css('font-size:13px; font-weight:700; color:' + vals.al.accent + '; width:26px; flex:none;')}>{t.num}</span>
                    <span style={css('flex:1; font-weight:600; font-size:15.5px; color:#3a2530;')}>{t.title}</span>
                    <div style={css('display:flex; align-items:center; gap:5px; margin-right:12px;')}>
                      {t.colorDots.map((d, di) => (
                        <span key={di} style={css(d.style)}></span>
                      ))}
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
              <div style={css('display:flex; align-items:center; gap:12px; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + vals.e.accent + ';')}>
                <span>{vals.e.album}</span>
                <span style={css('width:5px; height:5px; border-radius:50%; background:' + vals.e.accent + '; opacity:0.6;')}></span>
                <span style={css('opacity:0.7;')}>{vals.e.trackLabel}</span>
              </div>
              <h1 style={css("margin:6px 0 0; font-family:'Playfair Display',serif; font-style:italic; font-weight:700; font-size:44px; color:#3a2530; line-height:1.05;")}>{vals.e.title}</h1>
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
                  {vals.editorPalette.map((p, idx) => (
                    <button key={idx} onClick={p.toggle} title={p.name} style={css(p.style)}></button>
                  ))}
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

            {/* bridge: line + power only */}
            <div style={css(vals.bridgeBoxStyle)}>
              <div style={css('display:flex; align-items:center; gap:8px; margin-bottom:12px;')}>
                <span style={css('font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3f6d92;')}>The Bridge</span>
                <span style={css('color:#8fb8d6;')}>✦</span>
              </div>
              <textarea value={vals.v.bridgeLine} onChange={vals.onBridge} rows={2} placeholder="what happens to you in the bridge?" style={css(vals.areaStyleBlue)}></textarea>
              <div style={css('display:flex; align-items:center; gap:10px; margin-top:16px;')}>
                <span style={css('font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#3f6d92;')}>Bridge power</span>
                <div style={css('display:flex; gap:3px;')}>
                  {vals.bridgeStars.map((s, idx) => (
                    <span key={idx} onClick={s.set} style={css(s.style)}>{s.glyph}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...css(vals.fieldBoxStyle), marginBottom: '22px' }}>
              <div style={css(vals.fieldLabelStyle)}>How this song relates to me</div>
              <textarea value={vals.v.relates} onChange={vals.onRelates} rows={4} placeholder="the biggest space — say everything…" style={css(vals.areaStyle)}></textarea>
            </div>

            {/* ratings strip: overall + replay only */}
            <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:18px;')}>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Overall</div>
                <div style={css('display:flex; gap:4px; margin-top:4px;')}>
                  {vals.overallStars.map((s, idx) => (
                    <span key={idx} onClick={s.set} style={css(s.style)}>{s.glyph}</span>
                  ))}
                </div>
              </div>
              <div style={css(vals.fieldBoxStyle)}>
                <div style={css(vals.fieldLabelStyle)}>Skip — Replay</div>
                <div style={css('display:flex; gap:8px; margin-top:8px; align-items:center;')}>
                  {vals.replayDots.map((d, idx) => (
                    <span key={idx} onClick={d.set} style={css(d.style)}></span>
                  ))}
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

            {/* FIVE STAR */}
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
              {vals.noFiveStar && (
                <div style={css(vals.emptyStyle)}>No 5-star songs yet — go rate a favorite.</div>
              )}
            </div>

            {/* REPLAYABILITY */}
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
                        {r.dots.map((d, di) => (
                          <span key={di} style={css(d.style)}></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {vals.noReplay && (
                <div style={css(vals.emptyStyle)}>Set some skip–replay scores to see this ranking.</div>
              )}
            </div>

            {/* BY COLOR */}
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
              {vals.colorFilterEmpty && (
                <div style={css(vals.emptyStyle)}>{vals.colorEmptyMsg}</div>
              )}
            </div>

            {/* BRIDGES */}
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
              {vals.noBridge && (
                <div style={css(vals.emptyStyle)}>Rate a few bridges to crown the best ones.</div>
              )}
            </div>

          </div>
        )}

      </div>
    );
  }
}
