import type { Vehiculo, MovimientoVehicular, Visita } from "@/types";

export const vehiculos: Vehiculo[] = [
  { id: "v1", placa: "ABC-123", marca: "Toyota", modelo: "Corolla", color: "Blanco", ano: 2022, tipo: "Auto", residenteId: "r1", residenteNombre: "Luis García", inmuebleId: "i1", inmuebleLabel: "Dpto 101", espacioEstacionamiento: "S-01", sticker: "V3-001", estado: "Activo" },
  { id: "v2", placa: "DEF-456", marca: "Honda", modelo: "Civic", color: "Negro", ano: 2021, tipo: "Auto", residenteId: "r2", residenteNombre: "María Torres", inmuebleId: "i2", inmuebleLabel: "Dpto 102", espacioEstacionamiento: "S-02", sticker: "V3-002", estado: "Activo" },
  { id: "v3", placa: "GHI-789", marca: "Yamaha", modelo: "FZ-25", color: "Azul", ano: 2023, tipo: "Moto", residenteId: "r5", residenteNombre: "Ana Quispe", inmuebleId: "i5", inmuebleLabel: "Dpto 301", espacioEstacionamiento: "M-01", sticker: "V3-005", estado: "Activo" },
  { id: "v4", placa: "JKL-012", marca: "Nissan", modelo: "Versa", color: "Plata", ano: 2020, tipo: "Auto", residenteId: "r7", residenteNombre: "Carlos Ruiz", inmuebleId: "i7", inmuebleLabel: "Dpto 101 Bloque B", espacioEstacionamiento: "S-07", sticker: "V3-007", estado: "Activo" },
  { id: "v5", placa: "MNO-345", marca: "Suzuki", modelo: "Swift", color: "Rojo", ano: 2022, tipo: "Auto", residenteId: "r9", residenteNombre: "Roberto Díaz", inmuebleId: "i9", inmuebleLabel: "Dpto 501", espacioEstacionamiento: "S-09", sticker: "V3-009", estado: "Activo" },
  { id: "v6", placa: "BIC-001", marca: "Trek", modelo: "Marlin 7", color: "Verde", ano: 2023, tipo: "Bicicleta", residenteId: "r10", residenteNombre: "Sofía Vargas", inmuebleId: "i10", inmuebleLabel: "Dpto 101 Las Flores", espacioEstacionamiento: "B-01", sticker: "V3-010", estado: "Inactivo" },
];

export const movimientosVehiculares: MovimientoVehicular[] = [
  { id: "mv1", vehiculoId: "v1", placa: "ABC-123", tipoMovimiento: "Ingreso", fechaHora: "2026-05-03 08:15", registradoPor: "Jorge Ramírez", observaciones: "", esVisitante: false },
  { id: "mv2", vehiculoId: "v1", placa: "ABC-123", tipoMovimiento: "Salida", fechaHora: "2026-05-03 18:30", registradoPor: "Pedro López", observaciones: "", esVisitante: false },
  { id: "mv3", vehiculoId: "v2", placa: "DEF-456", tipoMovimiento: "Ingreso", fechaHora: "2026-05-03 09:20", registradoPor: "Jorge Ramírez", observaciones: "", esVisitante: false },
  { id: "mv4", vehiculoId: undefined, placa: "VIS-778", tipoMovimiento: "Ingreso", fechaHora: "2026-05-03 14:00", registradoPor: "Pedro López", observaciones: "Visita Dpto 302, delivery", esVisitante: true, visitanteNombre: "Rappi - Juan Pérez" },
  { id: "mv5", vehiculoId: undefined, placa: "VIS-778", tipoMovimiento: "Salida", fechaHora: "2026-05-03 14:25", registradoPor: "Pedro López", observaciones: "Salida delivery", esVisitante: true },
  { id: "mv6", vehiculoId: "v3", placa: "GHI-789", tipoMovimiento: "Ingreso", fechaHora: "2026-05-03 07:45", registradoPor: "Jorge Ramírez", observaciones: "", esVisitante: false },
  { id: "mv7", vehiculoId: "v4", placa: "JKL-012", tipoMovimiento: "Ingreso", fechaHora: "2026-05-03 06:30", registradoPor: "Jorge Ramírez", observaciones: "", esVisitante: false },
  { id: "mv8", vehiculoId: "v5", placa: "MNO-345", tipoMovimiento: "Salida", fechaHora: "2026-05-03 10:00", registradoPor: "Pedro López", observaciones: "", esVisitante: false },
];

