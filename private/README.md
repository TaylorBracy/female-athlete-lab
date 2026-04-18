# Private folder

Files here are **for your machine only**. The folder is **not** tracked in git and **not** deployed to Vercel.

Use it for a personal PDF copy of an article, exports, or drafts. The live site does **not** host downloadable article files—readers use the website.

To generate a local PDF (after dependencies from earlier setup):

```bash
python3 site/scripts/rebuild-ankle-paper-pdf.py
```

Output path: `private/papers/ankle-sprains-female-athletes-soccer-vs-basketball.pdf`

**Reality check:** Anyone can still copy text, screenshot, or use the browser’s Print / Save as PDF on the public article page. This setup removes **hosted file downloads** and keeps your **editable PDF** off the internet and out of the git repo.
