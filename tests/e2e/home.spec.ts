import { expect, test } from "@playwright/test";

test("renders the vintage wedding invitation homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Свадебное приглашение/);

  const hero = page.getByTestId("hero");
  await expect(hero).toContainText("Дмитрий");
  await expect(hero).toContainText("Марина");
  await expect(hero).toContainText("22 августа 2026");
  await expect(hero).toContainText("Дорогие гости!");
  await expect(hero).toContainText(
    "С любовью приглашаем вас на день рождения нашей семьи!",
  );
  await expect(page.getByRole("link", { name: "Приглашение" })).toHaveAttribute(
    "href",
    "#invitation",
  );
  await expect(page.getByRole("link", { name: "FAQ" })).toHaveAttribute(
    "href",
    "#faq",
  );
  await expect
    .poll(async () =>
      page
        .locator(".vintage-page")
        .evaluate((element) => getComputedStyle(element).backgroundImage),
    )
    .not.toContain("linear-gradient");

  await expect(page.getByTestId("countdown")).toContainText(
    "До нашей свадьбы осталось",
  );

  const schedule = page.getByTestId("schedule");
  await expect(schedule).toContainText("Тайминг дня");
  await expect(schedule).toContainText("15:30");
  await expect(schedule).toContainText("15:45");
  await expect(schedule).toContainText("16:00");
  await expect(schedule).toContainText("18:00");

  await expect(page.getByTestId("photo-slot")).toHaveCount(4);

  const location = page.getByTestId("location");
  await expect(location).toContainText("Место проведения");
  await expect(location).toContainText("Ресторан «Пироговский дворик»");
  await expect(location).toContainText("деревня Пирогово");
  await expect(page.getByLabel("Открыть в Яндекс Картах")).toHaveAttribute(
    "href",
    /yandex\.ru\/maps/,
  );

  const dressCode = page.getByTestId("dress-code");
  await expect(dressCode).toContainText("Стоп-цвета");
  await expect(dressCode).toContainText("total black");

  const faq = page.getByTestId("faq");
  await expect(faq).toContainText("Частые вопросы");
  await expect(faq).toContainText("Что с цветами?");
  await expect(faq).toContainText("бутылку вина");
  await expect(faq).not.toContainText("детей");

  const rsvp = page.getByTestId("rsvp");
  await expect(rsvp).toContainText("Анкета гостя");
  await expect(rsvp).toContainText("С радостью приду!");
  await expect(rsvp).toContainText("Приеду сразу на банкет");
  await expect(rsvp).toContainText("Не пью");
  await expect(rsvp).toContainText("Продукты, которые вы не едите");

  await page.getByTestId("rsvp-submit").click();
  await expect(page.getByTestId("rsvp-message")).toContainText(
    "Сейчас ответы не сохраняются",
  );
});
