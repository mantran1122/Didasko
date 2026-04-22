import { compare, hash } from "bcryptjs";
import { getDbPool } from "@/lib/db";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { randomUUID } from "crypto";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: "student" | "teacher" | "admin";
};

type UserRow = RowDataPacket & {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: "student" | "teacher" | "admin";
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
  };
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
}) {
  const pool = getDbPool();
  const fullName = input.fullName.trim();
  const email = normalizeEmail(input.email);

  if (!fullName || fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email is invalid.");
  }

  if (!input.password || input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const [existingRows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (existingRows.length > 0) {
    throw new Error("Email already exists.");
  }

  const passwordHash = await hash(input.password, 10);

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (full_name, email, password_hash, role, email_verified, is_active) VALUES (?, ?, ?, 'student', 0, 1)",
    [fullName, email, passwordHash],
  );

  return {
    id: result.insertId,
    fullName,
    email,
    role: "student" as const,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const pool = getDbPool();
  const email = normalizeEmail(input.email);

  if (!email || !input.password) {
    throw new Error("Email and password are required.");
  }

  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
    [email],
  );

  if (!rows.length) {
    throw new Error("Invalid email or password.");
  }

  const valid = await compare(input.password, rows[0].password_hash);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  return mapUser(rows[0]);
}

export async function upsertGoogleUser(input: { fullName: string; email: string }) {
  const pool = getDbPool();
  const fullName = input.fullName.trim();
  const email = normalizeEmail(input.email);

  if (!fullName || fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters.");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email is invalid.");
  }

  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (rows.length) {
    return mapUser(rows[0]);
  }

  const randomPassword = randomUUID();
  const passwordHash = await hash(randomPassword, 10);

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (full_name, email, password_hash, role, email_verified, is_active) VALUES (?, ?, ?, 'student', 1, 1)",
    [fullName, email, passwordHash],
  );

  return {
    id: result.insertId,
    fullName,
    email,
    role: "student" as const,
  };
}
