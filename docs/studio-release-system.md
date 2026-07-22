# Assets Studio Release System

Studio Mode stays on for the Lingo Assets library. Asset drops must feel cinematic, premium, and production-ready even when the site stays fully static and free-tier.

## Release stages

1. **Staging** — every asset-library change starts in a pull request or preview deployment.
2. **QA Review** — validate links, metadata, routing files, JSON config, asset paths, and mobile layout.
3. **Studio Review** — confirm Industrial Noir lighting, vault visuals, typography, card layout, and request-builder polish.
4. **Production Deployment** — merge only after validation and review pass.
5. **Monitoring** — watch Vercel Web Analytics, Speed Insights, deployment health, and reported asset-routing issues.
6. **Iteration** — fixes return to staging, pass QA and Studio Review, then ship.

## Required release gate

Run a static smoke audit before merge. The gate must check JSON config, sitemap URLs, local links/assets, anchor targets, inline script syntax, page titles, and meta descriptions.

## Assets QA checklist

- Homepage includes canonical metadata, social metadata, Web Analytics, and Speed Insights scripts.
- `404.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, and `vercel.json` are present.
- Canonical, Open Graph, robots, and sitemap URLs match the active production domain.
- Asset request buttons work without backend credentials.
- No secret, API token, or credential appears in static HTML.
- Mobile and desktop preserve the Industrial Noir asset-vault visual system.

## 48-hour post-launch cycle

- Check pageviews, LCP, CLS, INP, and FCP after production deploy.
- Log any visual, asset-link, interaction, or performance issue against the Assets world.
- Fix in staging, validate again, review mobile and Studio polish, then redeploy.
