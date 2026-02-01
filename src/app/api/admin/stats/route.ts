import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint admin: estadísticas generales del sistema
export async function GET(req: Request) {
  try {
    // Verificar usuario admin
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // =========================
    // USUARIOS
    // =========================
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({
      where: { isPremium: true },
    });
    const adminUsers = await prisma.user.count({
  where: { role: "ADMIN" },
    });

    // =========================
    // PRODUCTOS
    // =========================
    const totalProducts = await prisma.product.count();
    const privateProducts = await prisma.product.count({
      where: { userId: { not: null } },
    });

    // =========================
    // PRODUCTOS MÁS AÑADIDOS
    // =========================
    const topProducts = await prisma.shoppingListItem.groupBy({
      by: ["productId"],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      take: 5,
    });

    // Obtener nombre del producto
    const productIds = topProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const topProductsResult = topProducts.map((tp) => ({
      name: products.find((p) => p.id === tp.productId)?.name ?? "Unknown",
      count: tp._count.productId,
    }));

    // =========================
    // CATEGORÍAS MÁS USADAS
    // =========================
    const topCategories = await prisma.shoppingListItem.groupBy({
      by: ["productId"],
      _count: {
        productId: true,
      },
    });

    const categoryUsage: Record<number, number> = {};

    for (const item of topCategories) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { categoryId: true },
      });

      if (product) {
        categoryUsage[product.categoryId] =
          (categoryUsage[product.categoryId] ?? 0) +
          item._count.productId;
      }
    }

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const topCategoriesResult = Object.entries(categoryUsage)
      .map(([categoryId, count]) => ({
        name:
          categories.find((c) => c.id === Number(categoryId))?.name ??
          "Unknown",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

// =========================
    // SUPERMERCADOS
    // =========================
      const supermarkets = await prisma.supermarket.findMany({
  select: {
    id: true,
    name: true,
    createdAt: true,
    user: {
      select: {
        email: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});


    // =========================
    // RESPUESTA FINAL
    // =========================
    return NextResponse.json({
      users: {
        total: totalUsers,
        premium: premiumUsers,
        admin: adminUsers,
        free: totalUsers - premiumUsers - adminUsers,
      },
      products: {
        total: totalProducts,
        global: totalProducts - privateProducts,
        private: privateProducts,
      },
      topProducts: topProductsResult,
      topCategories: topCategoriesResult,
      supermarkets,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
