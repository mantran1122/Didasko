import { loginUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const user = await loginUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    return NextResponse.json({
      message: "Login successful.",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";
    return NextResponse.json({ message }, { status: 401 });
  }
}
