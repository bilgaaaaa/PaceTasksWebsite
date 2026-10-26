# PaceTasks website

The public website for [PaceTasks](https://github.com/bilgaaaaa/pacetasks), the task app for iPhone that fits
your tasks around your work. Live at **https://bilgaaaaa.github.io/PaceTasksWebsite/**.

The app and its App Store listing link here: the landing page is the marketing URL, `privacy.html` the
privacy policy URL and `support.html` the support URL. The app keeps these addresses in `src/lib/links.ts`.

## Files

Plain HTML, CSS and a few lines of JavaScript in the app's Sage theme, light and dark, with no build step.

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `privacy.html` | Privacy policy |
| `support.html` | Help and support |
| `site.css` | Shared look: the app's colours and system type |
| `site.js` | Starts the demo inside the hero phone on wide screens |
| `screens/` | Screenshots of the web demo |
| `og-image.png` | Link preview (1200×630): the hero card with the Today screen |
| `icon.png`, `grain.png` | App icon, and the grain texture the app lays over its hero card |

## Publishing

`.github/workflows/deploy.yml` copies these pages, builds the app's [web demo](https://github.com/bilgaaaaa/pacetasks#web-demo)
from `bilgaaaaa/pacetasks` into `demo/`, and deploys both to GitHub Pages. It runs on every push to `main`, by
hand (**Actions → Deploy → Run workflow**) and once a day, so the demo follows the app's `main` branch. Pull
requests only build the site.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The demo is built for the site's own path (`/PaceTasksWebsite/demo/`, or `/demo/` once a custom domain is set),
which the app's `app.config.js` reads from `WEB_BASE_URL`.

## Editing

- **Preview locally:** `python3 -m http.server 4173`, then open http://localhost:4173. Only the deployed site has
  the demo.
- **New screenshots after a UI change:** in the app repository, run
  `npm run site:screens -- ../PaceTasksWebsite/screens` (with both repositories cloned side by side).
- **When the app is live:** replace "Coming soon to iPhone" in `index.html` with the App Store link.
- **Still to confirm:** name the email service that sends sign-in codes in `privacy.html` (search for
  `TO CONFIRM`).
- **When what the app stores changes** (a new table, an AI provider, analytics), update `privacy.html` before that
  version of the app is released.
