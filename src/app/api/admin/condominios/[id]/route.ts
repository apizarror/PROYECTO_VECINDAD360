import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
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

    const condominio = await prisma.condominio.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
            rol: true,
            activo: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            edificios: true,
            bloques: true,
            inmuebles: true,
            personas: true,
            users: true,
          },
        },
      },
    });

    if (!condominio) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(condominio);
  } catch (err) {
    console.error("Error getting condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

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

    // Only allow specific fields to be updated
    const allowedFields: Record<string, unknown> = {};
    if (body.plan !== undefined) allowedFields.plan = body.plan;
    if (body.activo !== undefined) allowedFields.activo = body.activo;
    if (body.trialEndsAt !== undefined) allowedFields.trialEndsAt = body.trialEndsAt ? new Date(body.trialEndsAt) : null;
    if (body.modalidad !== undefined) allowedFields.modalidad = body.modalidad;
    if (body.nombre !== undefined) allowedFields.nombre = body.nombre;
    if (body.direccion !== undefined) allowedFields.direccion = body.direccion;

    const updated = await prisma.condominio.update({
      where: { id },
      data: allowedFields,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
