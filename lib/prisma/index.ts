import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | null;
};

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error("❌ CRITICAL: No database environment variables found!");
  const allEnvKeys = Object.keys(process.env);
  console.log(
    "Environment keys found (anonymized):",
    allEnvKeys.filter(
      (k) =>
        k.includes("URL") ||
        k.includes("DB") ||
        k.includes("DATABASE") ||
        k.includes("POSTGRES"),
    ),
  );
} else {
  const foundVar = process.env.DATABASE_URL
    ? "DATABASE_URL"
    : process.env.POSTGRES_URL
      ? "POSTGRES_URL"
      : "POSTGRES_PRISMA_URL";
  console.log(
    `✅ Found ${foundVar} (matching length: ${connectionString.length})`,
  );

  if (
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  ) {
    console.error(
      "⚠️ WARNING: The connection string found in Vercel contains 'localhost' or '127.0.0.1'. Did you paste your local database URL into the Vercel dashboard?",
    );
  }
}

const pool = new Pool({
  connectionString:
    connectionString ||
    "postgresql://postgres:postgres@127.0.0.1:5432/postgres", // This fallback only allows the app to load (with empty results) rather than crashing during build.
});
const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
export default prisma;
