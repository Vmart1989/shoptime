import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para autocomplete de productos
// Devuelve productos globales + productos privados del usuario
export async function GET(req: Request) {
  try {
    // Obtener usuario autenticado
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Leer query params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    // Evitar búsquedas demasiado cortas
    if (!search || search.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Buscar productos visibles para este usuario
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { userId: null },     // Productos globales
              { userId: user.id },  // Productos privados del usuario
            ],
          },
          {
            name: {
              startsWith: search,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 10,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product autocomplete error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
