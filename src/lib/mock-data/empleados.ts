import type { Empleado, Dispositivo, Horario } from "@/types";

export const empleados: Empleado[] = [
  { id: "em1", dni: "41234567", nombres: "Jorge", apellidos: "Ramírez López", cargo: "Vigilante", tipoContrato: "Planilla", fechaIngreso: "2024-03-15", salario: 1800, telefono: "+51 999111222", email: "jorge.ramirez@edificio.pe", estado: "Activo" },
  { id: "em2", dni: "42345678", nombres: "Pedro", apellidos: "López Quispe", cargo: "Vigilante", tipoContrato: "Planilla", fechaIngreso: "2024-06-01", salario: 1800, telefono: "+51 999222333", email: "pedro.lopez@edificio.pe", estado: "Activo" },
  { id: "em3", dni: "43456789", nombres: "Rosa", apellidos: "Huamán Condori", cargo: "Limpieza", tipoContrato: "Planilla", fechaIngreso: "2025-01-10", salario: 1500, telefono: "+51 999333444", email: "rosa.huaman@edificio.pe", estado: "Activo" },
  { id: "em4", dni: "44567890", nombres: "Miguel", apellidos: "Castro Vera", cargo: "Mantenimiento", tipoContrato: "Recibo por honorarios", fechaIngreso: "2025-02-01", salario: 2200, telefono: "+51 999444555", email: "miguel.castro@edificio.pe", estado: "Activo" },
  { id: "em5", dni: "45678901", nombres: "Carlos", apellidos: "Ruiz Palomino", cargo: "Administrador", tipoContrato: "Planilla", fechaIngreso: "2023-08-01", salario: 3500, telefono: "+51 999555666", email: "carlos.ruiz@edificio.pe", estado: "Activo" },
  { id: "em6", dni: "46789012", nombres: "Sandra", apellidos: "Medina Torres", cargo: "Limpieza", tipoContrato: "Tercerizado", fechaIngreso: "2024-09-15", fechaSalida: "2025-12-31", salario: 1400, telefono: "+51 999666777", email: "sandra.medina@edificio.pe", estado: "Inactivo" },
];

export const dispositivos: Dispositivo[] = [
  { id: "dp1", tipo: "Radio", marca: "Motorola", modelo: "DP1400", numeroSerie: "SN-RAD-001", empleadoAsignadoId: "em1", empleadoAsignadoNombre: "Jorge Ramírez", fechaAsignacion: "2024-03-15", estado: "Asignado" },
  { id: "dp2", tipo: "Radio", marca: "Motorola", modelo: "DP1400", numeroSerie: "SN-RAD-002", empleadoAsignadoId: "em2", empleadoAsignadoNombre: "Pedro López", fechaAsignacion: "2024-06-01", estado: "Asignado" },
  { id: "dp3", tipo: "Tablet", marca: "Samsung", modelo: "Tab A8", numeroSerie: "SN-TAB-001", empleadoAsignadoId: "em5", empleadoAsignadoNombre: "Carlos Ruiz", fechaAsignacion: "2023-08-01", estado: "Asignado" },
  { id: "dp4", tipo: "Llave maestra", marca: "Yale", modelo: "KM-500", numeroSerie: "SN-LLV-001", empleadoAsignadoId: "em5", empleadoAsignadoNombre: "Carlos Ruiz", fechaAsignacion: "2023-08-01", estado: "Asignado" },
  { id: "dp5", tipo: "Uniforme", marca: "Textiles Perú", modelo: "UNI-2025", numeroSerie: "SN-UNI-003", empleadoAsignadoId: "em3", empleadoAsignadoNombre: "Rosa Huamán", fechaAsignacion: "2025-01-10", estado: "Asignado" },
  { id: "dp6", tipo: "Tablet", marca: "Lenovo", modelo: "M10", numeroSerie: "SN-TAB-002", estado: "Disponible" },
  { id: "dp7", tipo: "Radio", marca: "Kenwood", modelo: "TK-3402", numeroSerie: "SN-RAD-003", estado: "Mantenimiento" },
  { id: "dp8", tipo: "Uniforme", marca: "Textiles Perú", modelo: "UNI-2024", numeroSerie: "SN-UNI-006", estado: "Baja" },
];

export const horarios: Horario[] = [
  { id: "h1", empleadoId: "em1", empleadoNombre: "Jorge Ramírez", diaSemana: "Lunes", horaInicio: "06:00", horaFin: "14:00", tipoTurno: "Mañana" },
  { id: "h2", empleadoId: "em1", empleadoNombre: "Jorge Ramírez", diaSemana: "Martes", horaInicio: "06:00", horaFin: "14:00", tipoTurno: "Mañana" },
  { id: "h3", empleadoId: "em1", empleadoNombre: "Jorge Ramírez", diaSemana: "Miércoles", horaInicio: "14:00", horaFin: "22:00", tipoTurno: "Tarde" },
  { id: "h4", empleadoId: "em2", empleadoNombre: "Pedro López", diaSemana: "Lunes", horaInicio: "14:00", horaFin: "22:00", tipoTurno: "Tarde" },
  { id: "h5", empleadoId: "em2", empleadoNombre: "Pedro López", diaSemana: "Jueves", horaInicio: "22:00", horaFin: "06:00", tipoTurno: "Noche" },
  { id: "h6", empleadoId: "em3", empleadoNombre: "Rosa Huamán", diaSemana: "Lunes", horaInicio: "07:00", horaFin: "15:00", tipoTurno: "Mañana" },
  { id: "h7", empleadoId: "em3", empleadoNombre: "Rosa Huamán", diaSemana: "Miércoles", horaInicio: "07:00", horaFin: "15:00", tipoTurno: "Mañana" },
  { id: "h8", empleadoId: "em4", empleadoNombre: "Miguel Castro", diaSemana: "Martes", horaInicio: "08:00", horaFin: "16:00", tipoTurno: "Mañana" },
  { id: "h9", empleadoId: "em5", empleadoNombre: "Carlos Ruiz", diaSemana: "Lunes", horaInicio: "08:00", horaFin: "17:00", tipoTurno: "Mañana" },
  { id: "h10", empleadoId: "em5", empleadoNombre: "Carlos Ruiz", diaSemana: "Sábado", horaInicio: "08:00", horaFin: "12:00", tipoTurno: "Rotativo" },
];
