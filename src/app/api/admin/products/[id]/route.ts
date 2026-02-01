import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 🔑 AWAIT params (CLAVE)
    const { id } = await context.params;

    const productId = parseInt(id, 10);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    // 1️⃣ Borrar referencias en listas
    await prisma.shoppingListItem.deleteMany({
      where: {
        productId,
      },
    });

    // 2️⃣ Borrar el producto
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
