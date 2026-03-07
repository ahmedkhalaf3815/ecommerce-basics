import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | null;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "CRITICAL: DATABASE_URL is missing at runtime! Falling back to localhost (this will fail on Vercel).",
  );
}

const pool = new Pool({
  connectionString:
    connectionString ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
});
const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
export default prisma;
