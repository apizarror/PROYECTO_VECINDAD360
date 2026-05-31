import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

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
        users: {
          select: { email: true, rol: true },
          where: { rol: "ADMIN_CONDOMINIO" },
          take: 1,
        },
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

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (user.rol !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const {
      nombre,
      direccion,
      modalidad,
      adminEmail,
      adminPassword,
      adminNombre,
      adminApellidos,
    } = body;

    if (!nombre || !direccion || !adminEmail || !adminPassword || !adminNombre || !adminApellidos) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "El email del admin ya esta registrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(adminPassword);

    // Create condominio with admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create condominio first with a placeholder adminId
      const condominio = await tx.condominio.create({
        data: {
          nombre,
          direccion,
          modalidad: modalidad || "AUTOGESTION",
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          adminId: "placeholder",
        },
      });

      // Create admin user
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          nombre: adminNombre,
          apellidos: adminApellidos,
          rol: "ADMIN_CONDOMINIO",
          condominioId: condominio.id,
        },
      });

      // Update condominio with actual adminId
      const updated = await tx.condominio.update({
        where: { id: condominio.id },
        data: { adminId: adminUser.id },
      });

      return updated;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error creating condominio:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
