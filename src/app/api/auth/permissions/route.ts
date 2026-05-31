import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions-db";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // SUPER_ADMIN always has full access, no need for DB permissions
    if (user.rol === "SUPER_ADMIN") {
      return NextResponse.json([]);
    }

    const permisos = await getPermissionsForRole(user.rol);

    return NextResponse.json(
      permisos.map((p) => ({
        modulo: p.modulo,
        leer: p.leer,
        escribir: p.escribir,
      }))
    );
  } catch (err) {
    console.error("Error fetching permissions:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
