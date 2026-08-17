import { NextResponse } from "next/server";
import { Resend } from "resend";
import { HERO_CONTENT } from "@/lib/config/site";

// Reads the key from the environment at request time rather than at
// module scope with a fallback — if RESEND_API_KEY isn't set, calls
// below fail loudly instead of silently trying to send with `undefined`.
const resend = new Resend(process.env.RESEND_API_KEY);

// HERO_CONTENT.emailHref is "mailto:you@example.com" — this is where
// every submission lands, regardless of what the sender typed.
const TO_ADDRESS = HERO_CONTENT.emailHref.replace(/^mailto:/, "");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Email sending isn't configured yet." },
      { status: 500 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 },
    );
  }

  // Loose but sufficient — this isn't the authoritative check, just a
  // guard against obviously-malformed input before it hits Resend.
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!looksLikeEmail) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  try {
    const { error } = await resend.emails.send({
      // Resend's shared sending domain — swap this for a verified
      // domain address (e.g. "Portfolio <hello@yourdomain.com>") once
      // one is set up in the Resend dashboard.
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send-email route error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
