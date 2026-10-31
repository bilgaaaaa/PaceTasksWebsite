# PaceTasks website

The public website for [PaceTasks](https://github.com/bilgaaaaa/pacetasks), the task app for iPhone that fits
your tasks around your work. Live at **https://bilgaaaaa.github.io/PaceTasksWebsite/**.

The app and its App Store listing link here: the landing page is the marketing URL, `privacy.html` the
privacy policy URL and `support.html` the support URL. The app keeps these addresses in `src/lib/links.ts`.

## Files

Plain HTML, CSS and JavaScript in the app's Sage theme, light and dark, with the app's brand colours (Daffodil,
Pool Time, Poppy Fields, Peaches, Baby Lavender) giving each feature its own colour. No build step and no outside
requests. Every animation starts from the page's resting state: with reduced motion switched on, or in a browser
without scroll-linked animations, the page simply shows its finished state.

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `privacy.html` | Privacy policy |
| `support.html` | Help and support |
| `site.css` | Shared look: the app's colours, its brand palette and system type |
| `site.js` | Every page: turns the header into a frosted bar once the page scrolls |
| `home.js` | Landing page: the demo inside the hero phone, the tilting phone fan, the pinned phone that follows the features, Brain Dump typing itself, a working Fit my time with its time lane, the start time and reminder picker, the Pace heatmap and the colour themes on the closing card |
| `screens/` | Screenshots of the web demo, one per feature (`add-task-time` is the start time and reminder) |
| `og-image.png` | Link preview (1200×630): the hero card with the Today screen |
| `icon.png`, `grain.png` | App icon, and the grain texture the app lays over its hero card |

## Publishing

`.github/workflows/deploy.yml` copies these pages, builds the app's [web demo](https://github.com/bilgaaaaa/pacetasks#web-demo)
from `bilgaaaaa/pacetasks` into `demo/`, and deploys both to GitHub Pages. It runs on every push to `main`, by
hand (**Actions → Deploy → Run workflow**) and once a day, so the demo follows the app's `main` branch. Pull
requests only build the site.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The demo is built for the site's own path (`/PaceTasksWebsite/demo/`, or `/demo/` once a custom domain is set),
which the app's `app.config.js` reads from `WEB_BASE_URL`. The app needs bilgaaaaa/pacetasks#32 for this: without
it the demo's scripts load from the domain root and the demo stays blank.

## Editing

- **Preview locally:** `python3 -m http.server 4173`, then open http://localhost:4173. Only the deployed site has
  the demo.
- **New screenshots after a UI change:** in the app repository, run
  `npm run site:screens -- ../PaceTasksWebsite/screens` (with both repositories cloned side by side).
- **When the app is live:** replace "Coming soon to iPhone" in `index.html` with the App Store link.
- **When what the app stores changes** (a new table, an AI provider, analytics), update `privacy.html` before that
  version of the app is released.
- **Keep the two policies in step:** the app repository still has its own `docs/privacy.html` and
  `docs/support.html`. Until the app links here, change both together.
