import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Find user with condominio
    const user = await prisma.user.findUnique({
      where: { email },
      include: { condominio: true },
    });

    if (!user || !user.activo) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        telefono: user.telefono,
        rol: user.rol,
        avatar: user.avatar,
        condominioId: user.condominioId,
      },
      condominio: user.condominio
        ? {
            id: user.condominio.id,
            nombre: user.condominio.nombre,
            plan: user.condominio.plan,
            trialEndsAt: user.condominio.trialEndsAt,
            modalidad: user.condominio.modalidad,
          }
        : null,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
