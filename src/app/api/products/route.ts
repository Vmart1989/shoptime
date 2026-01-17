import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

// Endpoint para buscar productos del catálogo global (autocomplete)
export async function GET(req: Request) {
  try {
    // Obtener la URL de la request para leer los query params
    const { searchParams } = new URL(req.url);

    // Obtener el parámetro "search" (?search=lec)
    const search = searchParams.get("search");

    // Si no hay texto de búsqueda, devolvemos array vacío
    // (evita devolver todo el catálogo por error)
    if (!search || search.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Buscar productos cuyo nombre contenga el texto introducido
    const products = await prisma.product.findMany({
      where: {
        name: {
          startsWith: search, // Coincidencia por prefijo
          mode: "insensitive", // Búsqueda sin distinguir mayúsculas/minúsculas
        },
      },
      // Limitar resultados para que el autocomplete sea rápido
      take: 10,
      // Incluir la categoría para mostrarla en el frontend si se desea
      include: {
        category: true,
      },
      // Ordenar alfabéticamente para resultados más previsibles
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
