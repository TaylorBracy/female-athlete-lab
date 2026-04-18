# The Female Athlete Lab

Double-click **`Open Live Website.command`** to install dependencies if needed, start the Vite dev server on **this Mac only** (`127.0.0.1:5173`), and open the site. Edit **`site/src/App.tsx`** (and other files under **`site/src`**); saves refresh in the browser.

From Terminal:

```bash
cd /Users/taylorbracy/female-athlete-lab/site
npm install   # first time only
npm run dev -- --host 127.0.0.1
```

Production build: `cd site && npm run build` (output in `site/dist`).

### Deploy for free (GitHub + Vercel)

The site is a static Vite build. Vercel’s **Hobby** tier is free for personal projects and works well with this repo.

1. **Push to GitHub** (one-time; use a new empty repo name, e.g. `female-athlete-lab`):

   ```bash
   cd /Users/taylorbracy/female-athlete-lab
   git add -A && git status
   git commit -m "Prepare Vercel deploy"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

   If `origin` already exists, use `git remote set-url origin …` instead of `add`.

2. **Import on Vercel**: [vercel.com/new](https://vercel.com/new) → sign in with GitHub → **Import** your repository. Leave **Root Directory** blank (the repo includes `vercel.json` at the top level so builds run inside `site/` automatically).

3. **Deploy**: Vercel runs `npm install` and `npm run build` under `site/`, publishes `site/dist`, and gives you a `*.vercel.app` URL. Later pushes to `main` redeploy automatically.

### Content

- Article titles and metadata live in **`site/src/App.tsx`** (`INITIAL_ARTICLES` and related UI). Adjust there and rebuild for production.
- **Pillars** in the sidebar are a multi-select filter for **Latest articles**: any selected pillar matches an article if that article is tagged with **any** of them (OR). Use **Clear pillar filters** to show everything again.
