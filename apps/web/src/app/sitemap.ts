import type { MetadataRoute } from "next";
import { getPublishedCourses } from "@/lib/courses";
import { getIndexableOrigin } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getIndexableOrigin();
  if (!origin) return [];

  const paths = [
    "/",
    "/courses",
    "/privacy",
    ...getPublishedCourses().map(({ slug }) => `/courses/${slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path, origin).href }));
}
