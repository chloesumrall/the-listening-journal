# The Listening Journal

A Taylor Swift discography listening journal. Browse every era, open a song, and
reflect on it — mood, song type, the colors it paints, favorite line, the bridge,
and how it relates to you — plus star ratings and a skip↔replay score. An Insights
view surfaces your five-star songs, most replayable tracks, songs by color, and
strongest bridges. Everything saves to your browser automatically, with JSON
backup/restore.

This is a standard Vite + React project, rebuilt from the original Claude artifact
so it can live in a git repo and deploy continuously.

## Run it locally

```bash
npm install
npm run dev      # start the dev server (hot reload) at the printed localhost URL
```

## Build for production

```bash
npm run build    # outputs static files to dist/
npm run preview  # preview the production build locally
```

## Deploy to Netlify

The repo includes `netlify.toml`, so Netlify needs no manual config.

**Recommended — continuous deploy from Git:**
1. Push this project to a GitHub repo.
2. In Netlify: Add new site → Import an existing project → pick the repo.
3. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`). Deploy.
4. Every `git push` now auto-publishes. In your existing site, you can point
   `thelisteningjournal.netlify.app` at this repo under
   Site configuration → Build & deploy.

**Or — drag-and-drop:** run `npm run build` and drag the `dist/` folder into the
Netlify dashboard.

## Project structure

```
index.html               # entry; loads Google Fonts (Playfair Display + Quicksand)
netlify.toml             # build + SPA redirect config
src/
  main.jsx               # React entry point
  ListeningJournal.jsx   # the whole app: data, state, views
  styles.css             # global base styles
```

## Where things live in the code

All in `src/ListeningJournal.jsx`:

- `ALBUMS` — the 12 eras. Each has an `id`, display `name`, `accent` color, a
  `tracks` array (studio + vault + deluxe tracks), and optional `dividers`
  ({ trackNumber: 'Label' }) that print a section header in the track list.
  **Add a song** by adding a string to `tracks`; **add a divider** by adding an
  entry to `dividers`.
- `PALETTE` — the 14 song colors (name + hex).
- `KEY` — the localStorage key (`swiftie-listening-journal-v1`). Saved entries are
  keyed by `<albumId>-<trackNumber>`.
- `renderVals()` — computes everything the views display.
- `render()` — the four views: library (era grid), album (track list), song
  editor, and insights.

## Notes

- Entries are stored only in the visitor's browser (localStorage). Use **Back up**
  to download a JSON file and **Restore** to load one — handy across devices.
- Fonts load from Google Fonts. The original artifact embedded them; this version
  links them for a smaller repo.
