import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (user.rol !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const condominios = await prisma.condominio.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { users: true, edificios: true, inmuebles: true },
        },
      },
    });

    return NextResponse.json(condominios);
  } catch (err) {
    console.error("Error listing condominios:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
