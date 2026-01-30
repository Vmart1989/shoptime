import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para asociar una lista a un supermercado
export async function PATCH(req: Request) {
  // Usuario autenticado
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer listId desde la URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const listId = Number(segments[3]);

  if (isNaN(listId)) {
    return NextResponse.json(
      { error: "Invalid list id" },
      { status: 400 }
    );
  }

  // Verificar que la lista pertenece al usuario
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: listId,
      userId: user.id,
    },
  });

  if (!list) {
    return NextResponse.json(
      { error: "List not found" },
      { status: 404 }
    );
  }

  // Leer supermercado desde el body
  const body = await req.json();
  const { supermarketId } = body;

  // Si se quiere quitar el supermercado
  if (supermarketId === null) {
    const updatedList = await prisma.shoppingList.update({
      where: { id: listId },
      data: { supermarketId: null },
    });

    return NextResponse.json(updatedList);
  }

  // Validar supermarketId
  if (typeof supermarketId !== "number") {
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

  // Asociar supermercado a la lista
  const updatedList = await prisma.shoppingList.update({
    where: { id: listId },
    data: { supermarketId },
  });

  return NextResponse.json(updatedList);
}
