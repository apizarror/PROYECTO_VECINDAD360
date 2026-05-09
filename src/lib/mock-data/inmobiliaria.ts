import type { Edificio, Bloque, Inmueble } from "@/types";

export const edificios: Edificio[] = [
  {
    id: "e1",
    nombre: "Torre Sol",
    direccion: "Av. Los Olivos 123, San Isidro",
    bloques: 3,
    pisosTotales: 18,
    departamentosTotales: 54,
    estado: "Activo",
  },
  {
    id: "e2",
    nombre: "Residencial Las Flores",
    direccion: "Jr. Las Gardenias 456, Miraflores",
    bloques: 2,
    pisosTotales: 10,
    departamentosTotales: 40,
    estado: "Activo",
  },
];

export const bloques: Bloque[] = [
  { id: "b1", edificioId: "e1", nombre: "Bloque A", pisos: 6, inmuebles: 18, edificioNombre: "Torre Sol" },
  { id: "b2", edificioId: "e1", nombre: "Bloque B", pisos: 6, inmuebles: 18, edificioNombre: "Torre Sol" },
  { id: "b3", edificioId: "e1", nombre: "Bloque C", pisos: 6, inmuebles: 18, edificioNombre: "Torre Sol" },
  { id: "b4", edificioId: "e2", nombre: "Bloque A", pisos: 5, inmuebles: 20, edificioNombre: "Residencial Las Flores" },
  { id: "b5", edificioId: "e2", nombre: "Bloque B", pisos: 5, inmuebles: 20, edificioNombre: "Residencial Las Flores" },
];

export const inmuebles: Inmueble[] = [
  { id: "i1", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "101", piso: 1, area: 75, habitaciones: 2, banos: 1, alicuota: 5.5, estado: "Ocupado", residenteActual: "Luis García", saldo: 0 },
  { id: "i2", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "102", piso: 1, area: 82, habitaciones: 3, banos: 2, alicuota: 6.0, estado: "Ocupado", residenteActual: "María Torres", saldo: -450 },
  { id: "i3", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "201", piso: 2, area: 75, habitaciones: 2, banos: 1, alicuota: 5.5, estado: "Ocupado", residenteActual: "Jorge Mendoza", saldo: 0 },
  { id: "i4", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "202", piso: 2, area: 82, habitaciones: 3, banos: 2, alicuota: 6.0, estado: "Desocupado", saldo: 0 },
  { id: "i5", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "301", piso: 3, area: 90, habitaciones: 3, banos: 2, alicuota: 6.5, estado: "Ocupado", residenteActual: "Ana Quispe", saldo: -120 },
  { id: "i6", bloqueId: "b1", bloqueNombre: "Bloque A", edificioNombre: "Torre Sol", numero: "302", piso: 3, area: 75, habitaciones: 2, banos: 1, alicuota: 5.5, estado: "Ocupado", residenteActual: "Pedro Sánchez", saldo: -1250 },
  { id: "i7", bloqueId: "b2", bloqueNombre: "Bloque B", edificioNombre: "Torre Sol", numero: "101", piso: 1, area: 95, habitaciones: 3, banos: 2, alicuota: 7.0, estado: "Ocupado", residenteActual: "Carlos Ruiz", saldo: 0 },
  { id: "i8", bloqueId: "b2", bloqueNombre: "Bloque B", edificioNombre: "Torre Sol", numero: "102", piso: 1, area: 78, habitaciones: 2, banos: 1, alicuota: 5.8, estado: "Ocupado", residenteActual: "Diana López", saldo: -200 },
  { id: "i9", bloqueId: "b3", bloqueNombre: "Bloque C", edificioNombre: "Torre Sol", numero: "501", piso: 5, area: 110, habitaciones: 4, banos: 3, alicuota: 8.0, estado: "Ocupado", residenteActual: "Roberto Díaz", saldo: 0 },
  { id: "i10", bloqueId: "b4", bloqueNombre: "Bloque A", edificioNombre: "Residencial Las Flores", numero: "101", piso: 1, area: 68, habitaciones: 2, banos: 1, alicuota: 2.5, estado: "Ocupado", residenteActual: "Sofía Vargas", saldo: 0 },
  { id: "i11", bloqueId: "b4", bloqueNombre: "Bloque A", edificioNombre: "Residencial Las Flores", numero: "202", piso: 2, area: 72, habitaciones: 2, banos: 1, alicuota: 2.7, estado: "Desocupado", saldo: 0 },
  { id: "i12", bloqueId: "b5", bloqueNombre: "Bloque B", edificioNombre: "Residencial Las Flores", numero: "301", piso: 3, area: 85, habitaciones: 3, banos: 2, alicuota: 3.0, estado: "Ocupado", residenteActual: "Martín Castro", saldo: -80 },
];
