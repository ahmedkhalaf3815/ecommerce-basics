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
  console.log(
    "Current keys available:",
    Object.keys(process.env).filter(
      (k) => k.includes("URL") || k.includes("DATABASE"),
    ),
  );
} else {
  const foundVar = process.env.DATABASE_URL
    ? "DATABASE_URL"
    : process.env.POSTGRES_URL
      ? "POSTGRES_URL"
      : "POSTGRES_PRISMA_URL";
  console.log(`✅ ${foundVar} is defined (length: ${connectionString.length})`);
}

const pool = new Pool({
  connectionString:
    connectionString ||
    "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
});
const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
export default prisma;
