# wedding-invitation

Static Next.js wedding invitation site deployed to Cloudflare with Wrangler static assets.

## Project Structure

```text
app/              Next.js App Router entrypoints and global styles
components/       Page sections for the invitation
content/          Editable wedding content
public/images/    Project image assets
tests/e2e/        Playwright smoke tests
wrangler.jsonc    Cloudflare static assets deployment config
```

## Development

```bash
npm install
npm run dev
```

Local dev server: `http://localhost:3000`.

Edit wedding-specific text in `content/wedding.ts`. Current values are placeholders and should be replaced with the real date, place, RSVP link, schedule, and FAQ copy.

## Checks

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run build
npx wrangler deploy --dry-run
```

`npm run build` uses `output: "export"` and writes static files to `out/`.

## Cloudflare

The current deployment path is `npx wrangler deploy`.

Wrangler runs `npm run build` from `wrangler.jsonc` and publishes static assets from `./out`. Keep this project static unless the deployment strategy is changed deliberately.

Avoid adding Next.js features that require a server in the current setup, including Server Actions, request-dependent route handlers, middleware/proxy, ISR, or default runtime image optimization.
