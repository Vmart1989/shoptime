import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// =========================
// CREAR SUPERMERCADO (PREMIUM)
// =========================
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.isPremium) {
    return NextResponse.json({ error: "Premium feature" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supermarket = await prisma.supermarket.create({
    data: {
      name,
      description: description ?? null,
      userId: user.id,
    },
  });

  return NextResponse.json(supermarket, { status: 201 });
}

// =========================
// LISTAR SUPERMERCADOS DEL USUARIO
// =========================
export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supermarkets = await prisma.supermarket.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // ⚠️ SIEMPRE devolvemos JSON, aunque esté vacío
  return NextResponse.json(supermarkets);
}
