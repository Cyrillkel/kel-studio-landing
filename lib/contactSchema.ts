// Rules for the contact form, shared by the form and the API route. Plain
// TypeScript on purpose: zod was about 130 kB gzipped in the page bundle,
// nearly a third of all the JavaScript, to check three text fields. Messages
// are i18n keys under `contact.errors`, so the browser shows them in the
// visitor's language while the server validates the same rules.

export type ContactFields = { name: string; email: string; phone: string; message: string };
// `consent` is only checked, not stored: the form cannot be sent without it.
export type ContactErrors = Partial<Record<keyof ContactFields | "consent", string>>;

// The pattern zod's z.email() used here before.
const EMAIL =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

// A phone number as people type it: digits, plus, spaces, brackets, dashes,
// dots. 10 to 15 digits covers a Russian number with or without +7 or 8, and
// international ones.
const PHONE = /^[+\d\s().-]+$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// First error per field, as i18n keys.
export function validateContact(values: Record<string, unknown>): ContactErrors {
  const name = text(values.name);
  const email = text(values.email);
  const phone = text(values.phone);
  const message = text(values.message);
  const errors: ContactErrors = {};

  if (name.length < 2) errors.name = "nameShort";
  else if (name.length > 100) errors.name = "nameLong";

  if (email.length < 1) errors.email = "emailRequired";
  else if (email.length > 150) errors.email = "emailLong";
  else if (!EMAIL.test(email)) errors.email = "emailInvalid";

  // Optional: empty is fine, but a number that is given has to look like one.
  const digits = phone.replace(/\D/g, "").length;
  if (phone && (!PHONE.test(phone) || digits < 10 || digits > 15)) errors.phone = "phoneInvalid";

  // Optional too: only the upper limit is left.
  if (message.length > 3000) errors.message = "messageLong";

  // Required: the visitor has to agree to the processing of their data.
  if (values.consent !== true) errors.consent = "consentRequired";

  return errors;
}

// The trimmed fields when they pass the rules, otherwise null.
export function parseContact(values: Record<string, unknown>): ContactFields | null {
  if (Object.keys(validateContact(values)).length > 0) return null;
  return {
    name: text(values.name),
    email: text(values.email),
    phone: text(values.phone),
    message: text(values.message),
  };
}
