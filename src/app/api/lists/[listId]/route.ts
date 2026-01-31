import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para obtener los datos de una lista concreta
export async function GET(req: Request) {
  // Obtener usuario autenticado
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

  // Buscar la lista y verificar que pertenece al usuario
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: listId,
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      supermarketId: true,
    },
  });

  if (!list) {
    return NextResponse.json(
      { error: "List not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(list);
}
