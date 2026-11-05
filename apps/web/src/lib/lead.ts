import { getCourse } from "@oksana/catalog";
import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(100)
    .regex(/^[^\r\n\x00-\x1f]+$/, "Недопустимые символы в имени"),
  phone: z
    .string()
    .trim()
    .min(7, "Укажите телефон")
    .max(25)
    .regex(/^[+()\d\s-]+$/, "Проверьте номер телефона")
    .refine((value) => value.replace(/\D/g, "").length >= 7, "Проверьте номер телефона"),
  email: z.email("Проверьте адрес электронной почты").max(254),
  courseSlug: z.string().refine((slug) => Boolean(getCourse(slug)), "Курс не найден"),
  consent: z.literal(true, { error: "Необходимо согласие" }),
  website: z.string().max(200).optional().default(""),
});

export type Lead = z.infer<typeof leadSchema>;

export function parseLead(input: unknown) {
  return leadSchema.safeParse(input);
}
