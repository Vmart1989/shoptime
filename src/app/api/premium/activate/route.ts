import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { coupon } = await req.json();

  const rawCoupons = process.env.PREMIUM_COUPONS || "";
  const validCoupons = rawCoupons
    .split(",")
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  if (coupon) {
    if (!validCoupons.includes(coupon.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid coupon" },
        { status: 400 }
      );
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isPremium: true },
  });

  return NextResponse.json({ success: true });
}
