import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isPremium: user.isPremium,
    role: user.role,
  });
}
