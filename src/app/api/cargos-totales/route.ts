import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isTrialExpired } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (user.rol !== "SUPER_ADMIN" && user.condominio && isTrialExpired(user.condominio)) {
      return NextResponse.json({ error: "Periodo de prueba expirado" }, { status: 403 });
    }

    const condominioFilter =
      user.rol === "SUPER_ADMIN" ? {} : { condominioId: user.condominioId! };

    // Get all inmuebles with their related charges
    const inmuebles = await (prisma.inmueble as any).findMany({
      where: condominioFilter,
      include: {
        bloque: true,
        vinculaciones: {
          include: { persona: true },
        },
        cargosServicio: true,
        multas: true,
      },
      orderBy: { numero: "asc" },
    });

    const result = inmuebles.map((inmueble: any) => {
      const residente = inmueble.vinculaciones?.find((v: any) => v.rol === "Propietario")?.persona
        ?? inmueble.vinculaciones?.[0]?.persona;

      const cargos: {
        tipo: "Mantenimiento" | "Servicio" | "Multa" | "Reserva";
        descripcion: string;
        monto: number;
        estado: "Pendiente" | "Pagado" | "Vencido";
        fechaEmision: string;
      }[] = [];

      // Add cargos de servicio
      for (const cs of inmueble.cargosServicio) {
        cargos.push({
          tipo: "Servicio",
          descripcion: `${cs.servicioNombre} - ${cs.periodo}`,
          monto: cs.monto,
          estado: cs.estado as "Pendiente" | "Pagado" | "Vencido",
          fechaEmision: cs.createdAt.toISOString().slice(0, 10),
        });
      }

      // Add multas
      for (const multa of inmueble.multas) {
        cargos.push({
          tipo: "Multa",
          descripcion: multa.motivo,
          monto: multa.monto,
          estado: multa.estado as "Pendiente" | "Pagado" | "Vencido",
          fechaEmision: multa.fechaEmision,
        });
      }

      const totalCargos = cargos.reduce((sum, c) => sum + c.monto, 0);
      const totalPagado = cargos
        .filter((c) => c.estado === "Pagado")
        .reduce((sum, c) => sum + c.monto, 0);
      const saldoPendiente = totalCargos - totalPagado;
      const interesMora = 0; // Could be calculated from overdue items

      return {
        inmuebleId: inmueble.id,
        inmuebleLabel: `${inmueble.bloque?.nombre ?? ""} - ${inmueble.numero}`.trim(),
        residenteNombre: residente
          ? `${residente.nombres} ${residente.apellidos}`
          : "Sin residente",
        cargos,
        totalCargos,
        totalPagado,
        saldoPendiente,
        interesMora,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching cargos totales:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
