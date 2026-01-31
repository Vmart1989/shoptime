import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// =========================
// OBTENER CATEGORÍAS + ORDEN
// =========================
export async function GET(req: Request) {
  // Obtener usuario autenticado
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer supermarketId desde la URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const supermarketId = Number(segments[3]);

  if (isNaN(supermarketId)) {
    return NextResponse.json(
      { error: "Invalid supermarket id" },
      { status: 400 }
    );
  }

  // Verificar que el supermercado pertenece al usuario
  const supermarket = await prisma.supermarket.findFirst({
    where: {
      id: supermarketId,
      userId: user.id,
    },
  });

  if (!supermarket) {
    return NextResponse.json(
      { error: "Supermarket not found" },
      { status: 404 }
    );
  }

  // Obtener todas las categorías (orden global)
  const categories = await prisma.category.findMany({
    orderBy: {
      defaultOrder: "asc",
    },
  });

  // Obtener el orden personalizado del supermercado
  const supermarketCategories =
    await prisma.supermarketCategory.findMany({
      where: {
        supermarketId,
      },
    });

  // Crear mapa categoryId -> aisleOrder
  const orderMap: Record<number, number> = {};
  supermarketCategories.forEach((sc) => {
    orderMap[sc.categoryId] = sc.aisleOrder;
  });

  // Combinar categorías + orden personalizado
  const result = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    aisleOrder: orderMap[cat.id] ?? null,
  }));

  return NextResponse.json(result);
}

// =========================
// GUARDAR ORDEN DE CATEGORÍAS (PREMIUM)
// =========================
export async function PUT(req: Request) {
  // Obtener usuario autenticado
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Bloquear si no es premium
  if (!user.isPremium) {
    return NextResponse.json(
      { error: "Premium feature" },
      { status: 403 }
    );
  }

  // Extraer supermarketId desde la URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const supermarketId = Number(segments[3]);

  if (isNaN(supermarketId)) {
    return NextResponse.json(
      { error: "Invalid supermarket id" },
      { status: 400 }
    );
  }

  // Verificar que el supermercado pertenece al usuario
  const supermarket = await prisma.supermarket.findFirst({
    where: {
      id: supermarketId,
      userId: user.id,
    },
  });

  if (!supermarket) {
    return NextResponse.json(
      { error: "Supermarket not found" },
      { status: 404 }
    );
  }

  // Leer el nuevo orden de categorías
  const categories = await req.json();

  if (!Array.isArray(categories)) {
    return NextResponse.json(
      { error: "Invalid body format" },
      { status: 400 }
    );
  }

  // Limpiar orden anterior
  await prisma.supermarketCategory.deleteMany({
    where: {
      supermarketId,
    },
  });

  // Insertar nuevo orden
  const data = categories.map((c: any) => ({
    supermarketId,
    categoryId: c.categoryId,
    aisleOrder: c.aisleOrder,
  }));

  await prisma.supermarketCategory.createMany({
    data,
  });

  return NextResponse.json({ success: true });
}
