import { expect, test } from "@playwright/test";

const firstCourse = "/courses/yoga-ayurveda-inner-calm";
const secondCourse = "/courses/yoga-ayurveda-14-days";
const courseTitle = "Йога и аюрведа для внутреннего спокойствия";
const liveDatabase = process.env.E2E_REAL_LEADS === "true";
const routes = [
  { path: "/", heading: "Йога и аюрведа с Оксаной Палкиной" },
  { path: "/courses", heading: "Курсы" },
  { path: firstCourse, heading: courseTitle },
  { path: secondCourse, heading: courseTitle },
  { path: "/privacy", heading: /персональных данных/i },
];

for (const width of [320, 375, 768, 1440]) {
  test(`layouts fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `${route.path} overflows at ${width}px`).toBeLessThanOrEqual(width + 1);
    }
  });
}

test("mobile visitors can reach the catalog and choose a course", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const hero = page.getByTestId("hero-photo");
  await expect
    .poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page
    .getByRole("navigation", { name: "Основная навигация" })
    .getByRole("link", { name: "Курсы" })
    .tap();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(page.locator(`a[href="${secondCourse}"]`)).toBeVisible();
  const secondCover = page.getByRole("img", {
    name: "Оксана Палкина медитирует на коврике в зелёном саду",
  });
  await secondCover.scrollIntoViewIfNeeded();
  await expect
    .poll(() => secondCover.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page.locator(`a[href="${firstCourse}"]`).tap();
  await expect(page).toHaveURL(new RegExp(firstCourse + "$"));
});

test("the first course shows shared facts, Markdown, optional illustration and contacts", async ({
  page,
}) => {
  await page.goto(firstCourse);
  const facts = page.getByRole("term").locator("..");
  await expect(facts.filter({ hasText: "Стоимость" })).toContainText(/5\s?999\s?₽/);
  await expect(facts.filter({ hasText: "Даты программы" })).toContainText("11–25 ноября");
  await expect(facts.filter({ hasText: "Даты программы" })).toContainText("Прошлый поток");

  const content = page.getByTestId("course-content");
  await expect(content.getByRole("heading", { name: "Как проходят занятия" })).toBeVisible();
  await expect(content.getByRole("heading", { name: "Подарки после курса" })).toBeVisible();
  await expect(
    content.getByText("Ранняя цена 2 999 ₽ действовала", { exact: false }),
  ).toBeVisible();
  const illustration = content.getByRole("img", {
    name: "Сиреневый коврик для йоги у окна в утреннем свете",
  });
  await illustration.scrollIntoViewIfNeeded();
  await expect
    .poll(() => illustration.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: "+7 905 306-84-28" })).toHaveAttribute(
    "href",
    "tel:+79053068428",
  );
});

test("the second course has a short overview and an expandable fourteen-day programme", async ({
  page,
}) => {
  await page.goto(secondCourse);
  const content = page.getByTestId("course-content");
  await expect(content.getByRole("heading", { name: "Что даст курс" })).toBeVisible();
  await expect(content.getByRole("img")).toHaveCount(0);
  const details = content.locator("details");
  await expect(details).toHaveJSProperty("open", false);
  const summary = details.locator("summary");
  await expect(summary).toHaveText("Смотреть все 14 дней");
  await summary.press("Enter");
  await expect(details).toHaveJSProperty("open", true);
  await expect(details.getByRole("heading", { level: 3 })).toHaveCount(14);
  await expect(details.getByRole("listitem")).toHaveCount(44);
  await expect(
    details.getByText("Завершение курса, подведение итогов и анонс новых программ."),
  ).toBeVisible();
});

test("the application form submits the selected course", async ({ page }) => {
  if (!liveDatabase) {
    await page.route("**/api/leads", (route) => route.fulfill({ status: 200, json: { ok: true } }));
  }
  await page.goto(secondCourse);
  await page.getByRole("link", { name: "Узнать о следующем наборе" }).click();
  const form = page.getByRole("form", { name: "Заявка на курс" });
  await form.getByLabel("Ваше имя").fill("Анна");
  await form.getByLabel("Телефон").fill("+7 999 123-45-67");
  await expect(form.getByLabel("Телефон")).toHaveAttribute("inputmode", "tel");
  await form.getByLabel("Email").fill("anna@example.com");
  await form.getByLabel("Сообщение", { exact: false }).fill("Можно заниматься с нуля?");
  await form.getByRole("checkbox").check();
  const submit = form.getByRole("button", { name: "Отправить заявку" });
  await expect(form.getByRole("checkbox")).toHaveJSProperty("required", true);
  const request = page.waitForRequest(
    (request) => request.url().endsWith("/api/leads") && request.method() === "POST",
  );
  await submit.click();
  const body = (await request).postDataJSON();
  expect(body).toMatchObject({
    courseSlug: "yoga-ayurveda-14-days",
    consent: true,
    message: "Можно заниматься с нуля?",
    submissionId: expect.stringMatching(/^[0-9a-f-]{36}$/),
  });
  await expect(form.getByRole("status")).toContainText("Заявка принята");
  if (liveDatabase) {
    expect(body.privacyVersion).toBe("ci-policy");
    const retry = await page.request.post("/api/leads", {
      data: body,
      headers: { Origin: new URL(page.url()).origin },
    });
    expect(retry.status()).toBe(200);
  }
});

test("a draft without an image works and an unknown course has a way back", async ({ page }) => {
  await page.goto("/courses/course-01");
  if (liveDatabase) {
    await expect(page.getByRole("heading", { level: 1, name: "Курс не найден" })).toBeVisible();
  } else {
    await expect(page.getByRole("heading", { level: 1, name: "Курс 01" })).toBeVisible();
    await expect(page.getByTestId("course-content")).toContainText(
      "Мы готовим подробную программу",
    );
    await expect(page.getByRole("main").getByRole("img")).toHaveCount(0);
  }

  await page.goto("/courses/missing-course");
  await expect(page.getByRole("heading", { level: 1, name: "Курс не найден" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ко всем курсам" })).toHaveAttribute(
    "href",
    "/courses",
  );
});

test("reduced motion preserves visible keyboard navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Перейти к содержимому" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
});
