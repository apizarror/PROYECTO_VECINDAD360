/**
 * Base de conocimiento para el asistente virtual Vecino360.
 *
 * Cada entrada tiene keywords para búsqueda, rol objetivo y respuesta.
 * El chat filtra entradas según el rol del usuario y sus permisos de BD.
 */

export interface KnowledgeEntry {
  keywords: string[];
  rol: "todos" | "ADMIN_CONDOMINIO" | "EMPLEADO" | "RESIDENTE" | "SUPER_ADMIN";
  modulo?: string; // matches permission module name from MENU_TO_MODULE
  answer: string;
}

export interface QuickReply {
  text: string;
  rol: "todos" | "ADMIN_CONDOMINIO" | "EMPLEADO" | "RESIDENTE" | "SUPER_ADMIN";
  modulo?: string;
}

// ---------------------------------------------------------------------------
// Quick Replies
// ---------------------------------------------------------------------------

export const quickReplies: QuickReply[] = [
  // ADMIN_CONDOMINIO
  { text: "¿Cómo empiezo a configurar?", rol: "ADMIN_CONDOMINIO" },
  { text: "¿Cómo agrego un residente?", rol: "ADMIN_CONDOMINIO", modulo: "Residentes" },
  { text: "¿Cómo registro un ingreso?", rol: "ADMIN_CONDOMINIO", modulo: "Financiero" },
  { text: "¿Cómo creo una cuota?", rol: "ADMIN_CONDOMINIO", modulo: "Servicios" },
  { text: "¿Cómo registro cargos de agua?", rol: "ADMIN_CONDOMINIO", modulo: "Servicios" },
  { text: "¿Quiénes son morosos?", rol: "ADMIN_CONDOMINIO", modulo: "Financiero" },
  { text: "¿Cómo configuro la mora?", rol: "ADMIN_CONDOMINIO", modulo: "Configuraciones" },
  // EMPLEADO
  { text: "¿Cómo registro una visita?", rol: "EMPLEADO", modulo: "Visitas" },
  { text: "¿Cómo reporto una incidencia?", rol: "EMPLEADO", modulo: "Incidencias" },
  { text: "¿Cómo registro un vehículo?", rol: "EMPLEADO", modulo: "Vehiculos" },
  { text: "¿Qué puedo hacer?", rol: "EMPLEADO" },
  // RESIDENTE
  { text: "¿Cómo hago una reserva?", rol: "RESIDENTE", modulo: "Areas Comunes" },
  { text: "¿Dónde veo mis documentos?", rol: "RESIDENTE", modulo: "Archivos" },
  { text: "¿Cuánto debo?", rol: "RESIDENTE" },
  { text: "¿Cómo hago un reclamo?", rol: "RESIDENTE" },
  // SUPER_ADMIN
  { text: "¿Cómo gestiono condominios?", rol: "SUPER_ADMIN" },
  { text: "¿Cómo cambio permisos?", rol: "SUPER_ADMIN" },
  { text: "¿Cómo creo un usuario?", rol: "SUPER_ADMIN" },
  { text: "¿Cómo extiendo un trial?", rol: "SUPER_ADMIN" },
];

// ---------------------------------------------------------------------------
// Knowledge Base
// ---------------------------------------------------------------------------

