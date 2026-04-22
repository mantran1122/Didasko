import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

declare global {
  var __didasko_pool__: Pool | undefined;
}

function getEnv(primary: string, fallback?: string) {
  const primaryValue = process.env[primary];
  if (primaryValue) return primaryValue;
  if (fallback) {
    const fallbackValue = process.env[fallback];
    if (fallbackValue) return fallbackValue;
  }
  return "";
}

function requireEnv(primary: string, fallback?: string) {
  const value = getEnv(primary, fallback);
  if (!value) {
    throw new Error(`Missing required environment variable: ${primary}${fallback ? ` (or ${fallback})` : ""}`);
  }
  return value;
}

function toBool(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

function buildSslOptions(): PoolOptions["ssl"] | undefined {
  const sslMode = getEnv("MYSQL_SSL_MODE", "DB_SSL_MODE");
  const useSsl =
    sslMode === "require" ||
    sslMode === "verify-ca" ||
    sslMode === "verify-identity" ||
    toBool(process.env.DB_SSL, false);

  if (!useSsl) return undefined;

  const rejectUnauthorized = toBool(
    process.env.MYSQL_SSL_REJECT_UNAUTHORIZED ?? process.env.DB_SSL_REJECT_UNAUTHORIZED,
    true,
  );

  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized,
  };
}

export function getDbPool() {
  if (global.__didasko_pool__) {
    return global.__didasko_pool__;
  }

  const host = requireEnv("MYSQL_HOST", "DB_HOST");
  const port = Number(getEnv("MYSQL_PORT", "DB_PORT") || "3306");
  const user = requireEnv("MYSQL_USER", "DB_USER");
  const password = requireEnv("MYSQL_PASSWORD", "DB_PASSWORD");
  const database = requireEnv("MYSQL_DATABASE", "DB_NAME");

  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: true,
    charset: "utf8mb4",
    ssl: buildSslOptions(),
  });

  global.__didasko_pool__ = pool;
  return pool;
}
