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

    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalCondominios,
      totalUsers,
      totalEdificios,
      totalInmuebles,
      totalPersonas,
      trialsActivos,
      trialsProximosAVencer,
      registrosUltimos30Dias,
    ] = await Promise.all([
      prisma.condominio.count(),
      prisma.user.count(),
      prisma.edificio.count(),
      prisma.inmueble.count(),
      prisma.persona.count(),
      prisma.condominio.count({
        where: { plan: "TRIAL", trialEndsAt: { gt: now } },
      }),
      prisma.condominio.count({
        where: {
          plan: "TRIAL",
          trialEndsAt: { gt: now, lte: in7Days },
        },
      }),
      prisma.condominio.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    const condominiosPorPlan = await prisma.condominio.groupBy({
      by: ["plan"],
      _count: { id: true },
    });

    // MRR calculation
    const planPrices: Record<string, number> = {
      BASICO: 99,
      PRO: 269,
      EMPRESARIAL: 679,
    };
    let mrr = 0;
    for (const g of condominiosPorPlan) {
      const price = planPrices[g.plan];
      if (price) {
        mrr += price * g._count.id;
      }
    }

    // Condominios recientes (last 5)
    const condominiosRecientes = await prisma.condominio.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        nombre: true,
        plan: true,
        createdAt: true,
        activo: true,
        _count: { select: { users: true } },
      },
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
      trialsActivos,
      trialsProximosAVencer,
      mrr,
      registrosUltimos30Dias,
      condominiosRecientes,
    });
  } catch (err) {
    console.error("Error getting metrics:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
