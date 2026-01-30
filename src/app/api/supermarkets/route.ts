import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para crear un supermercado (solo usuarios premium)
export async function POST(req: Request) {
  // Obtener usuario autenticado desde el JWT
  const user = await getUserFromRequest(req);

  // Bloquear si no está autenticado
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Bloquear si el usuario no es premium
  if (!user.isPremium) {
    return NextResponse.json(
      { error: "Premium feature" },
      { status: 403 }
    );
  }

  // Leer datos del body
  const body = await req.json();
  const { name, description } = body;

  // Validar datos mínimos
  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  // Crear supermercado asociado al usuario
  const supermarket = await prisma.supermarket.create({
    data: {
      name,
      description: description ?? null,
      userId: user.id,
    },
  });

  // Devolver el supermercado creado
  return NextResponse.json(supermarket, { status: 201 });
}
