import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "contacts.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readContacts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveContact(contact: Record<string, unknown>) {
  ensureDataDir();
  const contacts = readContacts();
  contacts.push({
    ...contact,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, condominio, unidades, mensaje } = body;

    if (!name || !email || !condominio || !unidades || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Try Supabase first
    let saved = false;
    try {
      const { error } = await supabase.from("contacts").insert({
        name,
        email,
        condominio,
        unidades,
        mensaje,
      });
      if (!error) saved = true;
    } catch {}

    // Fallback: save to local file
    if (!saved) {
      saveContact({ name, email, condominio, unidades, mensaje });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
