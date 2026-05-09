import { z } from "zod";

export const edificioSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  direccion: z.string().min(5, "Mínimo 5 caracteres"),
  bloques: z.number().min(0),
  pisosTotales: z.number().min(1, "Mínimo 1 piso"),
  departamentosTotales: z.number().min(1, "Mínimo 1 departamento"),
  estado: z.enum(["Activo", "Inactivo"]),
});

export const bloqueSchema = z.object({
  id: z.string().min(1),
  edificioId: z.string().min(1, "Selecciona un edificio"),
  nombre: z.string().min(1, "Requerido"),
  pisos: z.number().min(1, "Mínimo 1 piso"),
  inmuebles: z.number().min(1, "Mínimo 1 inmueble"),
  edificioNombre: z.string(),
});

export const inmuebleSchema = z.object({
  id: z.string().min(1),
  bloqueId: z.string().min(1, "Selecciona un bloque"),
  bloqueNombre: z.string(),
  edificioNombre: z.string(),
  numero: z.string().min(1, "Requerido"),
  piso: z.number().min(0),
  area: z.number().min(10, "Mínimo 10 m²"),
  habitaciones: z.number().min(0),
  banos: z.number().min(0),
  alicuota: z.number().min(0).max(100),
  estado: z.enum(["Ocupado", "Desocupado"]),
  residenteActual: z.string().optional(),
  saldo: z.number().default(0),
});
