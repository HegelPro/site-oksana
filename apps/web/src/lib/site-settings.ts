import { readFileSync } from "node:fs";

export function getSiteOrigin() {
  try {
    const url = new URL(process.env.SITE_ORIGIN ?? "");
    if (
      !["https:", "http:"].includes(url.protocol) ||
      (url.protocol === "http:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function getPrivacyPolicy() {
  const version = process.env.PRIVACY_VERSION;
  const path = process.env.PRIVACY_POLICY_PATH;
  if (!path || !version || !/^[a-zA-Z0-9._-]{1,64}$/.test(version)) return undefined;

  try {
    const text = readFileSync(path, "utf8").trim();
    return text ? { text, version } : undefined;
  } catch {
    return undefined;
  }
}

export function usesPublicSettings() {
  return process.env.NODE_ENV === "production";
}

export function publicLeadSettings() {
  if (process.env.PUBLIC_LEADS_ENABLED !== "true") return undefined;
  const origin = getSiteOrigin();
  const policy = getPrivacyPolicy();
  if (origin && policy) return { origin, privacyVersion: policy.version };
  return undefined;
}

export function getIndexableOrigin() {
  if (usesPublicSettings() && process.env.PUBLIC_INDEXABLE === "true") {
    return publicLeadSettings()?.origin;
  }
  return undefined;
}
