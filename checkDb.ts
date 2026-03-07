import { config } from "dotenv";
config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allOrders = await prisma.order.findMany({
    include: { orderItems: true },
  });
  console.log("Total orders in DB:", allOrders.length);
  if (allOrders.length > 0) {
    console.log("Sample order:", JSON.stringify(allOrders[0], null, 2));
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
