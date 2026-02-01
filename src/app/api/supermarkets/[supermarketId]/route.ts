import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// =========================
// OBTENER SUPERMERCADO
// =========================
export async function GET(
  req: Request,
  context: { params: Promise<{ supermarketId: string }> }
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { supermarketId } = await context.params;
  const id = parseInt(supermarketId, 10);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid supermarket id" }, { status: 400 });
  }

  const supermarket = await prisma.supermarket.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!supermarket) {
    return NextResponse.json({ error: "Supermarket not found" }, { status: 404 });
  }

  return NextResponse.json(supermarket);
}

// =========================
// EDITAR SUPERMERCADO
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ supermarketId: string }> }
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.isPremium) {
    return NextResponse.json({ error: "Premium feature" }, { status: 403 });
  }

  const { supermarketId } = await context.params;
  const id = parseInt(supermarketId, 10);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid supermarket id" }, { status: 400 });
  }

  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supermarket = await prisma.supermarket.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!supermarket) {
    return NextResponse.json({ error: "Supermarket not found" }, { status: 404 });
  }

  const updated = await prisma.supermarket.update({
    where: { id },
    data: {
      name,
      description: description ?? null,
    },
  });

  return NextResponse.json(updated);
}

// =========================
// ELIMINAR SUPERMERCADO
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ supermarketId: string }> }
) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supermarketId } = await context.params;
    const id = parseInt(supermarketId, 10);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid supermarket id" }, { status: 400 });
    }

    const supermarket = await prisma.supermarket.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!supermarket) {
      return NextResponse.json({ error: "Supermarket not found" }, { status: 404 });
    }

    // 1️⃣ Borrar items de listas
    const lists = await prisma.shoppingList.findMany({
      where: { supermarketId: id },
      select: { id: true },
    });

    const listIds = lists.map((l) => l.id);

    if (listIds.length > 0) {
      await prisma.shoppingListItem.deleteMany({
        where: {
          shoppingListId: { in: listIds },
        },
      });
    }

    // 2️⃣ Borrar listas
    await prisma.shoppingList.deleteMany({
      where: { supermarketId: id },
    });

    // 3️⃣ Borrar orden de categorías
    await prisma.supermarketCategory.deleteMany({
      where: { supermarketId: id },
    });

    // 4️⃣ Borrar supermercado
    await prisma.supermarket.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete supermarket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
