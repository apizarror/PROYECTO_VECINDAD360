import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isTrialExpired } from "@/lib/auth";

const DEMO_EMAIL = "demo@vecindad360.com";

interface HandlerOptions {
  model: string;
  include?: Record<string, boolean>;
  allowedRoles?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(modelName: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[modelName];
}

async function authenticate(allowedRoles?: string[]) {
  const user = await getSession();
  if (!user) {
    return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }), user: null };
  }

  if (user.rol !== "SUPER_ADMIN" && user.condominio && isTrialExpired(user.condominio)) {
    return { error: NextResponse.json({ error: "Periodo de prueba expirado" }, { status: 403 }), user: null };
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return { error: NextResponse.json({ error: "No autorizado" }, { status: 403 }), user: null };
  }

  return { error: null, user };
}

export function createListHandler(options: HandlerOptions) {
  return async function GET() {
    try {
      const { error, user } = await authenticate(options.allowedRoles);
      if (error) return error;

      const model = getModel(options.model);
      const where = user!.rol === "SUPER_ADMIN" ? {} : { condominioId: user!.condominioId };

      const items = await model.findMany({
        where,
        ...(options.include ? { include: options.include } : {}),
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(items);
    } catch (err) {
      console.error(`Error listing ${options.model}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

export function createCreateHandler(options: HandlerOptions) {
  return async function POST(request: Request) {
    try {
      const { error, user } = await authenticate(options.allowedRoles);
      if (error) return error;

      if (user!.email === DEMO_EMAIL) {
        return NextResponse.json({ error: "La cuenta demo es solo lectura" }, { status: 403 });
      }

      const body = await request.json();
      const model = getModel(options.model);

      const item = await model.create({
        data: {
          ...body,
          condominioId: user!.condominioId,
        },
        ...(options.include ? { include: options.include } : {}),
      });

      return NextResponse.json(item, { status: 201 });
    } catch (err) {
      console.error(`Error creating ${options.model}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

export function createGetHandler(options: HandlerOptions) {
  return async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { error, user } = await authenticate(options.allowedRoles);
      if (error) return error;

      const { id } = await params;
      const model = getModel(options.model);

      const where =
        user!.rol === "SUPER_ADMIN"
          ? { id }
          : { id, condominioId: user!.condominioId };

      const item = await model.findFirst({
        where,
        ...(options.include ? { include: options.include } : {}),
      });

      if (!item) {
        return NextResponse.json({ error: "No encontrado" }, { status: 404 });
      }

      return NextResponse.json(item);
    } catch (err) {
      console.error(`Error getting ${options.model}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

export function createUpdateHandler(options: HandlerOptions) {
  return async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { error, user } = await authenticate(options.allowedRoles);
      if (error) return error;

      if (user!.email === DEMO_EMAIL) {
        return NextResponse.json({ error: "La cuenta demo es solo lectura" }, { status: 403 });
      }

      const { id } = await params;
      const body = await request.json();
      const model = getModel(options.model);

      // Ownership check
      const where =
        user!.rol === "SUPER_ADMIN"
          ? { id }
          : { id, condominioId: user!.condominioId };

      const existing = await model.findFirst({ where });
      if (!existing) {
        return NextResponse.json({ error: "No encontrado" }, { status: 404 });
      }

      const item = await model.update({
        where: { id },
        data: body,
        ...(options.include ? { include: options.include } : {}),
      });

      return NextResponse.json(item);
    } catch (err) {
      console.error(`Error updating ${options.model}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

export function createDeleteHandler(options: HandlerOptions) {
  return async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { error, user } = await authenticate(options.allowedRoles);
      if (error) return error;

      if (user!.email === DEMO_EMAIL) {
        return NextResponse.json({ error: "La cuenta demo es solo lectura" }, { status: 403 });
      }

      const { id } = await params;
      const model = getModel(options.model);

      // Ownership check
      const where =
        user!.rol === "SUPER_ADMIN"
          ? { id }
          : { id, condominioId: user!.condominioId };

      const existing = await model.findFirst({ where });
      if (!existing) {
        return NextResponse.json({ error: "No encontrado" }, { status: 404 });
      }

      await model.delete({ where: { id } });

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error(`Error deleting ${options.model}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}
