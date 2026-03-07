import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Category Seeding
  try {
    const categoriesPath = path.join(__dirname, "categories.json");
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));

      for (const category of categories) {
        const exisiting = await prisma.category.findFirst({
          where: { slug: category.slug },
        });

        if (!exisiting) {
          const p = await prisma.category.create({
            data: category,
          });
          console.log(`Created category: ${category.name}`);
        } else {
          console.log(`skipping exists category: ${category.name}`);
        }
      }
    }
  } catch (error) {
    console.log("error fetching categories", error);
  }

  // Products Seeding
  try {
    const productsPath = path.join(__dirname, "products.json");
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

      for (const product of products) {
        const exisiting = await prisma.product.findFirst({
          where: { name: product.name },
        });

        if (!exisiting) {
          const p = await prisma.product.create({
            data: product,
          });
          console.log(`Created product with id ${p.id}`);
        } else {
          console.log(`skipping exists Product: ${product.name}`);
        }
      }
    }
  } catch (error) {
    console.log("error fetching products", error);
  }

  console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
