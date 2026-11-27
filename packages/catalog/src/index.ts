import { parse } from "yaml";
import { z } from "zod";

const text = z.string().trim().min(1);

const courseFields = z.strictObject({
  title: text,
  summary: text.optional(),
  format: text.optional(),
  duration: text.optional(),
  schedule: text.optional(),
  price: z.number().int().nonnegative().optional(),
  cover: z
    .strictObject({
      src: z.string().regex(/^\/images\/[^\s?#\\]+$/u),
      alt: text,
    })
    .optional(),
  order: z.number().int().nonnegative().optional(),
  draft: z.boolean().default(false),
});

export type Course = z.infer<typeof courseFields> & {
  slug: string;
  body: string;
};

export function parseCourse(slug: string, source: string): Course {
  try {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(
        "Имя файла должно состоять из строчных латинских букв, цифр и дефисов",
      );
    }

    const frontmatter =
      /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(
        source,
      );
    if (!frontmatter) {
      throw new Error(
        "В начале файла нужен блок полей YAML между строками ---",
      );
    }

    const [, yaml, body] = frontmatter;
    const fields = courseFields.parse(parse(yaml, { maxAliasCount: 0 }));
    if (!body.trim() && !fields.draft) {
      throw new Error("Добавьте описание курса после блока YAML");
    }

    return { ...fields, slug, body };
  } catch (error) {
    throw new Error(`Ошибка в файле курса ${slug}.md: ${String(error)}`, {
      cause: error,
    });
  }
}
