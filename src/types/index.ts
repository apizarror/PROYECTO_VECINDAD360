export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonial {
  name: string;
  role: string;
  condominio: string;
  quote: string;
  initials: string;
  rating: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

// Inmobiliaria
export interface Edificio {
  id: string;
  nombre: string;
  direccion: string;
  bloques: number;
  pisosTotales: number;
  departamentosTotales: number;
  foto?: string;
  estado: "Activo" | "Inactivo";
}

export interface Bloque {
  id: string;
  edificioId: string;
  nombre: string;
  pisos: number;
  inmuebles: number;
  edificioNombre: string;
}

export interface Inmueble {
  id: string;
  bloqueId: string;
  bloqueNombre: string;
  edificioNombre: string;
  numero: string;
  piso: number;
  area: number;
  habitaciones: number;
  banos: number;
  alicuota: number;
  estado: "Ocupado" | "Desocupado";
  residenteActual?: string;
  saldo: number;
}

// Residentes
export interface Contacto {
  tipo: "email" | "telefono";
  valor: string;
}

export interface VinculacionInmueble {
  inmuebleId: string;
  inmuebleLabel: string;
  rol: "Propietario" | "Inquilino" | "Familiar";
}

export interface Persona {
  id: string;
  tipo: "Natural" | "Jurídica";
  documento: string;
  nombres: string;
  apellidos: string;
  razonSocial?: string;
  genero?: "M" | "F";
  fechaNacimiento?: string;
  contactos: Contacto[];
  vinculaciones: VinculacionInmueble[];
  saldo: number;
  activo: boolean;
}

// Directiva
export interface MiembroDirectiva {
  id: string;
  residenteId: string;
  residenteNombre: string;
  cargo: "Presidente" | "Vicepresidente" | "Tesorero" | "Secretario" | "Vocal";
  fechaInicio: string;
  fechaFin: string;
  estado: "Activo" | "Histórico";
}

// Multas
export interface Multa {
  id: string;
  residenteId: string;
  residenteNombre: string;
  inmuebleId: string;
  inmuebleLabel: string;
  motivo: "ruido" | "mascota" | "basura" | "area_comun" | "estacionamiento" | "otro";
  descripcion: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: "Pendiente" | "Pagada" | "Anulada" | "Vencida";
  aplicadaPor: string;
}

// Configuraciones
export interface GrupoRubro {
  id: string;
  nombre: string;
  orden: number;
}

export interface ServicioRubro {
  id: string;
  grupoId: string;
  grupoNombre: string;
  nombre: string;
  tipo: "Ordinario" | "Extraordinario";
  unidad: string;
  tarifaBase: number;
  cuentaContable: string;
}

export interface ConfiguracionCondominio {
  razonSocial: string;
  ruc: string;
  direccion: string;
  colorPrimario: string;
  zonaHoraria: string;
  moneda: string;
  moraDiaria: number;
  whatsappBusinessId?: string;
  pasarelaPago: "Ninguna" | "Niubiz" | "Culqi" | "Izipay";
  smtpHost?: string;
}

// Servicios del Condominio
export interface CargoServicio {
  id: string;
  inmuebleId: string;
  inmuebleLabel: string;
  servicioId: string;
  servicioNombre: string;
  periodo: string;
  lecturaAnterior?: number;
  lecturaActual?: number;
  consumo?: number;
  tarifa: number;
  monto: number;
  estado: "Pendiente" | "Pagado";
  registradoPor: string;
}

export interface CargoTotalResumen {
  inmuebleId: string;
  inmuebleLabel: string;
  residenteNombre: string;
  cargos: {
    tipo: "Mantenimiento" | "Servicio" | "Multa" | "Reserva";
    descripcion: string;
    monto: number;
    estado: "Pendiente" | "Pagado" | "Vencido";
    fechaEmision: string;
  }[];
  totalCargos: number;
  totalPagado: number;
  saldoPendiente: number;
  interesMora: number;
}

export interface CuotaMantenimiento {
  id: string;
  periodo: string;
  tipo: "Ordinaria" | "Extraordinaria";
  montoBase: number;
  criterio: "Igual" | "Alícuota" | "Personalizado";
  fechaEmision: string;
  fechaVencimiento: string;
  moraDiaria: number;
  estado: "Borrador" | "Emitida" | "Vencida" | "Cerrada";
  inmueblesAplicados: number;
  totalEmitido: number;
  totalCobrado: number;
}

// Financiero
export interface CuentaBancaria {
  id: string;
  banco: string;
  tipo: "Ahorros" | "Corriente" | "Detracción";
  moneda: "PEN" | "USD";
  numeroCuenta: string;
  cci: string;
  titular: string;
  saldoInicial: number;
  saldoActual: number;
  estado: "Activa" | "Inactiva";
}

export interface Presupuesto {
  id: string;
  ano: number;
  rubroId: string;
  rubroNombre: string;
  montoPresupuestado: number;
  montoEjecutado: number;
  avance: number;
  observaciones: string;
}

export interface Egreso {
  id: string;
  concepto: string;
  monto: number;
  categoria: string;
  proveedor: string;
  cuentaBancariaId: string;
  cuentaBancariaNombre: string;
  metodoPago: "Efectivo" | "Transferencia" | "Yape" | "Plin" | "Cheque";
  fechaRegistro: string;
  fechaPago: string;
  descripcion: string;
  estado: "Pendiente" | "Pagado" | "Anulado";
  registradoPor: string;
}

export interface Ingreso {
  id: string;
  concepto: string;
  monto: number;
  origen: "Cuota" | "Multa" | "Reserva" | "Donación" | "Otro";
  residenteId?: string;
  residenteNombre?: string;
  inmuebleId?: string;
  inmuebleLabel?: string;
  cuentaBancariaId: string;
  cuentaBancariaNombre: string;
  metodoPago: "Efectivo" | "Transferencia" | "Yape" | "Plin" | "Tarjeta";
  fecha: string;
  estado: "Confirmado" | "Pendiente" | "Anulado";
  registradoPor: string;
}

// Áreas Comunes
export interface AreaComun {
  id: string;
  nombre: string;
  descripcion: string;
  costoPorHora: number;
  modoReserva: "Por hora" | "Medio día" | "Todo el día";
  capacidadMaxima: number;
  requiereGarantia: boolean;
  montoGarantia: number;
  reglasUso: string;
  estado: "Activa" | "Inactiva";
  reservasActivas: number;
}

export interface Reserva {
  id: string;
  areaComunId: string;
  areaComunNombre: string;
  residenteId: string;
  residenteNombre: string;
  inmuebleId: string;
  inmuebleLabel: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  costoTotal: number;
  estado: "Solicitada" | "Confirmada" | "Pagada" | "Cancelada" | "Realizada";
  observaciones: string;
}

// Vehículos
export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  tipo: "Auto" | "Moto" | "Bicicleta";
  residenteId: string;
  residenteNombre: string;
  inmuebleId: string;
  inmuebleLabel: string;
  espacioEstacionamiento: string;
  sticker: string;
  estado: "Activo" | "Inactivo";
}

