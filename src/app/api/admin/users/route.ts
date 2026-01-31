import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint admin: listar usuarios con métricas básicas
export async function GET(req: Request) {
  try {
    // Obtener usuario autenticado
    const user = await getUserFromRequest(req);

    // Bloquear si no está autenticado o no es admin
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Leer query params opcionales (búsqueda por email)
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    // Listar usuarios con contadores útiles para el panel
    const users = await prisma.user.findMany({
      where: q
        ? {
            email: {
              contains: q,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { registrationDate: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true,
        registrationDate: true,
        _count: {
          select: {
            shoppingLists: true,
            supermarkets: true,
            products: true, // productos privados creados por el usuario
          },
        },
      },
      take: 200,
    });

    // Formatear respuesta para el frontend (más cómodo)
    const result = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isPremium: u.isPremium,
      registrationDate: u.registrationDate,
      listsCount: u._count.shoppingLists,
      supermarketsCount: u._count.supermarkets,
      privateProductsCount: u._count.products,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin list users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
