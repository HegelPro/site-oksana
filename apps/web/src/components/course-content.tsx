import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkDirective from "remark-directive";
import type { Paragraph, Root } from "mdast";
import { cn } from "@/lib/cn";
import { Container } from "./ui/container";

function remarkCourseDetails() {
  return (tree: Root) => {
    for (const block of tree.children) {
      if (block.type !== "containerDirective" || block.name !== "details") continue;

      block.data = Object.assign(block.data ?? {}, { hName: "details" });
      const label = block.children[0];
      if (label?.type === "paragraph" && label.data?.directiveLabel) {
        label.data = Object.assign(label.data, { hName: "summary" });
      } else {
        const summary: Paragraph = {
          type: "paragraph",
          data: Object.assign({}, { hName: "summary" }),
          children: [{ type: "text", value: "Подробнее" }],
        };
        block.children.unshift(summary);
      }
    }
  };
}

const components: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  details: ({ children }) => (
    <details className="group/my-details my-7 rounded-xl border border-line bg-cream px-5 md:px-7">
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold text-violet [&::-webkit-details-marker]:hidden">
      {children}
      <span
        aria-hidden="true"
        className="text-xl before:content-['+'] group-open/my-details:before:content-['−']"
      />
    </summary>
  ),
  img: ({ src, alt, title }) => {
    if (!src) return null;

    // Markdown images can use external HTTPS hosts and do not provide dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} title={title} loading="lazy" decoding="async" />;
  },
};

export function CourseContent({ source }: { source: string }) {
  if (!source.trim()) return null;

  return (
    <section className="bg-paper py-10 md:py-15" data-testid="course-content">
      <Container>
        <div
          className={cn(
            "mx-auto max-w-190 text-[17px] leading-[1.8] wrap-break-word text-muted [&>*:last-child]:mb-0",
            "[&_h2]:mt-[1.2em] [&_h2]:mb-4 [&_h2]:text-[length:clamp(34px,6vw,52px)] [&_h2]:text-balance [&_h2]:text-plum [&>h2:first-child]:mt-0",
            "[&_:is(h4,h5,h6)]:mt-5 [&_:is(h4,h5,h6)]:font-bold [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-3xl [&_h3]:text-plum",
            "[&_a]:font-semibold [&_a]:text-violet [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-ink",
            "[&_img]:mx-auto [&_img]:my-6 [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
            "[&_:is(ol,ul)]:mb-5 [&_:is(ol,ul)]:ps-6 [&_ol]:list-decimal [&_ul]:list-disc",
            "[&_blockquote]:my-6 [&_blockquote]:rounded-lg [&_blockquote]:bg-lavender [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote_p:last-child]:mb-0 [&_hr]:my-7",
            "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-lavender [&_pre]:p-4",
          )}
        >
          <Markdown
            components={components}
            remarkPlugins={[remarkDirective, remarkCourseDetails]}
            skipHtml
            urlTransform={(url, key) => {
              if (key === "src" && !/^(?:\/(?![/\\])|https:\/\/)/i.test(url)) return "";
              return defaultUrlTransform(url);
            }}
          >
            {source}
          </Markdown>
        </div>
      </Container>
    </section>
  );
}
