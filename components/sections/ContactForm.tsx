"use client";

import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>): Errors {
  const e: Errors = {};
  if (values.name.trim().length < 2) e.name = "Tell me who you are (2+ characters).";
  if (!EMAIL.test(values.email)) e.email = "That doesn't look like an email.";
  if (values.message.trim().length < 20) e.message = "A little more detail helps — 20+ characters.";
  return e;
}

/** Inline-validated form. POSTs to /api/contact (TODO: wire a provider there). */
export function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const errors = validate(values);
  const show = (f: Field) => touched[f] && errors[f];

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      // No summary block on a 3-field form → focus the first invalid field.
      const first = (["name", "email", "message"] as Field[]).find((f) => errors[f]);
      (ev.currentTarget.elements.namedItem(first!) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website: (ev.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value ?? "" }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const field = (f: Field) =>
    cn(
      "field w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-fg placeholder:text-fg-subtle focus:outline-none",
      show(f) ? "border-danger/70" : "border-line-strong",
    );

  if (status === "sent") {
    return (
      <p role="status" className="rule pt-6 text-fg">
        Thanks — got it. I&apos;ll reply to <span className="text-accent">{values.email}</span>.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5" aria-describedby={status === "error" ? `${id}-err` : undefined}>
      <p className="text-xs text-fg-subtle">All fields are required.</p>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <Label id={`${id}-name`} label="Name" error={show("name") ? errors.name : undefined}>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            className={field("name")}
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            onBlur={() => setTouched({ ...touched, name: true })}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? `${id}-name-err` : undefined}
          />
        </Label>
        <Label id={`${id}-email`} label="Email" error={show("email") ? errors.email : undefined}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={field("email")}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            aria-invalid={!!show("email")}
            aria-describedby={show("email") ? `${id}-email-err` : undefined}
          />
        </Label>
      </div>
      <Label id={`${id}-message`} label="What are you building?" error={show("message") ? errors.message : undefined}>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          className={cn(field("message"), "resize-y")}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          onBlur={() => setTouched({ ...touched, message: true })}
          aria-invalid={!!show("message")}
          aria-describedby={show("message") ? `${id}-message-err` : undefined}
        />
      </Label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="pill disabled:opacity-60"
        >
          <span>{status === "sending" ? "Sending…" : "Send message"}</span>
        </button>
        {status === "error" && (
          <p id={`${id}-err`} role="alert" className="text-sm text-danger">
            Couldn&apos;t send. Email me directly instead.
          </p>
        )}
      </div>
    </form>
  );
}

function Label({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-fg-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