export interface MovimientoVehicular {
  id: string;
  vehiculoId?: string;
  placa: string;
  tipoMovimiento: "Ingreso" | "Salida";
  fechaHora: string;
  registradoPor: string;
  observaciones: string;
  esVisitante: boolean;
  visitanteNombre?: string;
}

export interface Visita {
  id: string;
  visitanteDni: string;
  visitanteNombre: string;
  inmuebleId: string;
  inmuebleLabel: string;
  residenteId: string;
  residenteNombre: string;
  motivo: string;
  fechaHoraIngreso: string;
  fechaHoraSalida?: string;
  estado: "Activa" | "Programada" | "Completada" | "Rechazada";
  qrGenerado: string;
  vehiculoPlaca?: string;
}

// Empleados
export interface Empleado {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  cargo: "Conserje" | "Vigilante" | "Limpieza" | "Mantenimiento" | "Administrador";
  tipoContrato: "Planilla" | "Recibo por honorarios" | "Tercerizado";
  fechaIngreso: string;
  fechaSalida?: string;
  salario: number;
  telefono: string;
  email: string;
  estado: "Activo" | "Inactivo";
}

export interface Dispositivo {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  empleadoAsignadoId?: string;
  empleadoAsignadoNombre?: string;
  fechaAsignacion?: string;
  estado: "Asignado" | "Disponible" | "Mantenimiento" | "Baja";
}

export interface Horario {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  diaSemana: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
  horaInicio: string;
  horaFin: string;
  tipoTurno: "Mañana" | "Tarde" | "Noche" | "Rotativo";
}

// Incidencias y Tareas
export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  prioridad: "Baja" | "Media" | "Alta" | "Crítica";
  categoria: string;
  reportadaPor: string;
  asignadaA: string;
  fechaReporte: string;
  fechaCierre?: string;
  estado: "Abierta" | "En proceso" | "Resuelta" | "Cerrada";
}

export interface TareaProgramada {
  id: string;
  titulo: string;
  descripcion: string;
  asignadaA: string;
  frecuencia: "Diaria" | "Semanal" | "Mensual" | "Cron";
  proximaEjecucion: string;
  ultimaEjecucion?: string;
  estado: "Pendiente" | "En progreso" | "Completada" | "Vencida";
}

// Archivos y Reportes
export interface Archivo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "Actas" | "Reglamentos" | "Contratos" | "Estados financieros" | "Otros";
  formato: "PDF" | "Word" | "Excel" | "Imagen";
  visibilidad: "Público" | "Solo directiva" | "Solo admin";
  subidoPor: string;
  fecha: string;
  tamano: string;
}

export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "cuota" | "reserva" | "incidencia" | "visita" | "pago";
  leida: boolean;
  fecha: string;
}
