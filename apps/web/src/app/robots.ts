import type { MetadataRoute } from "next";
import { getIndexableOrigin } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const origin = getIndexableOrigin();
  return origin
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${origin}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
