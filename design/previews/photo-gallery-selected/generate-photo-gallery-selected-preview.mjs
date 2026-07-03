import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(root, "photo-gallery-selected-site-preview.html");
const outputDir = path.join(root, "png");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1180, height: 1240 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlPath).href);
await page.waitForLoadState("networkidle");
await page.waitForFunction(() =>
  Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
);
await page.evaluate(() => document.fonts.ready);

await page.screenshot({
  path: path.join(outputDir, "photo-gallery-selected-site-preview.png"),
  fullPage: true,
});

const photoSection = page.locator(".photo-section");
await photoSection.screenshot({
  path: path.join(outputDir, "photo-gallery-selected-block.png"),
});

await browser.close();
