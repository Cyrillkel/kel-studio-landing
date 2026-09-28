import { z } from "zod";

// Shared by the form and the API route. Messages are i18n keys under
// `contact.errors`, so the browser shows them in the visitor's language
// while the server validates the same rules.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "nameShort" })
    .max(100, { message: "nameLong" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" })
    .max(150, { message: "emailLong" })
    .pipe(z.email({ message: "emailInvalid" })),
  message: z
    .string()
    .trim()
    .min(10, { message: "messageShort" })
    .max(3000, { message: "messageLong" }),
});

export type ContactFields = z.infer<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

// First error per field, as i18n keys.
export function validateContact(values: Record<string, unknown>): ContactErrors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFields;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
