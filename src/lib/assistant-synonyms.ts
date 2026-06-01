/**
 * Diccionario de sinónimos para el asistente virtual Vecino360.
 *
 * Mapea palabras canónicas (usadas en los keywords de la knowledge base)
 * a variantes coloquiales, informales y regionalismos del español
 * latinoamericano (enfoque Perú).
 */

export const SYNONYMS: Record<string, string[]> = {
  // ── Personas ──────────────────────────────────────────────────────────
  residente: [
    "vecino", "inquilino", "propietario", "dueno", "habitante", "persona",
    "gente", "morador", "ocupante", "arrendatario", "locatario", "tipo",
    "senor", "senora", "don", "dona",
  ],
  agregar: [
    "meter", "poner", "anadir", "incluir", "ingresar", "cargar", "registrar",
    "crear", "nuevo", "nueva", "dar de alta", "sumar", "incorporar", "inscribir",
  ],
  editar: [
    "modificar", "cambiar", "actualizar", "corregir", "arreglar", "ajustar",
    "enmendar", "rectificar", "tocar",
  ],
  eliminar: [
    "borrar", "quitar", "sacar", "remover", "deshacer", "anular", "dar de baja",
    "suprimir", "limpiar",
  ],
  buscar: [
    "encontrar", "hallar", "localizar", "ubicar", "donde esta", "donde queda",
    "filtrar", "rastrear",
  ],

  // ── Inmuebles ─────────────────────────────────────────────────────────
  inmueble: [
    "departamento", "depa", "dpto", "apartamento", "apto", "casa", "local",
    "unidad", "vivienda", "oficina", "propiedad", "predio",
  ],
  edificio: [
    "torre", "bloque", "condominio", "conjunto", "residencial", "complejo",
  ],

  // ── Finanzas ──────────────────────────────────────────────────────────
  ingreso: [
    "cobro", "pago", "deposito", "abono", "entrada de dinero", "plata que entra",
    "recaudacion", "cobranza",
  ],
  egreso: [
    "gasto", "desembolso", "salida de dinero", "plata que sale", "costo",
    "erogacion",
  ],
  dinero: [
    "plata", "money", "fondos", "efectivo", "billete", "lucas", "soles",
    "cash", "lana", "mosca",
  ],
  deuda: [
    "debe", "moroso", "pendiente", "atrasado", "vencido", "sin pagar",
    "falta pagar", "saldo", "adeudo",
  ],
  cuota: [
    "mensualidad", "mantenimiento", "cobro mensual", "recibo", "pension",
  ],
  cuenta: [
    "banco", "bancaria", "cta", "cuenta bancaria",
  ],
  presupuesto: [
    "budget", "planificacion", "estimado", "proyeccion",
  ],
  finanzas: [
    "plata", "money", "fondos", "economia", "contabilidad", "caja",
    "tesoreria", "billetera",
  ],

  // ── Servicios ─────────────────────────────────────────────────────────
  agua: [
    "medidor", "lectura agua", "consumo agua", "servicio agua", "cano",
    "grifo",
  ],
  luz: [
    "electricidad", "energia", "corriente", "foco", "servicio electrico",
  ],
  servicio: [
    "cargo", "cobro", "tarifa", "consumo", "recibo",
  ],

  // ── Empleados ─────────────────────────────────────────────────────────
  empleado: [
    "trabajador", "personal", "staff", "colaborador", "conserje", "vigilante",
    "guardia", "portero", "obrero", "operario", "limpieza",
  ],
  horario: [
    "turno", "jornada", "hora trabajo", "schedule", "hora",
  ],
  dispositivo: [
    "equipo", "radio", "herramienta", "aparato", "celular", "tablet",
    "telefono",
  ],

  // ── Visitas ───────────────────────────────────────────────────────────
  visita: [
    "visitante", "invitado", "viene alguien", "persona externa", "guest",
    "delivery", "repartidor", "courier",
  ],
  entrada: [
    "ingreso", "llego", "vino", "acceso", "llegar", "entrar", "entra",
  ],
  salida: [
    "salio", "retiro", "se fue", "partio", "irse", "sale",
  ],

  // ── Vehículos ─────────────────────────────────────────────────────────
  vehiculo: [
    "carro", "auto", "coche", "moto", "camioneta", "van", "movil",
    "motocicleta", "bicicleta", "bici", "transporte",
  ],
  placa: [
    "patente", "matricula", "numero placa", "numero auto",
  ],
  estacionamiento: [
    "parqueo", "parking", "cochera", "garaje", "garage",
  ],

  // ── Áreas comunes ─────────────────────────────────────────────────────
  "area comun": [
    "salon", "piscina", "gimnasio", "parque", "jardin", "terraza", "azotea",
    "parrilla", "bbq", "area social", "zona comun", "espacio comun", "gym",
    "cancha", "juegos",
  ],
  reserva: [
    "agendar", "separar", "apartar", "reservar", "booking", "cita",
    "programar uso",
  ],

  // ── Incidencias ───────────────────────────────────────────────────────
  incidencia: [
    "problema", "queja", "reclamo", "averia", "desperfecto", "falla", "dano",
    "reporte", "fuga", "rotura", "malogrado", "roto", "averiao",
  ],
  urgente: [
    "critico", "emergencia", "grave", "importante", "prioridad alta",
    "urgencia",
  ],

  // ── Tareas ────────────────────────────────────────────────────────────
  tarea: [
    "actividad", "trabajo", "pendiente", "to-do", "hacer", "asignacion",
    "encargo",
  ],
  programar: [
    "agendar", "planificar", "calendarizar", "schedular",
  ],

  // ── Archivos ──────────────────────────────────────────────────────────
  archivo: [
    "documento", "pdf", "acta", "reglamento", "contrato", "papel", "file",
    "adjunto",
  ],
  subir: [
    "cargar", "upload", "compartir", "enviar", "adjuntar",
  ],
  descargar: [
    "bajar", "download", "obtener", "sacar",
  ],

  // ── Multas ────────────────────────────────────────────────────────────
  multa: [
    "sancion", "penalidad", "infraccion", "castigo", "penalizacion", "cobro extra",
  ],

  // ── Configuración ─────────────────────────────────────────────────────
  configurar: [
    "ajustar", "setup", "setear", "parametros", "opciones", "preferencias",
    "personalizar",
  ],

  // ── Acciones generales ────────────────────────────────────────────────
  ver: [
    "mirar", "consultar", "revisar", "mostrar", "ensenar", "visualizar",
    "abrir", "checar", "chequear",
  ],
  como: [
    "de que forma", "de que manera", "cual es el proceso", "pasos para",
    "que hago para", "como hago", "como le hago", "como puedo",
  ],
  donde: [
    "en que parte", "en que seccion", "en que lugar", "ubicacion", "en donde",
  ],
  ayuda: [
    "soporte", "auxilio", "asistencia", "socorro", "help", "apoyo",
  ],
  contrasena: [
    "password", "clave", "pass", "pin", "credencial",
  ],
  cerrar: [
    "salir", "logout", "desconectar", "terminar sesion", "cerrar sesion",
  ],
  notificacion: [
    "alerta", "aviso", "campana", "mensaje", "recordatorio",
  ],

  // ── Reportes ──────────────────────────────────────────────────────────
  reporte: [
    "informe", "estadistica", "grafico", "chart", "datos", "resumen",
  ],
  exportar: [
    "descargar", "imprimir", "sacar", "generar pdf", "excel", "csv",
  ],

  // ── Admin / Planes ────────────────────────────────────────────────────
  plan: [
    "suscripcion", "membresia", "paquete", "licencia", "tarifa",
  ],
  trial: [
    "prueba", "gratis", "periodo prueba", "demo", "free",
  ],
  usuario: [
    "cuenta", "acceso", "login", "user", "perfil",
  ],
  permiso: [
    "acceso", "autorizacion", "privilegio", "rol",
  ],
  activar: [
    "habilitar", "encender", "prender", "activacion",
  ],
  desactivar: [
    "deshabilitar", "apagar", "bloquear", "suspender", "inhabilitar",
  ],

  // ── Saludos / Despedidas ──────────────────────────────────────────────
  hola: [
    "buenas", "que tal", "alo", "oye", "hey", "hi", "hello", "wena",
  ],
  adios: [
    "chao", "bye", "hasta luego", "nos vemos", "chau", "me voy",
  ],
  gracias: [
    "thank", "grax", "thx", "vale", "genial", "perfecto", "excelente",
    "chevere", "bacano",
  ],

  // ── Moroso (variante directa) ─────────────────────────────────────────
  moroso: [
    "deudor", "debe", "atrasado", "vencido", "impago", "sin pagar",
    "no paga", "no pago",
  ],

  // ── Directiva ─────────────────────────────────────────────────────────
  directiva: [
    "junta", "presidente", "tesorero", "secretario", "comite",
    "junta directiva", "mesa directiva",
  ],

  // ── Misceláneos ───────────────────────────────────────────────────────
  dashboard: [
    "panel", "inicio", "pantalla principal", "resumen", "home",
  ],
  whatsapp: [
    "wsp", "ws", "mensaje", "chat", "comunicacion",
  ],
};

/**
 * Palabras vacías (stop words) del español que se ignoran en la búsqueda.
 */
export const STOP_WORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "en", "que", "como", "para", "por", "con", "sin",
  "a", "y", "o", "e", "u", "es", "son", "fue", "ser", "estar",
  "me", "mi", "se", "le", "lo", "su", "nos", "te",
  "al", "mas", "pero", "si", "no", "ya", "muy",
  "este", "esta", "estos", "estas", "ese", "esa", "eso",
  "hay", "tiene", "quiero", "necesito", "puedo",
  "todo", "toda", "todos", "todas",
  "ahi", "aqui", "aca", "alla",
]);
