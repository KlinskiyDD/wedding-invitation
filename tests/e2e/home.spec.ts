import { expect, test } from "@playwright/test";

test("renders the wedding invitation homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Свадебное приглашение/);
  await expect(page.getByTestId("hero")).toContainText("Марина & Дмитрий");
  await expect(page.getByTestId("hero")).toContainText(
    "Приглашение на свадьбу Марины и Дмитрия",
  );
  await expect(page.getByTestId("hero-rsvp-link")).toHaveAttribute(
    "href",
    "#rsvp",
  );
  await expect(page.getByTestId("countdown")).toContainText("До свадьбы");
  await expect(page.getByTestId("schedule")).toContainText("План дня");
  await expect(page.getByTestId("schedule")).toContainText("15:30");
  await expect(page.getByTestId("schedule")).toContainText("Ресторан");
  await expect(page.getByTestId("location")).toContainText("Локация");
  await expect(page.getByTestId("location")).toContainText("Ресторан «Дворик»");
  await expect(page.getByTestId("photo-story")).toContainText("Наши фотографии");
  await expect(page.getByTestId("dress-code")).toContainText("Стоп-цвета");
  await expect(page.getByTestId("dress-code")).toContainText("Total black");
  await expect(page.getByTestId("rsvp")).toContainText("RSVP");
  await expect(page.getByTestId("rsvp")).toContainText(
    "Поедете ли вы на роспись",
  );
  await expect(page.getByTestId("rsvp")).toContainText("не пью");
  await expect(page.getByTestId("rsvp-placeholder")).toBeDisabled();
  await expect(page.getByTestId("faq")).toContainText("Вопросы");
  await expect(page.getByTestId("faq")).toContainText("бутылку вина");
});
