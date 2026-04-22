import { getDbPool } from "@/lib/db";
import { createMailer, defaultFromAddress } from "@/lib/mailer";
import { type RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

type UserRow = RowDataPacket & {
  id: number;
  full_name: string;
  email: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = normalizeEmail(body.email ?? "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
    }

    const pool = getDbPool();
    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, full_name, email FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    const user = rows[0];
    const mailer = createMailer();
    const inboxTo = process.env.NEWSLETTER_TO || process.env.SMTP_USER;
    if (!inboxTo) {
      return NextResponse.json(
        { message: "Missing NEWSLETTER_TO or SMTP_USER configuration." },
        { status: 500 },
      );
    }

    await mailer.sendMail({
      from: defaultFromAddress(),
      to: inboxTo,
      replyTo: email,
      subject: `Newsletter subscribe: ${email}`,
      text: `New newsletter request\n\nEmail: ${email}\nName: ${user?.full_name ?? "Unknown / not registered"}\nUserId: ${user?.id ?? "N/A"}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>New newsletter request</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${user?.full_name ?? "Unknown / not registered"}</p>
          <p><strong>User ID:</strong> ${user?.id ?? "N/A"}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Subscribed successfully." });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Unable to send newsletter email.";
    const message =
      /socket close|ECONNECTION|ETIMEDOUT|greeting/i.test(rawMessage)
        ? "SMTP connection failed. Check SMTP_HOST/PORT/SECURE and account credentials."
        : rawMessage;
    return NextResponse.json({ message }, { status: 500 });
  }
}
