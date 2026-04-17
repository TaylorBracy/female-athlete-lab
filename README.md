# The Female Athlete Lab

Double-click **`Open Live Website.command`** to install dependencies if needed, start the Vite dev server on **this Mac only** (`127.0.0.1:5173`), and open the site. Edit **`site/src/App.tsx`** (and other files under **`site/src`**); saves refresh in the browser.

From Terminal:

```bash
cd /Users/taylorbracy/female-athlete-lab/site
npm install   # first time only
npm run dev -- --host 127.0.0.1
```

Production build: `cd site && npm run build` (output in `site/dist`).

### Adding articles (private)

- While **`npm run dev`** is running, a **Draft workspace** panel appears in the sidebar: title, one or more **pillars** (Performance / Rehab / Data / Women’s Sports—toggle as many as apply; at least one stays on), optional **Google Doc** URL. Dragging cards onto the **Articles** counter is only enabled in that mode.
- **Pillars** in the white card are a multi-select filter for **Latest articles**: any selected pillar matches an article if that article is tagged with **any** of them (OR). Use **Clear pillar filters** to show everything again.
- **`npm run build`** / the public site **does not** show the draft UI unless you set the env flag below.
- Optional: **`site/.env.local`** with `VITE_ENABLE_LOCAL_ARTICLE_EDITOR=true` — see **`site/.env.example`**.
