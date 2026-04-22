import mysql, { type Pool } from "mysql2/promise";

declare global {
  var __didasko_pool__: Pool | undefined;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDbPool() {
  if (global.__didasko_pool__) {
    return global.__didasko_pool__;
  }

  const pool = mysql.createPool({
    host: requiredEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? "3306"),
    user: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASSWORD"),
    database: requiredEnv("DB_NAME"),
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: true,
    charset: "utf8mb4",
  });

  global.__didasko_pool__ = pool;
  return pool;
}
