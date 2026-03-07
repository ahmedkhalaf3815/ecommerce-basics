import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook signature verification failed.", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;
    if (!metadata?.userId || !metadata?.cartId) {
      return new NextResponse("Webhook Error: Missing metadata", {
        status: 400,
      });
    }

    try {
      // 1. Get cart items to convert to order items
      const cartItems = await prisma.cartItem.findMany({
        where: { cartId: metadata.cartId },
        include: { product: true },
      });

      if (cartItems.length > 0) {
        // 2. Create Order
        await prisma.order.create({
          data: {
            clerkUserId: metadata.userId,
            status: "PENDING",
            totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            stripeSessionId: session.id,
            orderItems: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });

        // 3. Clear cart
        await prisma.cartItem.deleteMany({
          where: { cartId: metadata.cartId },
        });

        console.log(
          `Order created and cart cleared for User: ${metadata.userId}`,
        );
      }
    } catch (error) {
      console.error("Error creating order from webhook:", error);
      return new NextResponse("Webhook Error: DB Operation failed", {
        status: 500,
      });
    }
  } else {
    console.warn(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse("OK", { status: 200 });
}
