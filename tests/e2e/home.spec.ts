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
  await expect(page.locator("[data-motion-reveal]")).toHaveCount(7);
  await expect(
    page.getByRole("link", { name: "Добавить свадьбу в Google Calendar" }),
  ).toHaveAttribute("href", /calendar\.google\.com/);
  await expect(
    page.getByRole("link", { name: "Скачать событие для Apple Calendar" }),
  ).toHaveAttribute("href", "/calendar/dmitriy-marina-wedding.ics");

  const photoStory = page.getByTestId("photo-strip");
  await expect(photoStory).toContainText("Наша история в кадрах");
  await expect(photoStory.getByTestId("photo-gallery-card")).toBeVisible();
  await expect(photoStory.getByTestId("photo-slot")).toHaveCount(5);
  await photoStory.scrollIntoViewIfNeeded();
  await expect(photoStory).toHaveAttribute("data-motion-visible", "true");
  await expect(photoStory.getByTestId("photo-slot").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.evaluate(() => window.scrollBy(0, -220));
  await expect(photoStory).toHaveAttribute("data-motion-visible", "true");
  await expect(photoStory.getByTestId("photo-slot").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(
    photoStory.getByAltText("Дмитрий и Марина в зеркальном зале"),
  ).toBeVisible();
  await expect(
    photoStory.getByAltText("Дмитрий и Марина на уютном селфи"),
  ).toBeVisible();
  await expect(
    photoStory.getByTestId("photo-slot").nth(1).locator("img"),
  ).toHaveAttribute("src", /couple-mirror-hall\.jpg/);
  await expect(
    photoStory.getByTestId("photo-slot").nth(3).locator("img"),
  ).toHaveAttribute("src", /couple-sofa-selfie\.jpg/);

  const schedule = page.getByTestId("schedule");
  await schedule.scrollIntoViewIfNeeded();
  await expect(schedule).toHaveAttribute("data-motion-visible", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(schedule).toHaveAttribute("data-motion-visible", "true");
  await schedule.scrollIntoViewIfNeeded();
  await expect(schedule).toHaveAttribute("data-motion-visible", "true");
  await expect(schedule).toContainText("Тайминг дня");
  await expect(schedule).toContainText("15:30");
  await expect(schedule).toContainText("Сбор гостей у ЗАГСА");
  await expect(schedule).toContainText("16:00");
  await expect(schedule).toContainText("15:45");
  await expect(schedule).toContainText("18:00");
  await expect(schedule).toContainText("Начало праздничного банкета");
  await expect(
    schedule.locator("article").filter({ hasText: "Церемония" }),
  ).toContainText("15:45");
  await expect(
    schedule.locator("article").filter({ hasText: "Поздравления" }),
  ).toContainText("16:00");
  await expect(
    schedule
      .locator("article")
      .filter({ hasText: "Сбор гостей у ЗАГСА" })
      .locator("img"),
  ).toHaveAttribute("src", /icon-guest-gathering-custom\.png/);
  await expect(
    schedule.locator("article").filter({ hasText: "Церемония" }).locator("img"),
  ).toHaveAttribute("src", /icon-ceremony-custom\.png/);
  await expect(
    schedule
      .locator("article")
      .filter({ hasText: "Поздравления" })
      .locator("img"),
  ).toHaveAttribute("src", /icon-photoshoot-custom\.png/);
  await expect(schedule).not.toContainText("16:30");
  await expect(schedule).not.toContainText("20:00");
  await expect(schedule).not.toContainText("23:00");
  await expect(schedule).not.toContainText("00:00");
  await expect(schedule).not.toContainText("Танцы");
  await expect(schedule).not.toContainText("Завершение вечера");
  const scheduleIconMetrics = await schedule
    .locator('[data-testid="schedule-icon-image"]')
    .evaluateAll((icons) =>
      icons.map((icon) => {
        const rect = icon.getBoundingClientRect();

        return {
          height: rect.height,
          type: icon.getAttribute("data-schedule-icon"),
          width: rect.width,
        };
      }),
    );
  expect(scheduleIconMetrics).toHaveLength(4);
  expect(scheduleIconMetrics.map((icon) => icon.type)).toEqual([
    "guestGathering",
    "ceremony",
    "photoshoot",
    "cloche",
  ]);
  for (const icon of scheduleIconMetrics) {
    expect(icon.width).toBeGreaterThan(0);
    expect(icon.height).toBeGreaterThan(0);
  }

  const location = page.getByTestId("location");
  await location.scrollIntoViewIfNeeded();
  await expect(location).toContainText("Ресторан «Пироговский дворик»");
  await expect(location.locator(".venue-photo img")).toHaveAttribute(
    "src",
    /restaurant-interior-banquet\.jpg/,
  );
  await expect(location).toContainText("Пирогово");
  await expect(page.getByLabel("Открыть в Яндекс Картах")).toHaveAttribute(
    "href",
    /yandex\.ru\/maps/,
  );

  const dressCode = page.getByTestId("dress-code");
  await dressCode.scrollIntoViewIfNeeded();
  await expect(dressCode).toContainText("Дресс-код");
  await expect(dressCode).toContainText("Мы не вводим дресс-код");
  await expect(dressCode).toContainText(
    "приходите так, как вам комфортно и красиво",
  );
  await expect(dressCode).toContainText("Единственное пожелание");
  await expect(dressCode).toContainText(
    "избегать белого, Total Black и ярко-красного цветов",
  );
  await expect(dressCode.getByLabel("Белый")).toBeVisible();
  await expect(dressCode.getByLabel("Чёрный")).toBeVisible();
  await expect(dressCode.getByLabel("Красный")).toBeVisible();
  await expect(dressCode.getByLabel("Молочный")).toHaveCount(0);
  await expect(dressCode.getByLabel("Золото/блёстки")).toHaveCount(0);

  const faq = page.getByTestId("faq");
  await faq.scrollIntoViewIfNeeded();
  await expect(faq).toContainText("Часто задаваемые вопросы");
  await expect(faq.locator("details")).toHaveCount(6);
  await expect(faq).not.toContainText("детей");
  await faq.getByText("Можно ли подарить подарок в конверте?").click();
  await expect(faq).toContainText("вклад в бюджет нашей молодой семьи");

  const rsvp = page.getByTestId("rsvp");
  await rsvp.scrollIntoViewIfNeeded();
  await expect(rsvp).toContainText("Анкета гостя");
  await expect(rsvp).toContainText(
    "подтвердите своё присутствие до 22 июля 2026 года",
  );
  await expect(page.getByPlaceholder("Имя и фамилия")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Подтверждение участия" }))
    .toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Количество гостей" }),
  ).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Предпочтение по еде" }))
    .toBeVisible();
  await expect(page.getByRole("combobox", { name: "Предпочтение по алкоголю" }))
    .toBeVisible();
  await expect(page.getByPlaceholder("Ограничения по блюдам / аллергии"))
    .toBeVisible();
  const submitButtonGeometry = await page
    .getByTestId("rsvp-submit")
    .evaluate((button) => {
      const buttonRect = button.getBoundingClientRect();
      const label = button.querySelector("span");

      if (!label) {
        return { centerDelta: Number.POSITIVE_INFINITY, width: buttonRect.width };
      }

      const labelRect = label.getBoundingClientRect();

      return {
        centerDelta: Math.abs(
          labelRect.left +
            labelRect.width / 2 -
            (buttonRect.left + buttonRect.width / 2),
        ),
        width: buttonRect.width,
      };
    });
  expect(submitButtonGeometry.width).toBeLessThanOrEqual(250);
  expect(submitButtonGeometry.centerDelta).toBeLessThanOrEqual(1);

  let rsvpPayload: Record<string, unknown> | null = null;
  await page.route("**/api/rsvp", async (route) => {
    rsvpPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "Спасибо! Ваш ответ сохранён.",
      }),
    });
  });

  await page.getByPlaceholder("Имя и фамилия").fill("Иван Иванов");
  await page
    .getByRole("combobox", { name: "Предпочтение по еде" })
    .selectOption("Птица");
  await page
    .getByRole("combobox", { name: "Предпочтение по алкоголю" })
    .selectOption("Вино белое");
  await page
    .getByPlaceholder("Ограничения по блюдам / аллергии")
    .fill("Без орехов");

  await page.getByTestId("rsvp-submit").click();
  await expect(page.getByTestId("rsvp-message")).toContainText(
    "Спасибо! Ваш ответ сохранён.",
  );
  expect(rsvpPayload).toMatchObject({
    guestName: "Иван Иванов",
    attendance: "Подтверждаю участие",
    foodPreference: "Птица",
    drinkPreference: "Вино белое",
    foodRestrictions: "Без орехов",
  });
  expect(rsvpPayload).not.toHaveProperty("companions");
});

