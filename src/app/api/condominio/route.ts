import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isTrialExpired } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!user.condominioId) {
      return NextResponse.json({ error: "Sin condominio asignado" }, { status: 404 });
    }

    const condominio = await prisma.condominio.findUnique({
      where: { id: user.condominioId },
    });

    if (!condominio) {
      return NextResponse.json({ error: "Condominio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(condominio);
  } catch (err) {
    console.error("Error getting condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!["ADMIN_CONDOMINIO", "SUPER_ADMIN"].includes(user.rol)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (user.rol !== "SUPER_ADMIN" && user.condominio && isTrialExpired(user.condominio)) {
      return NextResponse.json({ error: "Periodo de prueba expirado" }, { status: 403 });
    }

    if (!user.condominioId) {
      return NextResponse.json({ error: "Sin condominio asignado" }, { status: 404 });
    }

    const body = await request.json();

    const allowedFields = [
      "razonSocial",
      "ruc",
      "direccion",
      "colorPrimario",
      "zonaHoraria",
      "moneda",
      "moraDiaria",
      "whatsappBusinessId",
      "pasarelaPago",
      "smtpHost",
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    const condominio = await prisma.condominio.update({
      where: { id: user.condominioId },
      data,
    });

    return NextResponse.json(condominio);
  } catch (err) {
    console.error("Error updating condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
