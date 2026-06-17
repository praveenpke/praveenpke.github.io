# praveenpke.github.io

Personal site for **Praveen Emani** — Senior Software Engineer · Agentic AI · MLOps.

Built with vanilla HTML/CSS/JS, no build step. Hosted on GitHub Pages.

## Structure

```
index.html              Single-page hub (hero, about, experience, work, skills, writing, contact)
blog.html               Writing archive
posts/*.html            Individual posts (share the same design system)
posts/template.html     Starter for new posts
assets/style.css        Shared design system (one source of truth; root-relative)
assets/main.js          Theme toggle, mobile nav, scroll-spy
robots.txt, sitemap.xml SEO / crawl layer
```

## Design

Monochrome (light + hand-tuned dark theme via `prefers-color-scheme` + toggle persisted in
`localStorage`), system font stack (no web fonts → zero render-blocking, no CLS), hairline
rules instead of cards. Accessible: skip link, landmarks, visible focus rings,
`prefers-reduced-motion` honored. All design tokens live in `:root` in `assets/style.css`.

## Adding a post

1. Copy `posts/template.html` to `posts/<slug>.html`.
2. Fill in `<title>`, meta description, canonical/OG URLs, kicker, `<h1>`, date, and body.
3. Add a row to the Writing lists in `index.html` and `blog.html`, and a `<url>` to `sitemap.xml`.

## Local preview

```
python -m http.server 8000
# open http://localhost:8000
```