test("renders the banquet-only invitation timing", async ({ page }) => {
  await page.goto("/banquet");

  await expect(page).toHaveTitle(/Свадебное приглашение/);
  await expect(page.getByTestId("hero")).toContainText("Дмитрий и Марина");

  const schedule = page.getByTestId("schedule");
  await schedule.scrollIntoViewIfNeeded();

  await expect(schedule.locator("article")).toHaveCount(3);
  await expect(schedule).toContainText("Тайминг дня");
  await expect(schedule).toContainText("18:00");
  await expect(schedule).toContainText("Начало праздничного банкета");
  await expect(schedule).toContainText("23:00");
  await expect(schedule).toContainText("Танцы");
  await expect(schedule).toContainText("00:00");
  await expect(schedule).toContainText("Завершение вечера");
  await expect(
    schedule.locator("article").filter({ hasText: "Танцы" }).locator("img"),
  ).toHaveAttribute("src", /icon-dance-custom\.png/);
  await expect(
    schedule
      .locator("article")
      .filter({ hasText: "Завершение вечера" })
      .locator("img"),
  ).toHaveAttribute("src", /icon-evening-finale-custom\.png/);
  await expect(schedule).not.toContainText("15:30");
  await expect(schedule).not.toContainText("Сбор гостей у ЗАГСА");
  await expect(schedule).not.toContainText("15:45");
  await expect(schedule).not.toContainText("Церемония");
  await expect(schedule).not.toContainText("16:00");
  await expect(schedule).not.toContainText("Поздравления");

  await expect(page.getByTestId("rsvp")).toContainText(
    "подтвердите своё присутствие до 22 июля 2026 года",
  );
  await expect(
    page.getByRole("link", { name: "Добавить свадьбу в Google Calendar" }),
  ).toHaveAttribute("href", /20260822T180000/);
  await expect(
    page.getByRole("link", { name: "Скачать событие для Apple Calendar" }),
  ).toHaveAttribute(
    "href",
    "/calendar/dmitriy-marina-wedding-banquet.ics",
  );
});

