import { getDbPool } from "@/lib/db";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

type UserRole = "student" | "teacher" | "admin";

type AdminCheckRow = RowDataPacket & {
  id: number;
  role: UserRole;
};

type UserRow = RowDataPacket & {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
};

async function requireAdmin(emailHeader: string | null) {
  const email = emailHeader?.trim().toLowerCase();
  if (!email) {
    return { error: NextResponse.json({ message: "Missing user email." }, { status: 401 }) };
  }

  const pool = getDbPool();
  const [rows] = await pool.query<AdminCheckRow[]>(
    "SELECT id, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
    [email],
  );

  if (!rows.length || rows[0].role !== "admin") {
    return { error: NextResponse.json({ message: "Admin access required." }, { status: 403 }) };
  }

  return { viewer: rows[0] };
}

function normalizeUser(row: UserRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const check = await requireAdmin(request.headers.get("x-user-email"));
    if ("error" in check) return check.error;

    const { id } = await context.params;
    const userId = Number(id);
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
    }

    const body = (await request.json()) as { role?: UserRole; isActive?: boolean };
    const nextRole = body.role;
    const nextActive = body.isActive;

    if (nextRole && !["student", "teacher", "admin"].includes(nextRole)) {
      return NextResponse.json({ message: "Invalid role value." }, { status: 400 });
    }

    if (typeof nextActive !== "boolean" && !nextRole) {
      return NextResponse.json({ message: "No valid updates provided." }, { status: 400 });
    }

    if (userId === check.viewer.id) {
      if (nextRole && nextRole !== "admin") {
        return NextResponse.json({ message: "You cannot remove your own admin role." }, { status: 400 });
      }
      if (nextActive === false) {
        return NextResponse.json({ message: "You cannot lock your own account." }, { status: 400 });
      }
    }

    const pool = getDbPool();
    const updates: string[] = [];
    const values: Array<string | number> = [];

    if (nextRole) {
      updates.push("role = ?");
      values.push(nextRole);
    }
    if (typeof nextActive === "boolean") {
      updates.push("is_active = ?");
      values.push(nextActive ? 1 : 0);
    }

    values.push(userId);

    const [updateResult] = await pool.query<ResultSetHeader>(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if (!updateResult.affectedRows) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, full_name, email, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    return NextResponse.json({ user: normalizeUser(rows[0]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update user.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const check = await requireAdmin(request.headers.get("x-user-email"));
    if ("error" in check) return check.error;

    const { id } = await context.params;
    const userId = Number(id);
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
    }

    if (userId === check.viewer.id) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
    }

    const pool = getDbPool();
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [userId]);
    if (!result.affectedRows) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete user.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
