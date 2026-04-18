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

1. **Create a GitHub repository** in the browser (empty repo, no template README if you already have one locally). Then connect and push:

   ```bash
   cd /Users/taylorbracy/female-athlete-lab
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

   Commit any local edits first (`git add` / `git commit`). If `origin` already exists, use `git remote set-url origin …` instead of `add`.

2. **Import on Vercel**: [vercel.com/new](https://vercel.com/new) → sign in with GitHub → **Import** your repository.

3. **Set the app folder**: Before you deploy, open **Configure Project** and set **Root Directory** to **`site`** (the folder that contains `package.json`). Vercel will auto-detect **Vite** and build `dist/`. If you already created the project, go to **Settings → General → Root Directory** → **`site`** → save, then **Deployments → Redeploy**.

4. **Deploy** and open the **`*.vercel.app`** URL. Later pushes to `main` redeploy automatically.

### Content

- The live page is **`site/src/HomePage.tsx`**: header plus **Pillars** and an empty **Articles** counter. There is no article body, no journal grid, and no ankle-sprains route in the app.
- After you change code, **commit and `git push`** so Vercel rebuilds. If production still looks old, open **Deployments → Redeploy** and hard-refresh the browser (**Cmd+Shift+R**).
