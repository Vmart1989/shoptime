import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { coupon } = await req.json();

  // =========================
  // VALIDACIÓN DE CUPÓN
  // =========================
  const rawCoupons = process.env.PREMIUM_COUPONS || "";
  const validCoupons = rawCoupons
    .split(",")
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  if (coupon) {
    if (!validCoupons.includes(coupon.toUpperCase())) {
      return NextResponse.json(
        { error: "Cupón incorrecto" },
        { status: 400 }
      );
    }
  }

  // =========================
  // FECHAS DE SUSCRIPCIÓN
  // =========================
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  try {
    // 1️⃣ Marcar usuario como premium
    await prisma.user.update({
      where: { id: user.id },
      data: { isPremium: true },
    });

    // 2️⃣ Desactivar suscripciones activas anteriores
    await prisma.subscription.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // 3️⃣ Crear nueva suscripción PREMIUM
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planType: "PREMIUM",
        startDate,
        endDate,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activate premium error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
