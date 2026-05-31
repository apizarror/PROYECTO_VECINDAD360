import { NextResponse } from "next/server";
import { getSession, isTrialExpired } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const trialExpired = user.condominio
      ? isTrialExpired(user.condominio)
      : false;

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
      trialExpired,
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
