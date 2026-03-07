"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123", {
  apiVersion: "2026-01-28.clover", // Latest API version
});

export async function createCheckoutSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const cart = await prisma.cart.findUnique({
    where: { clerkUserId: userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: [item.product.image],
      },
      unit_amount: Math.round(Number(item.product.price) * 100), // Stripe expects cents
    },
    quantity: item.quantity,
    // 10.50 دولار.
    // 1050
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
    metadata: {
      userId: userId,
      cartId: cart.id,
    },
  });

  return { url: session.url };
}

import { revalidatePath } from "next/cache";

export async function verifyCheckoutSession(sessionId: string) {
  const { userId } = await auth();
  if (!userId) {
    console.error("[verifyCheckoutSession] Unauthorized - no userId");
    throw new Error("Unauthorized");
  }

  try {
    console.log(`[verifyCheckoutSession] Retrieving session: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(
      `[verifyCheckoutSession] Payment status: ${session.payment_status}, Metadata:`,
      session.metadata,
    );

    if (session.payment_status === "paid" && session.metadata?.cartId) {
      console.log(
        `[verifyCheckoutSession] Deleting cart items for cartId: ${session.metadata.cartId}`,
      );
      const deleteResult = await prisma.cartItem.deleteMany({
        where: { cartId: session.metadata.cartId },
      });
      console.log(
        `[verifyCheckoutSession] Deleted ${deleteResult.count} items`,
      );
      revalidatePath("/");
      return { success: true };
    } else {
      console.log(
        `[verifyCheckoutSession] Conditions not met. Payment status: ${session.payment_status}, CartId: ${session.metadata?.cartId}`,
      );
    }
  } catch (error) {
    console.error("[verifyCheckoutSession] Error verifying session:", error);
  }
  return { success: false };
}
