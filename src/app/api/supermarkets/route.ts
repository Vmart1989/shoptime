import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// =========================
// CREAR SUPERMERCADO (PREMIUM)
// =========================
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
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  // 1️⃣ Crear supermercado
  const supermarket = await prisma.supermarket.create({
    data: {
      name,
      description: description ?? null,
      userId: user.id,
    },
  });

  // 2️⃣ Obtener categorías globales
  const categories = await prisma.category.findMany({
    orderBy: {
      defaultOrder: "asc",
    },
  });

  // 3️⃣ Crear orden inicial del supermercado
  await prisma.supermarketCategory.createMany({
    data: categories.map((cat) => ({
      supermarketId: supermarket.id,
      categoryId: cat.id,
      aisleOrder: cat.defaultOrder,
    })),
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
