const corsMaxAgeSeconds = "86400";

export function parseAllowedOrigins(value) {
  if (typeof value !== "string") {
    return new Set();
  }

  return new Set(
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

export function isOriginAllowed(request, configuredOrigins) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  if (origin === new URL(request.url).origin) {
    return true;
  }

  return parseAllowedOrigins(configuredOrigins).has(origin);
}

function appendVaryOrigin(headers) {
  const varyValues = (headers.get("vary") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!varyValues.some((value) => value.toLowerCase() === "origin")) {
    varyValues.push("Origin");
  }

  headers.set("vary", varyValues.join(", "));
}

export function withCorsHeaders(response, request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  appendVaryOrigin(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createCorsPreflightResponse(request) {
  const response = new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-headers": "Content-Type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-max-age": corsMaxAgeSeconds,
    },
  });

  return withCorsHeaders(response, request);
}
