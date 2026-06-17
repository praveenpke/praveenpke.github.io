# praveenpke.github.io

Personal site for **Praveen Emani** — Senior Software Engineer · Agentic AI · MLOps.

Built with vanilla HTML/CSS/JS, no build step. Hosted on GitHub Pages.

## Structure

```
index.html              Landing (no-scroll): name, role, two CTAs, photo
work.html               Experience timeline, skills, education & certifications
projects.html           Open-source project cards
blog.html               Writing — article cards
posts/*.html            Individual posts (share the same design system)
posts/template.html     Starter for new posts
assets/style.css        Shared design system (one source of truth; root-relative)
assets/main.js          Reveal-on-scroll
robots.txt, sitemap.xml SEO / crawl layer
```

## Design

Multi-page black/white portfolio (implemented from a Claude Design handoff). Dark landing &
projects pages, light work & writing pages — driven by a `body.dark` / `body.light` class that
flips the CSS variables in `assets/style.css`. Typeface: **Geist** + **Geist Mono**. Hairline
rules and cards over chrome. Accessible: skip links, visible focus rings, `prefers-reduced-motion`
honored (reveal animations disabled).

## Adding a post

1. Copy `posts/template.html` to `posts/<slug>.html`.
2. Fill in `<title>`, meta description, canonical/OG URLs, kicker, `<h1>`, date, and body.
3. Add a row to the Writing lists in `index.html` and `blog.html`, and a `<url>` to `sitemap.xml`.

## Local preview

```
python -m http.server 8000
# open http://localhost:8000
```
