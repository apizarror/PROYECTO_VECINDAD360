import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (user.rol !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const condominio = await prisma.condominio.findUnique({ where: { id } });
    if (!condominio) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const updated = await prisma.condominio.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
