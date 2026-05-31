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

    const permisos = await prisma.rolePermission.findMany({
      orderBy: [{ rol: "asc" }, { modulo: "asc" }],
    });

    return NextResponse.json(permisos);
  } catch (err) {
    console.error("Error listing permisos:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (user.rol !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body: { rol: string; modulo: string; leer: boolean; escribir: boolean }[] =
      await request.json();

    const results = await Promise.all(
      body.map((p) =>
        prisma.rolePermission.upsert({
          where: { rol_modulo: { rol: p.rol, modulo: p.modulo } },
          update: { leer: p.leer, escribir: p.escribir },
          create: { rol: p.rol, modulo: p.modulo, leer: p.leer, escribir: p.escribir },
        })
      )
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("Error updating permisos:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
