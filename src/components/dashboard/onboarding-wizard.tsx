"use client";

import { useState, useCallback } from "react";
import {
  Building2,
  Layers,
  Home,
  UserPlus,
  PartyPopper,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBasePath } from "@/lib/base-path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StepDef {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepDef[] = [
  { title: "Crea tu primer edificio", subtitle: "Registra la información básica de tu edificio o condominio", icon: Building2 },
  { title: "Agrega un bloque o torre", subtitle: "Divide tu edificio en bloques o torres para organizar los departamentos", icon: Layers },
  { title: "Registra los departamentos", subtitle: "Crea los inmuebles de tu bloque para asignar residentes", icon: Home },
  { title: "Agrega tu primer residente", subtitle: "Registra a un propietario o inquilino y vincúlalo a un departamento", icon: UserPlus },
  { title: "¡Listo! Tu condominio está configurado", subtitle: "Ya puedes empezar a administrar tu condominio", icon: PartyPopper },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${getBasePath()}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).error ?? "Error al crear recurso");
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Sub-components: form fields
// ---------------------------------------------------------------------------

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-surface-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-800 placeholder:text-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface OnboardingWizardProps {
  onComplete: () => void;
  onDismiss: () => void;
}

export function OnboardingWizard({ onComplete, onDismiss }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Created IDs from previous steps
  const [edificioId, setEdificioId] = useState<string | null>(null);
  const [bloqueId, setBloqueId] = useState<string | null>(null);
  const [inmuebleIds, setInmuebleIds] = useState<string[]>([]);

  // Summary data
  const [summary, setSummary] = useState({
    edificio: "",
    bloque: "",
    inmuebles: 0,
    residente: "",
  });

  // ── Step 1: Edificio form ─────────────────────────────
  const [edificioForm, setEdificioForm] = useState({
    nombre: "",
    direccion: "",
    pisosTotales: "5",
    departamentosTotales: "20",
  });

  // ── Step 2: Bloque form ───────────────────────────────
  const [bloqueForm, setBloqueForm] = useState({
    nombre: "",
    pisos: "5",
    inmuebles: "10",
  });

  // ── Step 3: Inmuebles config ──────────────────────────
  const [inmuebleMode, setInmuebleMode] = useState<"auto" | "manual">("auto");
  const [inmueblesPerFloor, setInmueblesPerFloor] = useState("2");
  const [manualInmueble, setManualInmueble] = useState({
    numero: "",
    piso: "1",
    area: "80",
  });

  // ── Step 4: Persona form ──────────────────────────────
  const [personaForm, setPersonaForm] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    email: "",
    telefono: "",
  });

  const updateField = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Record<string, string>>>) =>
      (name: string, value: string) =>
        setter((prev: Record<string, string>) => ({ ...prev, [name]: value })),
    []
  );

  // ── Handlers ──────────────────────────────────────────

  async function handleStep1() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<{ id: string; nombre: string }>("edificios", {
        nombre: edificioForm.nombre,
        direccion: edificioForm.direccion,
        pisosTotales: Number(edificioForm.pisosTotales),
        departamentosTotales: Number(edificioForm.departamentosTotales),
        bloques: 0,
      });
      setEdificioId(data.id);
      setSummary((s) => ({ ...s, edificio: edificioForm.nombre }));
      setStep(1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    if (!edificioId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<{ id: string; nombre: string }>("bloques", {
        edificioId,
        nombre: bloqueForm.nombre,
        pisos: Number(bloqueForm.pisos),
        inmuebles: Number(bloqueForm.inmuebles),
      });
      setBloqueId(data.id);
      setSummary((s) => ({ ...s, bloque: bloqueForm.nombre }));
      setStep(2);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep3Auto() {
    if (!bloqueId) return;
    setLoading(true);
    setError(null);
    try {
      const pisos = Number(bloqueForm.pisos);
      const perFloor = Number(inmueblesPerFloor);
      const ids: string[] = [];

      for (let piso = 1; piso <= pisos; piso++) {
        for (let n = 1; n <= perFloor; n++) {
          const numero = `${piso}${String(n).padStart(2, "0")}`;
          const data = await apiPost<{ id: string }>("inmuebles", {
            bloqueId,
            numero,
            piso,
            area: 80,
            habitaciones: 3,
            banos: 2,
            alicuota: 0,
            estado: "Desocupado",
          });
          ids.push(data.id);
        }
      }

      setInmuebleIds(ids);
      setSummary((s) => ({ ...s, inmuebles: ids.length }));
      setStep(3);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep3Manual() {
    if (!bloqueId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<{ id: string }>("inmuebles", {
        bloqueId,
        numero: manualInmueble.numero,
        piso: Number(manualInmueble.piso),
        area: Number(manualInmueble.area),
        habitaciones: 3,
        banos: 2,
        alicuota: 0,
        estado: "Desocupado",
      });
      setInmuebleIds((prev) => [...prev, data.id]);
      setSummary((s) => ({ ...s, inmuebles: s.inmuebles + 1 }));
      setManualInmueble({ numero: "", piso: "1", area: "80" });
      // Stay on step to allow adding more, or move forward
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep4() {
    if (inmuebleIds.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await apiPost("personas", {
        documento: personaForm.documento,
        nombres: personaForm.nombres,
        apellidos: personaForm.apellidos,
        contactos: {
          create: [
            ...(personaForm.email ? [{ tipo: "Email", valor: personaForm.email }] : []),
            ...(personaForm.telefono ? [{ tipo: "Teléfono", valor: personaForm.telefono }] : []),
          ],
        },
        vinculaciones: {
          create: [
            {
              inmuebleId: inmuebleIds[0],
              rol: "Propietario",
            },
          ],
        },
      });
      setSummary((s) => ({ ...s, residente: `${personaForm.nombres} ${personaForm.apellidos}` }));
      setStep(4);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  return (
    <Card className="w-full overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-surface-100">
        <div
          className="h-full bg-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <StepIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">
              Paso {step + 1} de {STEPS.length}
            </p>
            <h2 className="text-lg font-bold text-surface-800">{currentStep.title}</h2>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-surface-400 hover:text-surface-600 transition-colors p-1"
          title="Configurar después"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="px-6 text-sm text-surface-500 mb-4">{currentStep.subtitle}</p>

      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── Step 1: Edificio ─────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre del edificio" name="nombre" value={edificioForm.nombre} onChange={updateField(setEdificioForm as never)} required placeholder="Ej: Residencial Los Jardines" />
              <Field label="Dirección" name="direccion" value={edificioForm.direccion} onChange={updateField(setEdificioForm as never)} required placeholder="Ej: Av. Principal 123" />
              <Field label="Pisos totales" name="pisosTotales" value={edificioForm.pisosTotales} onChange={updateField(setEdificioForm as never)} type="number" required />
              <Field label="Departamentos totales" name="departamentosTotales" value={edificioForm.departamentosTotales} onChange={updateField(setEdificioForm as never)} type="number" required />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button onClick={onDismiss} className="text-sm text-surface-400 hover:text-surface-600 transition-colors">
                Configurar después
              </button>
              <Button
                onClick={handleStep1}
                disabled={loading || !edificioForm.nombre || !edificioForm.direccion}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Bloque ──────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Nombre del bloque" name="nombre" value={bloqueForm.nombre} onChange={updateField(setBloqueForm as never)} required placeholder="Ej: Torre A" />
              <Field label="Pisos" name="pisos" value={bloqueForm.pisos} onChange={updateField(setBloqueForm as never)} type="number" required />
              <Field label="Inmuebles totales" name="inmuebles" value={bloqueForm.inmuebles} onChange={updateField(setBloqueForm as never)} type="number" required />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                onClick={handleStep2}
                disabled={loading || !bloqueForm.nombre}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Inmuebles ───────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setInmuebleMode("auto")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  inmuebleMode === "auto"
                    ? "bg-primary-100 text-primary-700 border border-primary-300"
                    : "bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100"
                }`}
              >
                Generar automáticamente
              </button>
              <button
                onClick={() => setInmuebleMode("manual")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  inmuebleMode === "manual"
                    ? "bg-primary-100 text-primary-700 border border-primary-300"
                    : "bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100"
                }`}
              >
                Agregar manualmente
              </button>
            </div>

            {inmuebleMode === "auto" ? (
              <div className="space-y-3">
                <Field
                  label="Departamentos por piso"
                  name="inmueblesPerFloor"
                  value={inmueblesPerFloor}
                  onChange={(_, v) => setInmueblesPerFloor(v)}
                  type="number"
                  required
                />
                <p className="text-xs text-surface-400">
                  Se crearán {Number(bloqueForm.pisos) * Number(inmueblesPerFloor)} departamentos ({bloqueForm.pisos} pisos x {inmueblesPerFloor} por piso)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Número" name="numero" value={manualInmueble.numero} onChange={updateField(setManualInmueble as never)} required placeholder="Ej: 101" />
                  <Field label="Piso" name="piso" value={manualInmueble.piso} onChange={updateField(setManualInmueble as never)} type="number" required />
                  <Field label="Área (m²)" name="area" value={manualInmueble.area} onChange={updateField(setManualInmueble as never)} type="number" />
                </div>
                {inmuebleIds.length > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    <Check className="inline h-3 w-3 mr-1" />
                    {inmuebleIds.length} departamento(s) creado(s)
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStep3Manual}
                  disabled={loading || !manualInmueble.numero}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Agregar departamento
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              {inmuebleMode === "auto" ? (
                <Button onClick={handleStep3Auto} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Generar y continuar <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (inmuebleIds.length > 0) setStep(3);
                  }}
                  disabled={inmuebleIds.length === 0}
                >
                  Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Persona ─────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombres" name="nombres" value={personaForm.nombres} onChange={updateField(setPersonaForm as never)} required placeholder="Ej: Juan Carlos" />
              <Field label="Apellidos" name="apellidos" value={personaForm.apellidos} onChange={updateField(setPersonaForm as never)} required placeholder="Ej: Pérez López" />
              <Field label="Documento (DNI/CE)" name="documento" value={personaForm.documento} onChange={updateField(setPersonaForm as never)} required placeholder="Ej: 12345678" />
              <Field label="Email" name="email" value={personaForm.email} onChange={updateField(setPersonaForm as never)} type="email" placeholder="Ej: juan@email.com" />
              <Field label="Teléfono" name="telefono" value={personaForm.telefono} onChange={updateField(setPersonaForm as never)} placeholder="Ej: 999111222" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                onClick={handleStep4}
                disabled={loading || !personaForm.nombres || !personaForm.apellidos || !personaForm.documento}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Finalizar <Check className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 5: Summary ─────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryItem icon={Building2} label="Edificio" value={summary.edificio} />
              <SummaryItem icon={Layers} label="Bloque" value={summary.bloque} />
              <SummaryItem icon={Home} label="Departamentos" value={`${summary.inmuebles} creados`} />
              <SummaryItem icon={UserPlus} label="Residente" value={summary.residente} />
            </div>
            <div className="flex justify-center pt-2">
              <Button size="lg" onClick={onComplete}>
                Ir al Dashboard <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600 flex-shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-surface-400 uppercase">{label}</p>
        <p className="text-sm font-semibold text-surface-800">{value}</p>
      </div>
    </div>
  );
}
