import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const screenshots = join(process.cwd(), "test-results", "screenshots");
const routes = [
  { path: "/", name: "home", heading: /Время замедлиться/ },
  { path: "/courses", name: "catalog", heading: /Курсы для вашего/ },
  {
    path: "/courses/yoga-ayurveda-inner-calm",
    name: "course",
    heading: /Йога и аюрведа для внутреннего спокойствия/,
  },
  {
    path: "/courses/yoga-ayurveda-14-days",
    name: "course-two",
    heading: /Йога и аюрведа для внутреннего спокойствия/,
  },
];

for (const width of [320, 375, 768, 1440]) {
  test(`layouts fit ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    mkdirSync(screenshots, { recursive: true });

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.locator("h1")).toContainText(route.heading);
      await page.evaluate(() => document.fonts.ready);
      if (route.name === "home") {
        await expect
          .poll(() =>
            page
              .getByTestId("hero-photo")
              .evaluate((image) => (image as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
      const size = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(size.document, `${route.path} overflows at ${width}px`).toBeLessThanOrEqual(
        size.viewport + 1,
      );
      await page.screenshot({ path: join(screenshots, `${route.name}-${width}.png`) });
      if (route.name === "home" && (width === 375 || width === 1440)) {
        await page.screenshot({
          path: join(screenshots, `home-full-${width}.png`),
          fullPage: true,
        });
      }
      if (route.name === "course") {
        await expect
          .poll(() =>
            page
              .locator('[data-testid="enrollment-poster"] img')
              .evaluate((image) => (image as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
        await expect(page.getByTestId("enrollment-facts")).toContainText("11–25 ноября");
        if (width === 375 || width === 1440)
          await page.screenshot({
            path: join(screenshots, `course-full-${width}.png`),
            fullPage: true,
          });
      }
    }

    await page.getByLabel("Ваше имя").fill("Анна");
    await page.getByLabel("Телефон").fill("+7 999 123-45-67");
    await expect(page.getByLabel("Телефон")).toHaveAttribute("inputmode", "tel");
    await page.getByLabel("Email").fill("anna@example.com");
    await page.getByRole("checkbox").check();
    const submit = page.getByRole("button", { name: /Отправить заявку/ });
    const box = await submit.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    if (width === 375)
      await page.getByTestId("lead-form").screenshot({ path: join(screenshots, "form-375.png") });
    await submit.tap();
    await expect(page.getByRole("status")).toContainText("Отправка заявок пока недоступна");
  });
}

test("mobile menu opens and links to catalog", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-testid="mobile-menu"] summary').tap();
  await page
    .getByRole("navigation", { name: "Мобильная навигация" })
    .getByRole("link", { name: "Курсы" })
    .tap();
  await expect(page).toHaveURL(/\/courses$/);
});

test("published course has programme, gifts, pricing and contact links", async ({ page }) => {
  await page.goto("/courses");
  await expect(page.getByRole("heading", { name: "Курс 01", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Подробнее о курсе" }).first().click();
  await expect(page).toHaveURL(/\/courses\/yoga-ayurveda-inner-calm$/);
  await expect(page.getByTestId("daily-practice")).toHaveCount(4);
  await expect(page.locator('[data-testid="course-gifts"] article')).toHaveCount(3);
  await expect(page.getByTestId("course-current-price")).toContainText(/5\s?999\s?₽/);
  await expect(page.getByTestId("course-early-offer")).toContainText("Ранняя запись завершена");
  await expect(page.locator('[data-testid="course-phone"] a')).toHaveAttribute(
    "href",
    "tel:+79053068428",
  );
  await expect(page.getByRole("link", { name: "Telegram-канал" })).toHaveAttribute(
    "href",
    "https://t.me/oksayoga144",
  );
  await expect(page.getByRole("link", { name: "Группа йоги и аюрведы в ВК" })).toHaveAttribute(
    "href",
    "https://vk.ru/ayurvedicpro",
  );
});

test("second course includes all fourteen days and its own application", async ({ page }) => {
  await page.goto("/courses/yoga-ayurveda-14-days");
  await expect(page.getByTestId("curriculum-day")).toHaveCount(14);
  await expect(page.locator('[data-testid="curriculum-day"] li')).toHaveCount(44);
  const lastDay = page.getByTestId("curriculum-day").last();
  await lastDay.locator("summary").click();
  await expect(
    lastDay.getByText("Завершение курса, подведение итогов, анонс новых программ"),
  ).toBeVisible();
  await expect(page.locator('[data-testid="outcomes-list"] li')).toHaveCount(5);
  await expect(page.getByTestId("enrollment-facts")).toContainText("11–25 ноября 2026");
  await expect(page.getByTestId("form-header")).toContainText(
    "Йога и аюрведа для внутреннего спокойствия",
  );
  await page.screenshot({ path: join(screenshots, "second-course-full.png"), fullPage: true });
});

test("supporting pages and all illustration variants fit mobile and desktop", async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    for (const route of [
      "/privacy",
      "/courses/course-01",
      "/courses/course-02",
      "/courses/course-03",
      "/courses/missing-course",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width + 1,
      );
      await expect(
        page
          .getByRole("link", { name: /Вернуться к курсам|Ко всем курсам|Оставить заявку/ })
          .first(),
      ).toBeVisible();
    }
  }
});

test("reduced motion preserves responsive navigation and visible keyboard focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 850 });
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Основная навигация", exact: true }),
  ).toBeVisible();
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Перейти к содержимому" });
  await expect(skipLink).toBeFocused();
  const focus = await skipLink.evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    outline: getComputedStyle(element).outlineStyle,
  }));
  expect(focus.top).toBeGreaterThanOrEqual(0);
  expect(focus.outline).toBe("solid");
  await page.setViewportSize({ width: 320, height: 850 });
  await expect(page.getByTestId("mobile-menu")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Основная навигация", exact: true }),
  ).toBeHidden();
});
