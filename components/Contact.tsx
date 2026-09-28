"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AmbientAtom from "./AmbientAtom";
import { Button } from "./Button";
import { validateContact, type ContactErrors } from "@/lib/contactSchema";
import SectionGlow from "./SectionGlow";

const fieldClass = (invalid: boolean) =>
  `w-full rounded-lg border bg-black/30 px-5 py-3 text-white transition placeholder-gray-500 focus:outline-none sm:px-6 sm:py-4 ${
    invalid ? "border-rose-500/60 focus:border-rose-400" : "border-white/10 focus:border-white/30"
  }`;

// The message sits under its field, small and left-aligned, so the layout
// height barely moves when it appears.
function Field({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className="text-left">
      {children}
      {error && <p className="mt-1.5 pl-1 text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "tooMany">("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  // Anti-spam, both invisible to a real visitor: a field only bots fill in and
  // the time it took to write the message.
  const [company, setCompany] = useState("");
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the complaint as soon as the visitor starts fixing it.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const checkField = (field: keyof typeof formData) => {
    const found = validateContact(formData)[field];
    setErrors((prev) => ({ ...prev, [field]: found }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validateContact(formData);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, company, startedAt: openedAt.current }),
      });
      if (response.status === 429) {
        setStatus("tooMany");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-16 md:py-24 bg-[linear-gradient(to_bottom,#000000_0px,#0a0a0a_180px,#0a0a0a_100%)]"
    >
      <SectionGlow />
      <AmbientAtom className="-left-10 top-4 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 -z-10" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
          {t("contact.heading")}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12">
          {t("contact.subheading")}
        </p>
        <div className="bg-white/3 p-6 sm:p-8 md:p-12 rounded-2xl border border-white/10">
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Field error={errors.name && t(`contact.errors.${errors.name}`)}>
                <input
                  type="text"
                  placeholder={t("contact.namePlaceholder")}
                  aria-label={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => checkField("name")}
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClass(Boolean(errors.name))}
                />
              </Field>
              <Field error={errors.email && t(`contact.errors.${errors.email}`)}>
                <input
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  aria-label={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => checkField("email")}
                  aria-invalid={Boolean(errors.email)}
                  className={fieldClass(Boolean(errors.email))}
                />
              </Field>
            </div>
            <Field error={errors.message && t(`contact.errors.${errors.message}`)}>
              <textarea
                placeholder={t("contact.messagePlaceholder")}
                aria-label={t("contact.messagePlaceholder")}
                rows={5}
                value={formData.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => checkField("message")}
                aria-invalid={Boolean(errors.message)}
                className={`${fieldClass(Boolean(errors.message))} resize-none`}
              />
            </Field>
            {/* Honeypot: hidden from people, filled in by bots. */}
            <input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? t("contact.sending") : t("contact.submit")}
            </Button>
            {status === "sent" && (
              <p role="status" className="text-center text-emerald-400">
                {t("contact.success")}
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-center text-rose-400">
                {t("contact.error")}
              </p>
            )}
            {status === "tooMany" && (
              <p role="alert" className="text-center text-amber-400">
                {t("contact.tooMany")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
