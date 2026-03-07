import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/prisma";
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { email, fristName, lastName, username } = body;

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  try {
    await db.user.upsert({
      where: { id: userId },

      update: {
        email,
        fristName,
        lastName,
        username,
      },
      create: {
        id: userId,
        email,
        fristName,
        lastName,
        username,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_SYNC]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
