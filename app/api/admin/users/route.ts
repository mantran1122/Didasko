import { getDbPool } from "@/lib/db";
import { type RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

type AdminCheckRow = RowDataPacket & {
  id: number;
  role: "student" | "teacher" | "admin";
};

type UserRow = RowDataPacket & {
  id: number;
  full_name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  is_active: number;
  created_at: string;
};

export async function GET(request: Request) {
  try {
    const pool = getDbPool();
    const email = request.headers.get("x-user-email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "Missing user email." }, { status: 401 });
    }

    const [adminRows] = await pool.query<AdminCheckRow[]>(
      "SELECT id, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
      [email],
    );

    if (!adminRows.length || adminRows[0].role !== "admin") {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }

    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 200",
    );

    return NextResponse.json({
      users: rows.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch users.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
