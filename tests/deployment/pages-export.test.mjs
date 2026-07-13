import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const outputDirectory = path.resolve("out");
const expectedBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const expectedRsvpApiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);

      return entry.isDirectory() ? listFiles(entryPath) : entryPath;
    }),
  );

  return files.flat();
}

test("Pages export contains prefixed routes, assets, calendars, and RSVP endpoint", async () => {
  assert.equal(expectedBasePath, "/wedding-invitation");
  assert.match(expectedRsvpApiUrl ?? "", /^https:\/\/[^/]+\/api\/rsvp$/);

  const requiredFiles = [
    "index.html",
    "banquet.html",
    "404.html",
    "calendar/dmitriy-marina-wedding.ics",
    "calendar/dmitriy-marina-wedding-banquet.ics",
  ];

  for (const file of requiredFiles) {
    await assert.doesNotReject(readFile(path.join(outputDirectory, file)));
  }

  const files = await listFiles(outputDirectory);
  const htmlFiles = files.filter((file) => path.extname(file) === ".html");
  const cssFiles = files.filter((file) => path.extname(file) === ".css");
  const searchableFiles = files.filter((file) =>
    [".html", ".css", ".js", ".txt"].includes(path.extname(file)),
  );

  const html = (await Promise.all(htmlFiles.map((file) => readFile(file, "utf8")))).join(
    "\n",
  );
  const css = (await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))).join(
    "\n",
  );
  const searchableOutput = (
    await Promise.all(searchableFiles.map((file) => readFile(file, "utf8")))
  ).join("\n");

  assert.match(html, /(?:src|href)="\/wedding-invitation\/_next\//);
  assert.match(html, /(?:src|href)="\/wedding-invitation\/images\//);
  assert.match(html, /href="\/wedding-invitation\/calendar\//);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:_next|images|calendar)\//);
  assert.doesNotMatch(css, /url\(["']?\/(?:_next|images|calendar)\//);
  assert.ok(searchableOutput.includes(expectedRsvpApiUrl));
});
