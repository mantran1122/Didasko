import { registerUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if ((body.password ?? "") !== (body.confirmPassword ?? "")) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
    }

    const user = await registerUser({
      fullName: body.fullName ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