export const visitas: Visita[] = [
  { id: "vi1", visitanteDni: "45678901", visitanteNombre: "Juan Pérez Rojas", inmuebleId: "i1", inmuebleLabel: "Dpto 101", residenteId: "r1", residenteNombre: "Luis García", motivo: "Visita familiar", fechaHoraIngreso: "2026-05-03 10:00", fechaHoraSalida: "2026-05-03 14:00", estado: "Completada", qrGenerado: "QR-001", vehiculoPlaca: "TUV-999" },
  { id: "vi2", visitanteDni: "56789012", visitanteNombre: "María Elena Flores", inmuebleId: "i3", inmuebleLabel: "Dpto 201", residenteId: "r3", residenteNombre: "Jorge Mendoza", motivo: "Reunión de trabajo", fechaHoraIngreso: "2026-05-03 11:30", estado: "Activa", qrGenerado: "QR-002" },
  { id: "vi3", visitanteDni: "67890123", visitanteNombre: "Carlos Sánchez Lima", inmuebleId: "i5", inmuebleLabel: "Dpto 301", residenteId: "r5", residenteNombre: "Ana Quispe", motivo: "Mantenimiento técnico", fechaHoraIngreso: "2026-05-03 08:00", fechaHoraSalida: "2026-05-03 09:30", estado: "Completada", qrGenerado: "QR-003" },
  { id: "vi4", visitanteDni: "78901234", visitanteNombre: "Raquel Vega Torres", inmuebleId: "i8", inmuebleLabel: "Dpto 102 Bloque B", residenteId: "r8", residenteNombre: "Diana López", motivo: "Evento social", fechaHoraIngreso: "2026-05-04 18:00", estado: "Programada", qrGenerado: "QR-004" },
  { id: "vi5", visitanteDni: "89012345", visitanteNombre: "Pedro Castro Díaz", inmuebleId: "i10", inmuebleLabel: "Dpto 101 Las Flores", residenteId: "r10", residenteNombre: "Sofía Vargas", motivo: "Delivery", fechaHoraIngreso: "2026-05-03 13:00", fechaHoraSalida: "2026-05-03 13:15", estado: "Completada", qrGenerado: "QR-005" },
  { id: "vi6", visitanteDni: "90123456", visitanteNombre: "Lucía Quispe Mamani", inmuebleId: "i2", inmuebleLabel: "Dpto 102", residenteId: "r2", residenteNombre: "María Torres", motivo: "Familiar", fechaHoraIngreso: "2026-05-03 16:00", fechaHoraSalida: "2026-05-03 20:00", estado: "Completada", qrGenerado: "QR-006" },
  { id: "vi7", visitanteDni: "01234567", visitanteNombre: "No registrado", inmuebleId: "i6", inmuebleLabel: "Dpto 302", residenteId: "r6", residenteNombre: "Pedro Sánchez", motivo: "No especificado", fechaHoraIngreso: "2026-05-03 22:00", estado: "Rechazada", qrGenerado: "QR-007" },
  { id: "vi8", visitanteDni: "13579024", visitanteNombre: "Diego Rojas Quintana", inmuebleId: "i7", inmuebleLabel: "Dpto 101 Bloque B", residenteId: "r7", residenteNombre: "Carlos Ruiz", motivo: "Visita de negocios", fechaHoraIngreso: "2026-05-04 09:00", estado: "Programada", qrGenerado: "QR-008", vehiculoPlaca: "XYZ-456" },
];
