# PaceTasks website

The PaceTasks website now lives with DeskFocus, which is sold together with it:
**https://bilgaaaaa.github.io/pacetasks/** (source in [`bilgaaaaa/pacetasks`](https://github.com/bilgaaaaa/pacetasks),
folder `docs/`).

This repository keeps two things running at **https://bilgaaaaa.github.io/PaceTasksWebsite/**:

| Path | Purpose |
| --- | --- |
| `demo/` | The PaceTasks [web demo](https://github.com/bilgaaaaa/pacetasks#web-demo), which the new site's "Try PaceTasks in your browser" opens |
| `index.html`, `privacy.html`, `support.html` | Send visitors of the old addresses to the same pages on the new site |

## Publishing

`.github/workflows/deploy.yml` copies these pages, builds the web demo from `bilgaaaaa/pacetasks` into `demo/`,
and deploys both to GitHub Pages. It runs on every push to `main`, by hand (**Actions → Deploy → Run workflow**)
and once a day, so the demo follows the app's `main` branch. Pull requests only build the site.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The demo is built for the site's own path (`/PaceTasksWebsite/demo/`, or `/demo/` once a custom domain is set),
which the app's `app.config.js` reads from `WEB_BASE_URL`. If the demo ever moves, update the two demo links in the
app repository's `docs/index.html`.
