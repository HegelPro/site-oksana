import { z } from "zod";
import { getVisibleCourse } from "./courses";

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
  message: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => !value.includes("\u0000"))
    .optional(),
  courseSlug: z.string().refine((slug) => Boolean(getVisibleCourse(slug)), "Курс не найден"),
  consent: z.literal(true, { error: "Необходимо согласие" }),
  privacyVersion: z
    .string()
    .regex(/^[a-zA-Z0-9._-]{1,64}$/)
    .optional(),
  submissionId: z.uuidv4().optional(),
  website: z.string().max(200).optional().default(""),
});

export type Lead = z.infer<typeof leadSchema>;

export function parseLead(input: unknown) {
  return leadSchema.safeParse(input);
}
