import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint para añadir un producto a una lista concreta
export async function POST(req: Request) {
  // Obtener el usuario autenticado a partir del token JWT
  const user = await getUserFromRequest(req);

  // Bloquear el acceso si no hay usuario autenticado
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer el listId desde la URL (forma más fiable en App Router)
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  // La URL es: /api/lists/{listId}/items
  const listId = Number(segments[3]);

  // Validar que el id sea correcto
  if (isNaN(listId)) {
    return NextResponse.json(
      { error: "Invalid list id" },
      { status: 400 }
    );
  }

  // Verificar que la lista existe y pertenece al usuario
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

  try {
    // Leer el body de la request
    const body = await req.json();
    const { productId, productName, categoryId, quantity } = body;

    let finalProductId: number;

    // Caso 1: producto existente
    if (productId) {
      finalProductId = productId;
    }
    // Caso 2: producto nuevo
    else if (productName && categoryId) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: {
            equals: productName,
            mode: "insensitive",
          },
        },
      });

      if (existingProduct) {
        finalProductId = existingProduct.id;
      } else {
        const newProduct = await prisma.product.create({
          data: {
            name: productName,
            categoryId,
          },
        });

        finalProductId = newProduct.id;
      }
    } else {
      return NextResponse.json(
        { error: "Product data is required" },
        { status: 400 }
      );
    }

    // Crear el item en la lista
    const item = await prisma.shoppingListItem.create({
      data: {
        shoppingListId: listId,
        productId: finalProductId,
        quantity: quantity ?? 1,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Add product to list error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



// Endpoint para listar los productos de una lista concreta
export async function GET(req: Request) {
  // Obtener el usuario autenticado a partir del token JWT
  const user = await getUserFromRequest(req);

  // Bloquear el acceso si no hay usuario autenticado
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extraer el listId desde la URL
  // La URL es: /api/lists/{listId}/items
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const listId = Number(segments[3]);

  // Validar que el id sea correcto
  if (isNaN(listId)) {
    return NextResponse.json(
      { error: "Invalid list id" },
      { status: 400 }
    );
  }

  // Verificar que la lista existe y pertenece al usuario
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: listId,
      userId: user.id,
    },
  });

  // Si la lista no existe o no es del usuario, se bloquea
  if (!list) {
    return NextResponse.json(
      { error: "List not found" },
      { status: 404 }
    );
  }

  // Obtener todos los items de la lista con producto y categoría
const items = await prisma.shoppingListItem.findMany({
  where: {
    shoppingListId: listId,
  },
  include: {
    product: {
      include: {
        category: true,
      },
    },
  },
});

// Agrupar los items por categoría
const groupedByCategory = items.reduce((acc: any[], item) => {
  const category = item.product.category;

  // Buscar si la categoría ya existe en el acumulador
  let categoryGroup = acc.find(
    (group) => group.category.id === category.id
  );

  // Si no existe, crear el grupo
  if (!categoryGroup) {
    categoryGroup = {
      category: {
        id: category.id,
        name: category.name,
        defaultOrder: category.defaultOrder,
      },
      items: [],
    };
    acc.push(categoryGroup);
  }

  // Añadir el item a su categoría
  categoryGroup.items.push(item);

  return acc;
}, []);

// Ordenar las categorías por defaultOrder
groupedByCategory.sort(
  (a, b) => a.category.defaultOrder - b.category.defaultOrder
);

// Ordenar los productos dentro de cada categoría (alfabéticamente)
groupedByCategory.forEach((group) => {
  group.items.sort((a, b) =>
    a.product.name.localeCompare(b.product.name)
  );
});

// Devolver los items agrupados por categoría
return NextResponse.json(groupedByCategory);
}
