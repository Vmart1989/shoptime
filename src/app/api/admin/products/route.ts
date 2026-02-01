import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// =========================
// ADMIN - PRODUCTOS
// =========================
export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin"); 
    // origin = "global" | "user" | null

    const where: any = {};

    if (origin === "global") {
      where.userId = null;
    }

    if (origin === "user") {
      where.userId = { not: null };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// =========================
// CREAR PRODUCTO GLOBAL
// =========================
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        categoryId,
        userId: null, // 🔹 GLOBAL
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Create global product error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Producto ya existe en esta categoría" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
