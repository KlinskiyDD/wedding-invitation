import { expect, test } from "@playwright/test";

test("renders the modern editorial wedding invitation homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Свадебное приглашение/);

  const hero = page.getByTestId("hero");
  await expect(hero).toContainText("Дмитрий и Марина");
  await expect(hero).toContainText("22 августа 2026");
  await expect(hero).toContainText(
    "Мы создаём день, полный любви и радости",
  );

  await expect(page.getByRole("link", { name: "ГЛАВНАЯ" })).toHaveAttribute(
    "href",
    "#invitation",
  );
  await expect(page.getByRole("link", { name: "МЕСТО" })).toHaveAttribute(
    "href",
    "#place",
  );
  await expect(page.getByRole("link", { name: "ДРЕСС-КОД" })).toHaveAttribute(
    "href",
    "#dress-code",
  );
  await expect(
    page.getByRole("link", { name: "АНКЕТА ГОСТЯ" }),
  ).toHaveAttribute("href", "#rsvp");

  await expect(page.getByTestId("countdown")).toContainText(
    "До нашей свадьбы осталось",
  );

  await expect(page.getByTestId("photo-slot")).toHaveCount(5);

  const schedule = page.getByTestId("schedule");
  await expect(schedule).toContainText("Тайминг дня");
  await expect(schedule).toContainText("15:30");
  await expect(schedule).toContainText("16:00");
  await expect(schedule).toContainText("16:30");
  await expect(schedule).toContainText("18:00");
  await expect(schedule).not.toContainText("20:00");
  await expect(schedule).not.toContainText("Танцы");

  const location = page.getByTestId("location");
  await expect(location).toContainText("Ресторан «Пироговский дворик»");
  await expect(location).toContainText("Пирогово");
  await expect(page.getByLabel("Открыть в Яндекс Картах")).toHaveAttribute(
    "href",
    /yandex\.ru\/maps/,
  );

  const dressCode = page.getByTestId("dress-code");
  await expect(dressCode).toContainText("Дресс-код");
  await expect(dressCode.getByLabel("Белый")).toBeVisible();
  await expect(dressCode.getByLabel("Чёрный")).toBeVisible();
  await expect(dressCode.getByLabel("Красный")).toBeVisible();
  await expect(dressCode.getByLabel("Молочный")).toHaveCount(0);
  await expect(dressCode.getByLabel("Золото/блёстки")).toHaveCount(0);

  const faq = page.getByTestId("faq");
  await expect(faq).toContainText("Часто задаваемые вопросы");
  await expect(faq.locator("details")).toHaveCount(6);
  await expect(faq).not.toContainText("детей");
  await faq.getByText("Можно ли подарить подарок в конверте?").click();
  await expect(faq).toContainText("вклад в бюджет нашей молодой семьи");

  const rsvp = page.getByTestId("rsvp");
  await expect(rsvp).toContainText("Анкета гостя");
  await expect(rsvp).toContainText(
    "подтвердите своё присутствие до 1 июля 2026 года",
  );
  await expect(page.getByPlaceholder("Имя и фамилия")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Подтверждение участия" }))
    .toBeVisible();
  await expect(page.getByRole("combobox", { name: "Количество гостей" }))
    .toBeVisible();
  await expect(page.getByRole("combobox", { name: "Предпочтение по еде" }))
    .toBeVisible();
  await expect(page.getByRole("combobox", { name: "Предпочтение по алкоголю" }))
    .toBeVisible();
  await expect(page.getByPlaceholder("Ограничения по блюдам / аллергии"))
    .toBeVisible();

  await page.getByTestId("rsvp-submit").click();
  await expect(page.getByTestId("rsvp-message")).toContainText(
    "Сейчас ответы не сохраняются",
  );
});
