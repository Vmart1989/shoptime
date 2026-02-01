import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";
import { prisma } from "@/server/db/prisma";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Métricas del usuario
  const [listsCount, supermarketsCount] = await Promise.all([
    prisma.shoppingList.count({
      where: { userId: user.id },
    }),
    prisma.supermarket.count({
      where: { userId: user.id },
    }),
  ]);

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isPremium: user.isPremium,
    role: user.role,
    registrationDate: user.registrationDate,
    listsCount,
    supermarketsCount,
  });
}
