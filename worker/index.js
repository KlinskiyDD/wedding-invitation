/* global Response, URL, URLSearchParams, TextEncoder, TextDecoder, crypto, atob, btoa, fetch */

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";

const requiredFields = [
  "guestName",
  "attendance",
  "foodPreference",
  "drinkPreference",
  "foodRestrictions",
];

const textLimits = {
  guestName: 120,
  attendance: 80,
  foodPreference: 120,
  drinkPreference: 120,
  foodRestrictions: 500,
};

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

function requireEnv(env, key) {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

function decodeBase64Utf8(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(value) {
  const bytes =
    typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function getServiceAccount(env) {
  const encodedJson = requireEnv(env, "GOOGLE_SERVICE_ACCOUNT_JSON_B64");
  const credentials = JSON.parse(decodeBase64Utf8(encodedJson));

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Google service account JSON is missing required fields");
  }

  return credentials;
}

async function signJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encodeBase64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: sheetsScope,
      aud: googleTokenUrl,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsignedJwt = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedJwt),
  );

  return `${unsignedJwt}.${encodeBase64Url(signature)}`;
}

async function getGoogleAccessToken(env) {
  const serviceAccount = getServiceAccount(env);
  const assertion = await signJwt(serviceAccount);
  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const body = await response.json();

  if (!body.access_token) {
    throw new Error("Google token response did not include access_token");
  }

  return body.access_token;
}

function readTextField(payload, key) {
  const rawValue = payload[key];
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  const maxLength = textLimits[key] ?? 200;

  return value.slice(0, maxLength);
}

async function parseRsvpPayload(request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      status: 415,
      error: "Форма отправлена в неподдерживаемом формате.",
    };
  }

  const payload = await request.json();
  const form = Object.fromEntries(
    requiredFields.map((key) => [key, readTextField(payload, key)]),
  );

  if (!form.guestName) {
    return {
      ok: false,
      status: 400,
      error: "Пожалуйста, укажите имя и фамилию.",
    };
  }

  return { ok: true, form };
}

function getSubmittedAt() {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function appendRsvpToSheet(env, form) {
  const spreadsheetId = requireEnv(env, "GOOGLE_SHEETS_SPREADSHEET_ID");
  const sheetName = requireEnv(env, "GOOGLE_SHEETS_SHEET_NAME");
  const token = await getGoogleAccessToken(env);
  const range = encodeURIComponent(`'${sheetName}'!A7:F`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=OVERWRITE`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            getSubmittedAt(),
            form.guestName,
            form.attendance,
            form.foodPreference,
            form.drinkPreference,
            form.foodRestrictions,
          ],
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Sheets append failed: ${response.status}`);
  }

  return response.json();
}

async function handleRsvp(request, env) {
  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, error: "Метод не поддерживается." },
      { status: 405, headers: { allow: "POST" } },
    );
  }

  const parsed = await parseRsvpPayload(request);

  if (!parsed.ok) {
    return jsonResponse({ ok: false, error: parsed.error }, { status: parsed.status });
  }

  await appendRsvpToSheet(env, parsed.form);

  return jsonResponse({
    ok: true,
    message: "Спасибо! Ваш ответ сохранён.",
  });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp") {
      try {
        return await handleRsvp(request, env);
      } catch (error) {
        console.error(error);
        return jsonResponse(
          {
            ok: false,
            error: "Не получилось сохранить ответ. Попробуйте отправить форму ещё раз.",
          },
          { status: 500 },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
