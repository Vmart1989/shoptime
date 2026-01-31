import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para obtener las categorías globales
export async function GET(req: Request) {
  try {
    // Obtener usuario autenticado
    const user = await getUserFromRequest(req);

    // Bloquear si no está autenticado
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Obtener todas las categorías globales
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        defaultOrder: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
