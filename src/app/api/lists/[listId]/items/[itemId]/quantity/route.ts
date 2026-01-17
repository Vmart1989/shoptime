import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para actualizar la cantidad de un producto de la lista
export async function PATCH(req: Request) {
  // Obtener usuario autenticado
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extraer IDs desde la URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  const listId = Number(segments[3]);
  const itemId = Number(segments[5]);

  if (isNaN(listId) || isNaN(itemId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Verificar que la lista pertenece al usuario
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: listId,
      userId: user.id,
    },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  // Leer nueva cantidad
  const body = await req.json();
  const { quantity } = body;

  if (typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json(
      { error: "Quantity must be >= 1" },
      { status: 400 }
    );
  }

  // Actualizar cantidad
  const updatedItem = await prisma.shoppingListItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return NextResponse.json(updatedItem);
}
