import { upsertGoogleUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
    };

    const user = await upsertGoogleUser({
      fullName: body.fullName ?? "",
      email: body.email ?? "",
    });

    return NextResponse.json({
      message: "Google login successful.",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login with Google.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
