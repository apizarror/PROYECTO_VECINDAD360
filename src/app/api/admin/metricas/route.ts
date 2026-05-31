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

    const [
      totalCondominios,
      totalUsers,
      totalEdificios,
      totalInmuebles,
      totalPersonas,
    ] = await Promise.all([
      prisma.condominio.count(),
      prisma.user.count(),
      prisma.edificio.count(),
      prisma.inmueble.count(),
      prisma.persona.count(),
    ]);

    const condominiosPorPlan = await prisma.condominio.groupBy({
      by: ["plan"],
      _count: { id: true },
    });

    return NextResponse.json({
      totalCondominios,
      totalUsers,
      totalEdificios,
      totalInmuebles,
      totalPersonas,
      condominiosPorPlan: condominiosPorPlan.map((g) => ({
        plan: g.plan,
        count: g._count.id,
      })),
    });
  } catch (err) {
    console.error("Error getting metrics:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