export const knowledgeBase: KnowledgeEntry[] = [
  // =========================================================================
  // GENERAL (todos)
  // =========================================================================
  {
    keywords: ["hola", "buenos dias", "buenas tardes", "buenas noches", "saludos", "hey", "hi"],
    rol: "todos",
    answer:
      "¡Hola! Soy Vecino360, tu asistente virtual. Estoy aquí para ayudarte a navegar el sistema. ¿En qué puedo ayudarte hoy?",
  },
  {
    keywords: ["que es", "vecindad360", "plataforma", "sistema", "para que sirve", "acerca de"],
    rol: "todos",
    answer:
      "Vecindad360 es una plataforma SaaS de gestión integral para condominios. Permite administrar residentes, inmuebles, finanzas, servicios, incidencias, visitas, vehículos, áreas comunes y mucho más, todo desde un solo lugar.",
  },
  {
    keywords: ["contrasena", "password", "clave", "cambiar contrasena", "cambiar clave"],
    rol: "todos",
    answer:
      "Para cambiar tu contraseña, ve a tu perfil haciendo clic en tu avatar en la esquina superior derecha y selecciona 'Perfil'. Desde ahí podrás actualizar tu contraseña.",
  },
  {
    keywords: ["perfil", "mi perfil", "ver perfil", "datos personales", "mi cuenta"],
    rol: "todos",
    answer:
      "Puedes ver y editar tu perfil haciendo clic en tu avatar en la barra superior. Se abrirá tu página de perfil donde puedes actualizar tus datos personales.",
  },
  {
    keywords: ["cerrar sesion", "logout", "salir", "desconectar"],
    rol: "todos",
    answer:
      "Para cerrar sesión, haz clic en tu avatar en la esquina superior derecha y selecciona 'Cerrar sesión'. Serás redirigido a la pantalla de inicio de sesión.",
  },
  {
    keywords: ["rol", "mi rol", "que rol tengo", "permisos", "que puedo hacer"],
    rol: "todos",
    answer:
      "Tu rol determina qué secciones del sistema puedes ver. Los roles disponibles son: Super Administrador, Administrador de Condominio, Personal (Empleado) y Residente. Cada uno tiene acceso a módulos específicos.",
  },
  {
    keywords: ["ayuda", "soporte", "contacto", "problema", "error"],
    rol: "todos",
    answer:
      "Si necesitas ayuda adicional, contacta al administrador de tu condominio. Si eres administrador y tienes problemas técnicos, escríbenos a soporte desde la sección de Configuraciones.",
  },
  {
    keywords: ["gracias", "thank", "genial", "excelente", "perfecto"],
    rol: "todos",
    answer:
      "¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en preguntarme.",
  },

  // =========================================================================
  // DASHBOARD (todos)
  // =========================================================================
  {
    keywords: ["dashboard", "panel", "inicio", "pantalla principal", "resumen"],
    rol: "todos",
    modulo: "Dashboard",
    answer:
      "El Dashboard es tu pantalla principal. Muestra un resumen con indicadores clave (KPIs) como el número de residentes, inmuebles, ingresos del mes, incidencias pendientes y más. La información varía según tu rol.",
  },
  {
    keywords: ["kpi", "indicadores", "metricas", "estadisticas"],
    rol: "todos",
    modulo: "Dashboard",
    answer:
      "Los KPIs (Key Performance Indicators) son indicadores clave que te muestran el estado general del condominio: cantidad de residentes, inmuebles ocupados, ingresos vs egresos, incidencias abiertas, entre otros.",
  },
  {
    keywords: ["mrr", "ingreso recurrente", "monthly recurring"],
    rol: "SUPER_ADMIN",
    answer:
      "El MRR (Monthly Recurring Revenue) es el ingreso mensual recurrente de la plataforma. Se calcula sumando las suscripciones activas de todos los condominios. Lo puedes ver en el panel de Super Admin.",
  },

  // =========================================================================
  // RESIDENTES (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["agregar residente", "nuevo residente", "crear residente", "registrar residente", "anadir residente"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "Para agregar un residente, ve a Residentes > Lista de Residentes y haz clic en el botón '+ Nuevo'. Completa los datos personales (nombre, DNI, teléfono, email) y vincúlalo a un inmueble. Puedes asignarlo como propietario o inquilino.",
  },
  {
    keywords: ["editar residente", "modificar residente", "actualizar residente"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "Para editar un residente, ve a Residentes > Lista de Residentes, busca al residente y haz clic en el ícono de editar. Podrás modificar sus datos personales y su vinculación con inmuebles.",
  },
  {
    keywords: ["eliminar residente", "borrar residente", "dar de baja residente"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "Para eliminar un residente, ve a Residentes > Lista de Residentes, busca al residente y haz clic en el ícono de eliminar. Confirma la acción. Nota: esto no elimina los registros históricos asociados.",
  },
  {
    keywords: ["directiva", "junta directiva", "miembros directiva", "presidente", "tesorero"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "La Directiva es el grupo de residentes que administra el condominio (presidente, vicepresidente, tesorero, etc.). Ve a Residentes > Directiva para gestionar los miembros y sus cargos.",
  },
  {
    keywords: ["multa", "multas", "penalizacion", "sancion", "infraccion"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "Para registrar una multa, ve a Residentes > Multas y haz clic en '+ Nueva Multa'. Selecciona el residente, describe el motivo, establece el monto y la fecha. Las multas se pueden vincular a las cuotas de mantenimiento.",
  },
  {
    keywords: ["buscar residente", "filtrar residente", "encontrar residente"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "En Residentes > Lista de Residentes tienes un buscador en la parte superior. Puedes filtrar por nombre, DNI, teléfono o inmueble para encontrar rápidamente al residente que necesitas.",
  },

  // =========================================================================
  // INMOBILIARIA (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["edificio", "crear edificio", "nuevo edificio", "registrar edificio", "torre"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Inmobiliaria",
    answer:
      "Para crear un edificio o torre, ve a Inmobiliaria > Lista de Inmuebles. Desde ahí puedes agregar edificios, que son las estructuras principales del condominio. Cada edificio puede tener múltiples bloques.",
  },
  {
    keywords: ["bloque", "bloques", "piso", "pisos", "nivel"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Inmobiliaria",
    answer:
      "Los bloques representan subdivisiones de un edificio (pisos, niveles, secciones). Ve a Inmobiliaria y selecciona un edificio para agregar bloques. Cada bloque puede contener varios inmuebles.",
  },
  {
    keywords: ["inmueble", "departamento", "apartamento", "unidad", "registrar inmueble", "nuevo inmueble"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Inmobiliaria",
    answer:
      "Para registrar un inmueble (departamento, casa, local), ve a Inmobiliaria > Lista de Inmuebles. Selecciona el edificio y bloque, luego crea el inmueble con su número, tipo y área. Después podrás vincular residentes a él.",
  },
  {
    keywords: ["alicuota", "porcentaje", "proporcion", "participacion"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Inmobiliaria",
    answer:
      "La alícuota es el porcentaje de participación de cada inmueble en los gastos comunes del condominio. Se calcula generalmente en base al área del inmueble respecto al área total. Se configura al crear o editar el inmueble.",
  },

  // =========================================================================
  // EMPLEADOS (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["agregar empleado", "nuevo empleado", "registrar empleado", "crear empleado", "personal"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Empleados",
    answer:
      "Para agregar un empleado, ve a Empleados > Lista y haz clic en '+ Nuevo'. Completa sus datos personales, cargo y asígnale un usuario con rol 'Personal' para que pueda acceder al sistema.",
  },
  {
    keywords: ["dispositivo", "dispositivos", "equipo", "herramienta", "asignar dispositivo"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Empleados",
    answer:
      "Para gestionar dispositivos asignados a empleados, ve a Empleados > Dispositivos. Aquí puedes registrar radios, teléfonos, tablets u otros equipos y asignarlos a los empleados.",
  },
  {
    keywords: ["horario", "horarios", "turno", "turnos", "jornada"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Empleados",
    answer:
      "Para configurar horarios de trabajo, ve a Empleados > Horarios. Puedes definir turnos (mañana, tarde, noche) y asignarlos a cada empleado con sus días laborables.",
  },

  // =========================================================================
  // FINANCIERO (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["ingreso", "ingresos", "registrar ingreso", "cobro", "pago recibido"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Para registrar un ingreso, ve a Financiero > Ingresos y haz clic en '+ Nuevo'. Selecciona la cuenta bancaria destino, el monto, concepto y fecha. Los ingresos pueden ser por cuotas, multas u otros conceptos.",
  },
  {
    keywords: ["egreso", "egresos", "gasto", "gastos", "registrar egreso", "pago realizado"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Para registrar un egreso, ve a Financiero > Egresos y haz clic en '+ Nuevo'. Indica la cuenta bancaria de origen, monto, concepto, proveedor y fecha. Esto ayuda a llevar un control de los gastos del condominio.",
  },
  {
    keywords: ["cuenta bancaria", "cuentas bancarias", "banco", "bancos"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Para gestionar cuentas bancarias, ve a Financiero > Cuentas Bancarias. Aquí puedes agregar las cuentas del condominio con su banco, número de cuenta y saldo inicial. Se usan para asociar ingresos y egresos.",
  },
  {
    keywords: ["presupuesto", "presupuestos", "planificacion financiera", "budget"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Para crear un presupuesto, ve a Financiero > Presupuestos. Define el período, las categorías de gastos estimados e ingresos esperados. Te permite comparar lo planificado vs lo real.",
  },
  {
    keywords: ["cuota mantenimiento", "cuotas mantenimiento", "mantenimiento mensual", "cobrar cuota"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "Las cuotas de mantenimiento se gestionan en Servicios del Condominio > Cuotas de Mantenimiento. Aquí defines el monto mensual por inmueble y puedes emitir las cuotas para que los residentes las paguen.",
  },

  // =========================================================================
  // SERVICIOS (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["cargo servicio", "cargos servicio", "agua", "luz", "gas", "servicio basico"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "Para registrar cargos por servicio (agua, luz, gas), ve a Servicios del Condominio > Cargos por Servicio. Puedes crear cargos individuales o masivos por inmueble, indicando el servicio, período y monto.",
  },
  {
    keywords: ["crear cuota", "nueva cuota", "emitir cuota", "generar cuota"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "Para crear cuotas de mantenimiento, ve a Servicios del Condominio > Cuotas de Mantenimiento y haz clic en '+ Nueva'. Define el período, monto base y los cargos adicionales. Luego emite las cuotas para que se generen los cobros por inmueble.",
  },
  {
    keywords: ["emitir", "emision", "publicar cuota", "enviar cuota"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "Para emitir cuotas ya creadas, ve a Servicios del Condominio > Cuotas de Mantenimiento. Selecciona la cuota pendiente y haz clic en 'Emitir'. Esto genera los cargos individuales para cada inmueble según su alícuota.",
  },
  {
    keywords: ["cargos totales", "resumen cargos", "total servicios"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "En Servicios del Condominio > Cargos Totales puedes ver un resumen consolidado de todos los cargos por servicio aplicados a cada inmueble, facilitando la revisión antes de emitir las cuotas.",
  },

  // =========================================================================
  // INCIDENCIAS (ADMIN_CONDOMINIO, EMPLEADO)
  // =========================================================================
  {
    keywords: ["reportar incidencia", "nueva incidencia", "crear incidencia", "registrar incidencia"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Incidencias",
    answer:
      "Para reportar una incidencia, ve a Incidencias y haz clic en '+ Nueva'. Describe el problema, selecciona la prioridad (baja, media, alta, crítica) y la ubicación. Puedes adjuntar fotos para mayor claridad.",
  },
  {
    keywords: ["reportar incidencia", "nueva incidencia", "crear incidencia"],
    rol: "EMPLEADO",
    modulo: "Incidencias",
    answer:
      "Para reportar una incidencia, ve a Incidencias y haz clic en '+ Nueva'. Describe el problema, la ubicación y la prioridad. Como personal del condominio, puedes dar seguimiento a las incidencias que se te asignen.",
  },
  {
    keywords: ["estado incidencia", "cambiar estado", "actualizar incidencia", "resolver incidencia"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Incidencias",
    answer:
      "Para cambiar el estado de una incidencia, ábrela desde la lista de Incidencias y actualiza su estado: Abierta, En Proceso, Resuelta o Cerrada. Puedes agregar comentarios sobre el avance.",
  },
  {
    keywords: ["asignar incidencia", "delegar incidencia", "responsable incidencia"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Incidencias",
    answer:
      "Para asignar una incidencia a un empleado, ábrela y selecciona el responsable en el campo de asignación. El empleado recibirá una notificación y podrá ver la incidencia en su panel.",
  },

  // =========================================================================
  // TAREAS (ADMIN_CONDOMINIO, EMPLEADO)
  // =========================================================================
  {
    keywords: ["crear tarea", "nueva tarea", "programar tarea", "registrar tarea"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Tareas",
    answer:
      "Para crear una tarea programada, ve a Tareas > Programadas y haz clic en '+ Nueva'. Define el título, descripción, fecha, frecuencia (diaria, semanal, mensual) y asigna un responsable.",
  },
  {
    keywords: ["gestionar tareas", "mis tareas", "ver tareas", "lista tareas"],
    rol: "EMPLEADO",
    modulo: "Tareas",
    answer:
      "Para ver tus tareas asignadas, ve a la sección Tareas. Ahí verás las tareas programadas con su estado, fecha y prioridad. Puedes marcarlas como completadas cuando las termines.",
  },
  {
    keywords: ["completar tarea", "finalizar tarea", "marcar tarea"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Tareas",
    answer:
      "Para marcar una tarea como completada, ve a Tareas > Programadas, selecciona la tarea y cambia su estado a 'Completada'. Puedes agregar notas sobre la ejecución.",
  },

  // =========================================================================
  // VEHICULOS (ADMIN_CONDOMINIO, EMPLEADO)
  // =========================================================================
  {
    keywords: ["registrar vehiculo", "nuevo vehiculo", "agregar vehiculo", "auto", "carro", "moto"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Vehiculos",
    answer:
      "Para registrar un vehículo, ve a Vehículos > Vehículos del Condominio y haz clic en '+ Nuevo'. Ingresa la placa, marca, modelo, color y vincúlalo al residente propietario.",
  },
  {
    keywords: ["registrar vehiculo", "nuevo vehiculo", "agregar vehiculo"],
    rol: "EMPLEADO",
    modulo: "Vehiculos",
    answer:
      "Para registrar un vehículo, ve a Vehículos > Vehículos del Condominio y haz clic en '+ Nuevo'. Ingresa los datos del vehículo (placa, marca, modelo) y vincúlalo a un residente.",
  },
  {
    keywords: ["movimiento vehicular", "entrada vehiculo", "salida vehiculo", "ingreso vehiculo", "control vehicular"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Vehiculos",
    answer:
      "Para registrar una entrada o salida de vehículo, ve a Vehículos > Movimiento Vehicular. Selecciona el vehículo, tipo de movimiento (entrada/salida) y se registrará con fecha y hora automática.",
  },
  {
    keywords: ["movimiento vehicular", "entrada vehiculo", "salida vehiculo"],
    rol: "EMPLEADO",
    modulo: "Vehiculos",
    answer:
      "Para registrar el movimiento de un vehículo, ve a Vehículos > Movimiento Vehicular. Selecciona el vehículo y registra la entrada o salida. El sistema guardará la fecha y hora automáticamente.",
  },

  // =========================================================================
  // VISITAS (ADMIN_CONDOMINIO, EMPLEADO)
  // =========================================================================
  {
    keywords: ["registrar visita", "nueva visita", "visita", "visitante", "invitado"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Visitas",
    answer:
      "Para registrar una visita, ve a Visitas y haz clic en '+ Nueva'. Ingresa el nombre del visitante, DNI, a quién visita, motivo y hora de ingreso. La hora de salida se registra cuando el visitante se retira.",
  },
  {
    keywords: ["registrar visita", "nueva visita", "visita", "visitante"],
    rol: "EMPLEADO",
    modulo: "Visitas",
    answer:
      "Para registrar una visita, ve a Visitas y haz clic en '+ Nueva'. Ingresa los datos del visitante (nombre, DNI), el residente que visitará y el motivo. Registra la salida cuando el visitante se retire.",
  },
  {
    keywords: ["gestionar visitas", "historial visitas", "ver visitas"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Visitas",
    answer:
      "En la sección Visitas puedes ver el historial completo de visitantes, filtrar por fecha, residente o estado (dentro/fuera). También puedes exportar reportes de visitas.",
  },

  // =========================================================================
  // AREAS COMUNES (ADMIN_CONDOMINIO, RESIDENTE)
  // =========================================================================
  {
    keywords: ["area comun", "areas comunes", "salon", "piscina", "gimnasio", "parque", "bbq"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Areas Comunes",
    answer:
      "Para gestionar áreas comunes, ve a Áreas Comunes > Áreas. Puedes crear, editar o desactivar áreas como salón de eventos, piscina, gimnasio, BBQ, etc. Define horarios, capacidad y reglas de uso.",
  },
  {
    keywords: ["area comun", "areas comunes", "ver areas"],
    rol: "RESIDENTE",
    modulo: "Areas Comunes",
    answer:
      "En Áreas Comunes puedes ver todas las áreas disponibles en tu condominio (piscina, gimnasio, salón, etc.), sus horarios de uso y las reglas. Desde ahí puedes hacer reservas.",
  },
  {
    keywords: ["reserva", "reservar", "agendar", "solicitar area", "hacer reserva"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Areas Comunes",
    answer:
      "Para gestionar reservas de áreas comunes, ve a Áreas Comunes > Reservas. Puedes aprobar, rechazar o cancelar solicitudes de reserva de los residentes. También puedes crear reservas directamente.",
  },
  {
    keywords: ["reserva", "reservar", "agendar", "hacer reserva"],
    rol: "RESIDENTE",
    modulo: "Areas Comunes",
    answer:
      "Para reservar un área común, ve a Áreas Comunes > Reservas y haz clic en '+ Nueva Reserva'. Selecciona el área, la fecha y horario deseado. Tu solicitud será revisada por el administrador.",
  },
  {
    keywords: ["reglas area", "normas area", "regulaciones", "politicas uso"],
    rol: "RESIDENTE",
    modulo: "Areas Comunes",
    answer:
      "Cada área común tiene sus propias reglas de uso (horarios, capacidad máxima, prohibiciones). Puedes ver las reglas al seleccionar un área en Áreas Comunes > Áreas.",
  },

  // =========================================================================
  // ARCHIVOS (ADMIN_CONDOMINIO, RESIDENTE)
  // =========================================================================
  {
    keywords: ["subir archivo", "cargar archivo", "upload", "compartir archivo", "documento"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Archivos",
    answer:
      "Para subir archivos, ve a Archivos Compartidos y haz clic en '+ Subir Archivo'. Puedes compartir documentos como reglamentos, actas de asamblea, comunicados y más con los residentes.",
  },
  {
    keywords: ["archivo", "archivos", "documentos", "descargar", "ver archivos"],
    rol: "RESIDENTE",
    modulo: "Archivos",
    answer:
      "En Archivos Compartidos puedes encontrar todos los documentos que el administrador ha compartido: reglamentos, actas, comunicados, estados de cuenta y más. Puedes descargarlos directamente.",
  },
  {
    keywords: ["gestionar archivos", "administrar archivos", "organizar documentos"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Archivos",
    answer:
      "En Archivos Compartidos puedes organizar los documentos del condominio. Sube, edita o elimina archivos. Los residentes podrán verlos y descargarlos desde su panel.",
  },

  // =========================================================================
  // REPORTES (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["reporte", "reportes", "informe", "informes", "exportar", "generar reporte"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Reportes",
    answer:
      "En la sección Reportes puedes generar informes sobre finanzas, residentes, incidencias y más. Los reportes se pueden filtrar por fecha y exportar en diferentes formatos.",
  },

  // =========================================================================
  // CONFIGURACIONES (ADMIN_CONDOMINIO)
  // =========================================================================
  {
    keywords: ["configuracion", "configuraciones", "ajustes", "settings", "configurar"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Configuraciones",
    answer:
      "En Configuraciones puedes ajustar los datos del condominio, gestionar rubros y servicios, configurar parámetros generales y personalizar el comportamiento del sistema.",
  },
  {
    keywords: ["rubro", "rubros", "categoria", "categorias", "tipo servicio"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Configuraciones",
    answer:
      "Los rubros son categorías para organizar los servicios y gastos del condominio (limpieza, seguridad, mantenimiento, etc.). Ve a Configuraciones para crear y gestionar rubros y servicios.",
  },
  {
    keywords: ["servicio rubro", "servicios rubro", "tipo gasto"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Configuraciones",
    answer:
      "Los servicios dentro de cada rubro definen los conceptos específicos de gasto. Por ejemplo, dentro del rubro 'Mantenimiento' puedes tener servicios como 'Pintura', 'Plomería', etc. Gestiónalo desde Configuraciones.",
  },

  // =========================================================================
  // SUPER ADMIN
  // =========================================================================
  {
    keywords: ["gestionar condominios", "administrar condominios", "ver condominios", "todos los condominios"],
    rol: "SUPER_ADMIN",
    answer:
      "Para gestionar condominios, ve a Panel Admin > Condominios. Aquí puedes ver todos los condominios registrados, cambiar sus planes, activar/desactivar cuentas y ver estadísticas globales.",
  },
  {
    keywords: ["plan", "planes", "cambiar plan", "suscripcion", "upgrade"],
    rol: "SUPER_ADMIN",
    answer:
      "Para cambiar el plan de un condominio, ve a Panel Admin > Condominios, selecciona el condominio y modifica su plan (Trial, Básico, Pro, Enterprise). También puedes extender períodos de prueba.",
  },
  {
    keywords: ["usuarios", "gestionar usuarios", "administrar usuarios", "todos los usuarios"],
    rol: "SUPER_ADMIN",
    answer:
      "Para gestionar usuarios, ve a Panel Admin > Usuarios. Puedes ver todos los usuarios del sistema, cambiar roles, desactivar cuentas y asignar usuarios a condominios.",
  },
  {
    keywords: ["permisos", "editar permisos", "cambiar permisos", "roles", "acceso"],
    rol: "SUPER_ADMIN",
    answer:
      "Para editar permisos, ve a Panel Admin > Permisos. Aquí puedes configurar qué módulos puede ver y editar cada rol (Administrador, Personal, Residente) por condominio. Los permisos tienen opciones de lectura y escritura por módulo.",
  },
  {
    keywords: ["trial", "periodo prueba", "prueba gratis", "vencimiento", "trial expirado"],
    rol: "SUPER_ADMIN",
    answer:
      "El período de prueba (Trial) dura 14 días por defecto. Cuando expira, el condominio ve una pantalla de bloqueo hasta que se actualice su plan. Puedes extender el trial desde Panel Admin > Condominios.",
  },

  // =========================================================================
  // NOTIFICACIONES (todos)
  // =========================================================================
  {
    keywords: ["notificacion", "notificaciones", "alertas", "avisos"],
    rol: "todos",
    answer:
      "Las notificaciones te informan sobre eventos importantes: nuevas incidencias, reservas aprobadas, cuotas emitidas, etc. Haz clic en el ícono de campana en la barra superior para ver tus notificaciones.",
  },

  // =========================================================================
  // PREGUNTAS FRECUENTES / ESCENARIOS COMUNES
  // =========================================================================

  // --- Onboarding / Primeros pasos ---
  {
    keywords: ["empezar", "comenzar", "primeros pasos", "como inicio", "que hago primero", "nuevo"],
    rol: "ADMIN_CONDOMINIO",
    answer:
      "Para empezar a usar Vecindad360: 1) Crea tu edificio en Inmobiliaria, 2) Agrega bloques/torres, 3) Registra los departamentos (inmuebles), 4) Agrega residentes y vincúlalos a sus departamentos. Después ya puedes usar todos los módulos.",
  },
  {
    keywords: ["wizard", "asistente configuracion", "guia", "tutorial"],
    rol: "ADMIN_CONDOMINIO",
    answer:
      "Si tu condominio está vacío, el sistema te mostrará un asistente paso a paso para configurar tu edificio, bloques, departamentos y primer residente. Si lo cerraste, puedes ir manualmente a Inmobiliaria para empezar.",
  },

  // --- Morosos / Deudas ---
  {
    keywords: ["moroso", "morosos", "deuda", "deudas", "saldo pendiente", "quien debe", "cobranza"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Los morosos se muestran en el Dashboard principal en la tabla 'Top Morosos'. También puedes revisar el saldo de cada residente en Residentes > Lista de Residentes. El saldo negativo indica deuda pendiente.",
  },

  // --- Recibos / Comprobantes ---
  {
    keywords: ["recibo", "comprobante", "boleta", "factura", "constancia pago"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Financiero",
    answer:
      "Los comprobantes de pago se generan al registrar ingresos en Financiero > Ingresos. Puedes ver el historial de pagos por residente o por inmueble para emitir constancias.",
  },

  // --- Mora / Intereses ---
  {
    keywords: ["mora", "interes", "recargo", "penalidad", "mora diaria"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Servicios",
    answer:
      "La mora diaria se configura en Configuraciones > Datos del Condominio. El porcentaje de mora se aplica automáticamente sobre las cuotas vencidas. Puedes ajustar el valor según el reglamento interno.",
  },

  // --- Demo ---
  {
    keywords: ["demo", "cuenta demo", "probar", "prueba"],
    rol: "todos",
    answer:
      "La cuenta demo permite explorar todas las funciones del sistema con datos de ejemplo. Es de solo lectura, no puedes crear ni modificar datos. Para usar el sistema completo, regístrate con tu propia cuenta.",
  },

  // --- Trial / Plan ---
  {
    keywords: ["trial", "prueba gratis", "periodo prueba", "plan vencido", "activar plan", "precio", "costo"],
    rol: "ADMIN_CONDOMINIO",
    answer:
      "Tu cuenta tiene un período de prueba de 15 días. Cuando venza, verás una pantalla para activar tu plan. Contacta por WhatsApp al 984 798 650 para activar tu suscripción. Planes: Básico S/99, Pro S/269, Empresarial S/679.",
  },

  // --- Errores comunes ---
  {
    keywords: ["no puedo", "no funciona", "error", "no me deja", "no aparece", "problema"],
    rol: "todos",
    answer:
      "Si algo no funciona: 1) Verifica que tienes permisos para esa acción (tu rol puede no tener acceso), 2) Recarga la página con Ctrl+F5, 3) Cierra sesión y vuelve a entrar. Si el problema persiste, contacta al administrador.",
  },
  {
    keywords: ["no puedo editar", "solo lectura", "no puedo crear", "no puedo eliminar", "sin permisos"],
    rol: "todos",
    answer:
      "Si no puedes editar o crear, puede ser porque: 1) Estás en la cuenta demo (solo lectura), 2) Tu rol no tiene permisos de escritura para ese módulo, 3) Tu período de prueba venció. Consulta con tu administrador.",
  },

  // --- Seguridad ---
  {
    keywords: ["seguridad", "privacidad", "datos seguros", "proteccion"],
    rol: "todos",
    answer:
      "Vecindad360 protege tus datos con: contraseñas encriptadas (bcrypt), sesiones seguras con cookies httpOnly, y aislamiento de datos por condominio (cada condominio solo ve sus propios datos).",
  },

  // --- Navegación ---
  {
    keywords: ["menu", "sidebar", "barra lateral", "navegacion", "donde esta", "como llego"],
    rol: "todos",
    answer:
      "El menú lateral (sidebar) muestra todas las secciones disponibles según tu rol. Puedes colapsarlo con el botón en la parte inferior. En móvil, usa el ícono de hamburguesa en la barra superior para abrirlo.",
  },
  {
    keywords: ["buscar", "buscador", "filtrar", "encontrar"],
    rol: "todos",
    answer:
      "La mayoría de las páginas tienen un buscador en la parte superior. Escribe el nombre, DNI o cualquier dato para filtrar los resultados. También puedes usar los filtros de estado, fecha o categoría.",
  },

  // --- Vinculación residente-inmueble ---
  {
    keywords: ["vincular", "asignar departamento", "asignar inmueble", "propietario", "inquilino"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Residentes",
    answer:
      "Para vincular un residente a un inmueble, ve a Residentes y crea o edita el residente. En el formulario puedes vincularlo como Propietario, Inquilino o Familiar a uno o más departamentos.",
  },

  // --- Conserje / Vigilante ---
  {
    keywords: ["conserje", "vigilante", "guardia", "portero", "seguridad"],
    rol: "EMPLEADO",
    answer:
      "Como personal del condominio puedes: registrar visitas de entrada y salida, reportar incidencias, registrar movimientos vehiculares y gestionar tus tareas asignadas. Usa el menú lateral para acceder a cada sección.",
  },

  // --- Residente preguntas ---
  {
    keywords: ["mi departamento", "mi unidad", "mi deuda", "cuanto debo", "estado cuenta"],
    rol: "RESIDENTE",
    answer:
      "Como residente puedes ver tu información en el Dashboard. Para consultar tu estado de cuenta o deudas pendientes, contacta al administrador de tu condominio. También puedes ver documentos compartidos en Archivos.",
  },
  {
    keywords: ["queja", "reclamo", "problema condominio", "reportar problema"],
    rol: "RESIDENTE",
    answer:
      "Si tienes un reclamo o problema en el condominio, comunícate con el administrador. El administrador puede registrar incidencias y dar seguimiento a tu caso.",
  },

  // --- Exportar ---
  {
    keywords: ["exportar", "descargar datos", "excel", "pdf", "imprimir"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Reportes",
    answer:
      "La sección de Reportes te permite generar informes descargables sobre finanzas, residentes e incidencias. Los reportes se pueden filtrar por fecha y descargar.",
  },

  // --- Múltiples edificios ---
  {
    keywords: ["varios edificios", "multiples edificios", "otro edificio", "segundo edificio"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Inmobiliaria",
    answer:
      "Puedes gestionar múltiples edificios dentro del mismo condominio. Ve a Inmobiliaria y crea un nuevo edificio. Cada edificio puede tener sus propios bloques e inmuebles independientes.",
  },

  // --- Asambleas ---
  {
    keywords: ["asamblea", "reunion", "junta", "acta", "votacion"],
    rol: "ADMIN_CONDOMINIO",
    answer:
      "Las actas de asamblea y reuniones se pueden guardar como documentos en Archivos Compartidos. Sube las actas en formato PDF para que los residentes puedan consultarlas. La directiva se gestiona en Residentes > Directiva.",
  },

  // --- WhatsApp ---
  {
    keywords: ["whatsapp", "mensaje", "comunicacion", "contactar"],
    rol: "ADMIN_CONDOMINIO",
    answer:
      "Vecindad360 ofrece integración con WhatsApp Business para enviar comunicados masivos a residentes. Configura tu número de WhatsApp Business en Configuraciones > Datos del Condominio.",
  },

  // --- Moneda ---
  {
    keywords: ["moneda", "dolares", "soles", "divisa", "tipo cambio"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Configuraciones",
    answer:
      "La moneda del sistema se configura en Configuraciones > Datos del Condominio. Por defecto es Soles (PEN). Puedes cambiarlo a Dólares (USD) u otra moneda según tu país.",
  },

  // --- Zona horaria ---
  {
    keywords: ["zona horaria", "hora", "timezone", "horario sistema"],
    rol: "ADMIN_CONDOMINIO",
    modulo: "Configuraciones",
    answer:
      "La zona horaria se configura en Configuraciones > Datos del Condominio. Por defecto es America/Lima (UTC-5). Ajústala según la ubicación de tu condominio.",
  },

  // --- Crear usuario para condominio ---
  {
    keywords: ["crear usuario", "nuevo usuario", "agregar usuario", "dar acceso"],
    rol: "SUPER_ADMIN",
    answer:
      "Para crear un usuario, ve a Panel Admin > Usuarios y haz clic en '+ Nuevo'. Selecciona el condominio, asigna email, contraseña y rol (Administrador, Personal o Residente). El usuario podrá acceder al sistema con esas credenciales.",
  },
  {
    keywords: ["desactivar usuario", "bloquear usuario", "suspender cuenta"],
    rol: "SUPER_ADMIN",
    answer:
      "Para desactivar un usuario, ve a Panel Admin > Usuarios, busca al usuario y cambia su estado a 'Inactivo'. El usuario no podrá iniciar sesión hasta que lo reactives.",
  },

  // --- Extender trial ---
  {
    keywords: ["extender trial", "ampliar prueba", "mas dias", "renovar trial"],
    rol: "SUPER_ADMIN",
    answer:
      "Para extender el trial de un condominio, ve a Panel Admin > Condominios, haz clic en el condominio y usa el botón 'Extender Trial'. Esto agrega 14 días adicionales al período de prueba.",
  },

  // --- Despedidas ---
  {
    keywords: ["adios", "chao", "bye", "hasta luego", "nos vemos"],
    rol: "todos",
    answer:
      "¡Hasta luego! Si necesitas ayuda de nuevo, estaré aquí. ¡Que tengas un excelente día! 👋",
  },
  {
    keywords: ["que puedes hacer", "funciones", "capacidades", "que sabes"],
    rol: "todos",
    answer:
      "Puedo ayudarte con: navegar el sistema, explicar cómo usar cada módulo, resolver dudas sobre residentes, finanzas, servicios, incidencias, visitas, vehículos, áreas comunes y más. ¡Pregúntame lo que necesites!",
  },
];
