import { NextResponse } from "next/server";

/**
 * Contact endpoint. Validates and (TODO) forwards to your provider —
 * Resend / Postmark / a Slack webhook / Formspree. Until then it logs on the
 * server and returns 200 so the form's success state can be exercised.
 */
export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot filled → pretend success

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 20) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  // TODO: send it somewhere. Example with Resend:
  // await resend.emails.send({ from: "site@yourdomain", to: site.email, subject: `Portfolio: ${name}`, text: `${email}\n\n${message}` });
  console.log("[contact]", { name, email, message: message.slice(0, 200) });
  return NextResponse.json({ ok: true });
}
