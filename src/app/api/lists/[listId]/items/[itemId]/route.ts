import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para marcar o desmarcar un producto como comprado
export async function PATCH(req: Request) {
  // Obtener el usuario autenticado a partir del token JWT
  const user = await getUserFromRequest(req);

  // Bloquear el acceso si no hay usuario autenticado
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer los ids desde la URL
  // URL esperada: /api/lists/{listId}/items/{itemId}
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  const listId = Number(segments[3]);
  const itemId = Number(segments[5]);

  // Validar que ambos ids sean números válidos
  if (isNaN(listId) || isNaN(itemId)) {
    return NextResponse.json(
      { error: "Invalid id" },
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

  // Verificar que el item pertenece a esa lista
  const item = await prisma.shoppingListItem.findFirst({
    where: {
      id: itemId,
      shoppingListId: listId,
    },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  // Leer el body para saber el nuevo estado
  const body = await req.json();
  const { isChecked } = body;

  // Validar que isChecked sea boolean
  if (typeof isChecked !== "boolean") {
    return NextResponse.json(
      { error: "isChecked must be boolean" },
      { status: 400 }
    );
  }

  // Actualizar el estado del item
  const updatedItem = await prisma.shoppingListItem.update({
    where: {
      id: itemId,
    },
    data: {
      isChecked,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  // Devolver el item actualizado
  return NextResponse.json(updatedItem);
}

// Endpoint para eliminar un producto de una lista
export async function DELETE(req: Request) {
  // Obtener el usuario autenticado a partir del token JWT
  const user = await getUserFromRequest(req);

  // Bloquear el acceso si no hay usuario autenticado
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer los ids desde la URL
  // URL esperada: /api/lists/{listId}/items/{itemId}
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  const listId = Number(segments[3]);
  const itemId = Number(segments[5]);

  // Validar que ambos ids sean números válidos
  if (isNaN(listId) || isNaN(itemId)) {
    return NextResponse.json(
      { error: "Invalid id" },
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

  // Verificar que el item pertenece a esa lista
  const item = await prisma.shoppingListItem.findFirst({
    where: {
      id: itemId,
      shoppingListId: listId,
    },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  // Eliminar el item de la lista
  await prisma.shoppingListItem.delete({
    where: {
      id: itemId,
    },
  });

  // Respuesta sin contenido (operación correcta)
  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}