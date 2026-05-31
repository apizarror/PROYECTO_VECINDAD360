import { prisma } from "./prisma";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "vecindad360_session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

// ─── Password Hashing ─────────────────────────
// bcrypt is used so the format matches the seed (`prisma/seed.mts`).

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Session Management ───────────────────────

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  const session = await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: { condominio: true },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}

// ─── Trial Check ──────────────────────────────

export function isTrialExpired(condominio: {
  plan: string;
  trialEndsAt: Date | null;
}): boolean {
  if (condominio.plan !== "TRIAL") return false;
  if (!condominio.trialEndsAt) return true;
  return new Date() > condominio.trialEndsAt;
}
