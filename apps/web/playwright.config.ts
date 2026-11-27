import { defineConfig, devices } from "@playwright/test";

// Тестовый сервер доступен только на localhost; системный SOCKS-прокси мешает его проверке.
for (const key of [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
]) {
  delete process.env[key];
}
process.env.NO_PROXY = "localhost,127.0.0.1";

const externalBaseUrl = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "*.e2e.ts",
  timeout: 30_000,
  use: {
    ...devices["Desktop Chrome"],
    channel: process.env.CI ? undefined : "chrome",
    hasTouch: true,
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "pnpm exec next dev --hostname 127.0.0.1 --port 3100",
        url: "http://127.0.0.1:3100/api/health",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
