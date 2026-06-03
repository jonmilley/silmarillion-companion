# A Companion to The Silmarillion

A reader's companion to J.R.R. Tolkien's *The Silmarillion* — a chapter-by-chapter
tracker, who's-who, lexicon, First-Age timeline, family trees, a schematic map of
Beleriand, and a pronunciation guide. It is a pure static web app: no build step, no
server, no accounts. All reading state lives in your own browser.

## Features

- **Chapter tracker** — tap chapters as you read; progress is saved locally.
- **Per-chapter notes** — jot a thought on any chapter; saved alongside your progress.
- **Search** — one box searches names, places, chapters, lexicon, timeline, and
  pronunciations, and jumps you straight to the entry. (Arrow keys + Enter work too.)
- **Resumes where you left off** — reopens on your last tab.
- **Export / Import** — save your progress and notes to a `.json` file and restore it
  on another device or browser.
- **Installable PWA** — add it to a phone or desktop home screen and use it fully
  offline.
- **Print / Save as PDF** — the **Print** button (or your browser's print) renders the
  current tab as a clean, light, ink-friendly page. Handy for a printed family-tree or
  lexicon cheat-sheet. Print any tab; only the one you're viewing is included.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup and page structure |
| `styles.css` | All styling |
| `data.js` | All content (chapters, characters, lexicon, timeline, trees, map) — edit text here |
| `app.js` | Rendering, persistence, search, export/import, PWA wiring |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA: install + offline support |
| `tools/generate-icons.js` | Regenerates the app icons (`node tools/generate-icons.js`) |
| `archive/` | The original single-file version, kept for reference |

To change any wording, edit `data.js` — you shouldn't need to touch the rendering code.

## Running locally

A service worker and `localStorage` need a real HTTP origin, so open it through a
local server rather than `file://`:

```bash
# any one of these, from this folder:
python3 -m http.server 8000
npx serve .
```

Then visit <http://localhost:8000>.

## Deploying (pick one — all free)

It's static files, so any static host works.

**GitHub Pages**
```bash
git init && git add -A && git commit -m "Silmarillion Companion"
gh repo create silmarillion-companion --public --source=. --push
# then in the repo: Settings → Pages → Branch: main / root
```

**Netlify** — drag this folder onto <https://app.netlify.com/drop>, or
`npx netlify-cli deploy --prod`.

**Cloudflare Pages / Vercel** — connect the repo, or use `npx wrangler pages deploy .`
(Cloudflare) / `npx vercel --prod` (Vercel). No build command; output directory is `.`.

> Serve over HTTPS (all the above do) so the PWA install and offline features work.

## Updating content after deploy

The service worker caches assets. When you change a file, bump the `CACHE` version in
`sw.js` (e.g. `silmarillion-v1` → `silmarillion-v2`) so returning visitors get the
update on their next load.
