"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "./Button";
import Select from "./Select";
import { OTHER_SERVICE, validateContact, type ContactErrors } from "@/lib/contactSchema";
import { SERVICE_SLUGS, type ServiceSlug } from "@/lib/services";
import { GOALS, reachGoal } from "@/lib/metrika";
import { PHONE, PHONE_URL, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

// ym-disable-keys: Metrika's session replay doesn't record what is typed here.
const fieldClass = (invalid: boolean) =>
  `ym-disable-keys w-full rounded-lg border bg-black/30 px-5 py-3 text-white transition placeholder-gray-500 focus:outline-none sm:px-6 sm:py-4 ${
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

export default function ContactForm({
  // Shown in the Telegram message, so it is clear where the lead came from.
  place,
  service,
  onSent,
}: {
  place: string;
  // The service page the form sits on: preselected as the topic.
  service?: ServiceSlug;
  onSent?: () => void;
}) {
  const { t } = useTranslation();
  const emptyForm = { name: "", email: "", phone: "", message: "", service: service ?? "" };
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "tooMany">("idle");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Anti-spam, both invisible to a real visitor: a field only bots fill in and
  // the time it took to write the message.
  const [company, setCompany] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const started = useRef(false);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  // The topic: "not chosen", every service page, "other".
  const topics = [
    { value: "", label: t("contact.topicNone") },
    ...SERVICE_SLUGS.map((slug) => ({ value: slug, label: t(`servicePages.items.${slug}.name`) })),
    { value: OTHER_SERVICE, label: t("contact.topicOther") },
  ];

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the complaint as soon as the visitor starts fixing it.
    if (field !== "service" && errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    // "Give an email or a phone" is settled by either of the two.
    if ((field === "email" || field === "phone") && errors.contact) {
      setErrors((prev) => ({ ...prev, contact: undefined }));
    }
  };

  const checkField = (field: "name" | "email" | "phone" | "message") => {
    const found = validateContact({ ...formData, consent })[field];
    setErrors((prev) => ({ ...prev, [field]: found }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validateContact({ ...formData, consent });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Take the visitor to the first field that needs a fix, once the errors are drawn.
      setTimeout(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(), 0);
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          consent,
          company,
          startedAt: openedAt.current,
          page: `${place} - ${window.location.pathname}`,
        }),
      });
      if (response.status === 429) {
        setStatus("tooMany");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      setFormData(emptyForm);
      setConsent(false);
      reachGoal(GOALS.formSent, { place, service: formData.service || "none" });
      onSent?.();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 sm:space-y-6"
      // Focus bubbles up to the form: the first field the visitor enters counts
      // as starting the form (once per open form).
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        reachGoal(GOALS.formStart, { place });
      }}
    >
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Field error={errors.name && t(`contact.errors.${errors.name}`)}>
          <input
            type="text"
            autoComplete="name"
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
            autoComplete="email"
            placeholder={t("contact.emailPlaceholder")}
            aria-label={t("contact.emailPlaceholder")}
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => checkField("email")}
            aria-invalid={Boolean(errors.email || errors.contact)}
            className={fieldClass(Boolean(errors.email || errors.contact))}
          />
        </Field>
      </div>
      {/* The "email or phone" message sits here, under the second of the two. */}
      <Field
        error={
          errors.phone
            ? t(`contact.errors.${errors.phone}`)
            : errors.contact && t(`contact.errors.${errors.contact}`)
        }
      >
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          // A sample in the shape people write a number, with the studio's own: it
          // shows the format and the number sticks. The name read out stays "or phone".
          placeholder={PHONE}
          aria-label={t("contact.phonePlaceholder")}
          value={formData.phone}
          onChange={(e) => update("phone", e.target.value)}
          onBlur={() => checkField("phone")}
          aria-invalid={Boolean(errors.phone || errors.contact)}
          className={fieldClass(Boolean(errors.phone || errors.contact))}
        />
      </Field>
      <Select
        value={formData.service}
        onChange={(value) => update("service", value)}
        options={topics}
        placeholder={t("contact.topicPlaceholder")}
        label={t("contact.topicLabel")}
        className={fieldClass(false)}
      />
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
      {/* Required consent. The real checkbox is hidden but stays the control
          (keyboard, screen readers); the box next to it is drawn in the site's style. */}
      <div className="text-left">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-400">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
            }}
            aria-invalid={Boolean(errors.consent)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white/60 peer-checked:border-transparent peer-checked:bg-origin-border peer-checked:bg-linear-to-br peer-checked:from-cyan-400 peer-checked:via-violet-500 peer-checked:to-fuchsia-500 peer-checked:[&>svg]:opacity-100 ${
              errors.consent ? "border-rose-500/70 bg-rose-500/10" : "border-white/25 bg-black/30"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 5 5 9-10" />
            </svg>
          </span>
          <span>
            <Trans
              i18nKey="contact.consent"
              components={{
                policy: (
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 underline underline-offset-2 transition-colors hover:text-white"
                  />
                ),
              }}
            />
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 pl-1 text-sm text-rose-400">{t(`contact.errors.${errors.consent}`)}</p>
        )}
      </div>
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
      {/* Not everyone likes forms: the same people can be reached directly. */}
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-400">
        <span>{t("contact.orWrite")}</span>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-white">
          Telegram
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-white">
          WhatsApp
        </a>
        <a href={PHONE_URL} className="underline underline-offset-4 transition-colors hover:text-white">
          {PHONE}
        </a>
      </p>
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
  );
}
