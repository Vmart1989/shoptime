import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, supermarketId } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "List name is required" },
        { status: 400 }
      );
    }

    const list = await prisma.shoppingList.create({
      data: {
        name,
        userId: user.id,
        supermarketId: supermarketId ?? null,
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error("Create list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const lists = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error("List lists error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

