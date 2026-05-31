import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "La contraseña actual y la nueva son requeridas" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    // Verify current password
    const valid = await verifyPassword(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta" },
        { status: 400 },
      );
    }

    // Hash and update
    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
