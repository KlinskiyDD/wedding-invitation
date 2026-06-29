import { expect, test } from "@playwright/test";

test("renders the wedding invitation homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Свадебное приглашение/);
  await expect(page.getByTestId("hero")).toContainText("Анна & Дмитрий");
  await expect(page.getByTestId("hero-rsvp-link")).toHaveAttribute(
    "href",
    "#rsvp",
  );
  await expect(page.getByTestId("schedule")).toContainText("План дня");
  await expect(page.getByTestId("location")).toContainText("Локация");
  await expect(page.getByTestId("rsvp")).toContainText("RSVP");
  await expect(page.getByTestId("rsvp-placeholder")).toBeDisabled();
  await expect(page.getByTestId("faq")).toContainText("Вопросы");
});
