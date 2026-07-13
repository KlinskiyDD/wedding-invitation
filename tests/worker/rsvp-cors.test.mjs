import assert from "node:assert/strict";
import test from "node:test";

import {
  createCorsPreflightResponse,
  isOriginAllowed,
  parseAllowedOrigins,
  withCorsHeaders,
} from "../../worker/cors.mjs";

const workerUrl = "https://wedding-invitation.skull2932.workers.dev/api/rsvp";
const pagesOrigin = "https://klinskiydd.github.io";

function createRequest({ method = "POST", origin } = {}) {
  const headers = new Headers();

  if (origin) {
    headers.set("origin", origin);
  }

  return new Request(workerUrl, { method, headers });
}

test("parses a comma-separated origin allowlist", () => {
  assert.deepEqual(
    [...parseAllowedOrigins(` ${pagesOrigin}, https://example.com, `)],
    [pagesOrigin, "https://example.com"],
  );
});

test("allows the configured Pages origin", () => {
  const request = createRequest({ origin: pagesOrigin });

  assert.equal(isOriginAllowed(request, pagesOrigin), true);
});

test("allows same-origin and origin-less requests", () => {
  assert.equal(
    isOriginAllowed(
      createRequest({ origin: "https://wedding-invitation.skull2932.workers.dev" }),
      pagesOrigin,
    ),
    true,
  );
  assert.equal(isOriginAllowed(createRequest(), pagesOrigin), true);
});

test("rejects an origin outside the allowlist", () => {
  const request = createRequest({ origin: "https://example.net" });

  assert.equal(isOriginAllowed(request, pagesOrigin), false);
});

test("builds a readable preflight response for GitHub Pages", () => {
  const request = createRequest({ method: "OPTIONS", origin: pagesOrigin });
  const response = createCorsPreflightResponse(request);

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), pagesOrigin);
  assert.equal(
    response.headers.get("access-control-allow-methods"),
    "POST, OPTIONS",
  );
  assert.equal(
    response.headers.get("access-control-allow-headers"),
    "Content-Type",
  );
  assert.equal(response.headers.get("access-control-max-age"), "86400");
  assert.equal(response.headers.get("vary"), "Origin");
  assert.notEqual(response.headers.get("access-control-allow-origin"), "*");
});

test("adds CORS to error responses without overwriting existing Vary values", () => {
  const request = createRequest({ origin: pagesOrigin });
  const response = withCorsHeaders(
    new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: {
        "content-type": "application/json",
        vary: "Accept-Encoding",
      },
    }),
    request,
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("access-control-allow-origin"), pagesOrigin);
  assert.equal(response.headers.get("vary"), "Accept-Encoding, Origin");
});

test("does not add cross-origin headers when Origin is absent", () => {
  const response = withCorsHeaders(new Response(null, { status: 204 }), createRequest());

  assert.equal(response.headers.has("access-control-allow-origin"), false);
  assert.equal(response.headers.has("vary"), false);
});
