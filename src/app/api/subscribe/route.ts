import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readSubscribers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveSubscriber(email: string) {
  ensureDataDir();
  const subscribers = readSubscribers();
  subscribers.push({
    email,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // Try Supabase first
    let saved = false;
    try {
      const { error } = await supabase.from("subscribers").insert({ email });
      if (!error) saved = true;
    } catch {}

    // Fallback: save to local file
    if (!saved) {
      saveSubscriber(email);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
