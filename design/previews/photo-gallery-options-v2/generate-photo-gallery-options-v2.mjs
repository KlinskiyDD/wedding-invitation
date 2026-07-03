import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(root, "photo-gallery-options-v2.html");
const outputDir = path.join(root, "png");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1160, height: 2400 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlPath).href);
await page.waitForLoadState("networkidle");
await page.waitForFunction(() =>
  Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
);
await page.evaluate(() => document.fonts.ready);

for (let index = 11; index <= 15; index += 1) {
  const id = `variant-${index}`;
  const element = page.locator(`#${id}`);

  await element.screenshot({
    path: path.join(outputDir, `${id}.png`),
  });
}

await page.screenshot({
  path: path.join(outputDir, "photo-gallery-options-v2-board.png"),
  fullPage: true,
});

await browser.close();