test("keeps content visible when reduced motion is requested", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(page.locator("[data-motion-reveal]")).toHaveCount(7);
  await expect(page.locator("[data-motion-reveal]").first()).toHaveAttribute(
    "data-motion-visible",
    "true",
  );
  await expect(page.getByTestId("schedule")).toContainText("Тайминг дня");
  await expect(page.getByTestId("rsvp")).toContainText("Анкета гостя");

  await context.close();
});

test("animates reveal sections when motion is allowed", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/motion-ready/);

  const schedule = page.getByTestId("schedule");
  await expect(schedule).toHaveCSS("opacity", "0");

  await schedule.scrollIntoViewIfNeeded();
  await expect(schedule).toHaveAttribute("data-motion-visible", "true");

  await page.waitForTimeout(120);
  const opacityDuringTransition = await schedule.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).opacity),
  );

  expect(opacityDuringTransition).toBeGreaterThan(0);
  expect(opacityDuringTransition).toBeLessThan(1);

  await expect(schedule).toHaveCSS("opacity", "1");
});

test("keeps the photo collage contained on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  const photoStory = page.getByTestId("photo-strip");
  await photoStory.scrollIntoViewIfNeeded();

  await expect(photoStory.getByTestId("photo-slot")).toHaveCount(5);

  const hasNoHorizontalOverflow = await photoStory.evaluate(
    (element) => element.scrollWidth <= element.clientWidth + 1,
  );

  expect(hasNoHorizontalOverflow).toBe(true);
});

test("keeps the schedule timeline readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  const schedule = page.getByTestId("schedule");
  await schedule.scrollIntoViewIfNeeded();

  const mobileLayout = await schedule.locator("article").evaluateAll((events) =>
    events.map((event) => {
      const eventRect = event.getBoundingClientRect();
      const icon = event.querySelector<HTMLElement>(".schedule-icon-image");
      const time = event.querySelector<HTMLElement>("time");
      const title = event.querySelector<HTMLElement>("h3");
      const description = event.querySelector<HTMLElement>("p");

      if (!icon || !time || !title) {
        return {
          hasRequiredElements: false,
          iconTimeGap: Number.NEGATIVE_INFINITY,
          textFitsCard: false,
          titleTimeGap: Number.NEGATIVE_INFINITY,
        };
      }

      const iconRect = icon.getBoundingClientRect();
      const timeRect = time.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const descriptionRect = description?.getBoundingClientRect();
      const textRight = Math.max(
        titleRect.right,
        descriptionRect?.right ?? titleRect.right,
      );

      return {
        hasRequiredElements: true,
        iconTimeGap: timeRect.left - iconRect.right,
        textFitsCard: textRight <= eventRect.right - 8,
        titleTimeGap: titleRect.left - timeRect.right,
      };
    }),
  );

  expect(mobileLayout).toHaveLength(4);

  for (const item of mobileLayout) {
    expect(item.hasRequiredElements).toBe(true);
    expect(item.iconTimeGap).toBeGreaterThanOrEqual(8);
    expect(item.titleTimeGap).toBeGreaterThanOrEqual(8);
    expect(item.textFitsCard).toBe(true);
  }
});
