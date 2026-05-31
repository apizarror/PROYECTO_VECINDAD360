import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      nombre,
      apellidos,
      telefono,
      condominioNombre,
      direccion,
      unidades,
      modalidad,
    } = body;

    // Validate required fields
    if (!email || !password || !nombre || !apellidos || !condominioNombre || !direccion) {
      return NextResponse.json(
        { error: "Campos requeridos: email, password, nombre, apellidos, condominioNombre, direccion" },
        { status: 400 }
      );
    }

    // Check if email already taken
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellidos,
        telefono: telefono || null,
        rol: "ADMIN_CONDOMINIO",
      },
    });

    // Create condominio with 15-day trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 15);

    const condominio = await prisma.condominio.create({
      data: {
        nombre: condominioNombre,
        direccion,
        modalidad: modalidad || "AUTOGESTION",
        plan: "TRIAL",
        trialEndsAt,
        adminId: user.id,
      },
    });

    // Link user to condominio
    await prisma.user.update({
      where: { id: user.id },
      data: { condominioId: condominio.id },
    });

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        rol: user.rol,
      },
      condominio: {
        id: condominio.id,
        nombre: condominio.nombre,
        plan: condominio.plan,
        trialEndsAt: condominio.trialEndsAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
