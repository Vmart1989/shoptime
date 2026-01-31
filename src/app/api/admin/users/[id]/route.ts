import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

// Endpoint admin: actualizar isPremium / role de un usuario
export async function PATCH(req: Request) {
  try {
    // Obtener usuario autenticado
    const admin = await getUserFromRequest(req);

    // Bloquear si no es admin
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Extraer userId desde la URL: /api/admin/users/{id}
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[4]);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    // Leer body
    const body = await req.json();
    const { isPremium, role } = body as {
      isPremium?: boolean;
      role?: "USER" | "ADMIN";
    };

    // Validar que al menos venga un campo
    if (typeof isPremium === "undefined" && typeof role === "undefined") {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    // Evitar que un admin se quite a sí mismo el rol por accidente
    if (admin.id === userId && role && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin cannot remove own admin role" },
        { status: 400 }
      );
    }

    // Preparar update
    const data: any = {};
    if (typeof isPremium !== "undefined") data.isPremium = Boolean(isPremium);
    if (typeof role !== "undefined") data.role = role;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true,
        registrationDate: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
