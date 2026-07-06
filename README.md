# wedding-invitation

Static Next.js wedding invitation site deployed to Cloudflare with a small Worker
endpoint for RSVP submissions.

## Project Structure

```text
app/              Next.js App Router entrypoints and global styles
components/       Page sections for the invitation
content/          Editable wedding content
public/images/    Project image assets
tests/e2e/        Playwright smoke tests
worker/           Cloudflare Worker API for RSVP submissions
wrangler.jsonc    Cloudflare Worker and static assets deployment config
```

## Development

```bash
npm install
npm run dev
```

Local dev server: `http://localhost:3000`.

Edit wedding-specific text in `content/wedding.ts`. Current values are placeholders and should be replaced with the real date, place, RSVP link, schedule, and FAQ copy.

For the full Cloudflare flow, including `/api/rsvp`, run:

```bash
npx wrangler dev --local --port 8787
```

Full local site with RSVP API: `http://127.0.0.1:8787`.

## Checks

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run build
npx wrangler deploy --dry-run
```

`npm run build` uses `output: "export"` and writes static files to `out/`.

## RSVP Storage

RSVP responses are saved to Google Sheets through `POST /api/rsvp` in
`worker/index.js`. Local development needs `.dev.vars` with
`GOOGLE_SERVICE_ACCOUNT_JSON_B64`; production should use a Cloudflare secret
with the same name.

## Cloudflare

The current deployment path is `npx wrangler deploy`.

Wrangler runs `npm run build` from `wrangler.jsonc`, serves static assets from
`./out`, and handles Worker routes such as `/api/rsvp`.

Avoid adding Next.js features that require a Next.js server in the current
setup, including Server Actions, request-dependent route handlers,
middleware/proxy, ISR, or default runtime image optimization. Server-side
behavior should live in the Cloudflare Worker.
