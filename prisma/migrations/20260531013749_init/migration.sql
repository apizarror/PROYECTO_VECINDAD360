-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'ADMIN_CONDOMINIO',
    "condominioId" TEXT,
    "inmuebleId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Condominio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ruc" TEXT,
    "razonSocial" TEXT,
    "modalidad" TEXT NOT NULL DEFAULT 'AUTOGESTION',
    "plan" TEXT NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" DATETIME,
    "planExpiresAt" DATETIME,
    "colorPrimario" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Lima',
    "moraDiaria" REAL NOT NULL DEFAULT 0.05,
    "whatsappBusinessId" TEXT,
    "pasarelaPago" TEXT NOT NULL DEFAULT 'Ninguna',
    "smtpHost" TEXT,
    "adminId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Edificio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "bloques" INTEGER NOT NULL DEFAULT 0,
    "pisosTotales" INTEGER NOT NULL DEFAULT 1,
    "departamentosTotales" INTEGER NOT NULL DEFAULT 1,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Edificio_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bloque" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "edificioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "pisos" INTEGER NOT NULL DEFAULT 1,
    "inmuebles" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bloque_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bloque_edificioId_fkey" FOREIGN KEY ("edificioId") REFERENCES "Edificio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inmueble" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "piso" INTEGER NOT NULL DEFAULT 0,
    "area" REAL NOT NULL DEFAULT 0,
    "habitaciones" INTEGER NOT NULL DEFAULT 0,
    "banos" INTEGER NOT NULL DEFAULT 0,
    "alicuota" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Desocupado',
    "saldo" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inmueble_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inmueble_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Natural',
    "documento" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "razonSocial" TEXT,
    "genero" TEXT,
    "fechaNacimiento" TEXT,
    "saldo" REAL NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Persona_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    CONSTRAINT "Contacto_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vinculacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personaId" TEXT NOT NULL,
    "inmuebleId" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    CONSTRAINT "Vinculacion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vinculacion_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MiembroDirectiva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "fechaInicio" TEXT NOT NULL,
    "fechaFin" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MiembroDirectiva_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MiembroDirectiva_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Multa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "inmuebleId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fechaEmision" TEXT NOT NULL,
    "fechaVencimiento" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "aplicadoPor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Multa_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Multa_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Multa_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AreaComun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "costoPorHora" REAL NOT NULL DEFAULT 0,
    "modoReserva" TEXT NOT NULL DEFAULT 'Por hora',
    "capacidadMaxima" INTEGER NOT NULL DEFAULT 0,
    "requiereGarantia" BOOLEAN NOT NULL DEFAULT false,
    "montoGarantia" REAL NOT NULL DEFAULT 0,
    "reglasUso" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'Activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AreaComun_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "areaComunId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "inmuebleId" TEXT,
    "fecha" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "costoTotal" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Solicitada',
    "observaciones" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reserva_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reserva_areaComunId_fkey" FOREIGN KEY ("areaComunId") REFERENCES "AreaComun" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reserva_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reserva_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Auto',
    "personaId" TEXT NOT NULL,
    "inmuebleId" TEXT,
    "espacioEstacionamiento" TEXT,
    "sticker" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehiculo_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vehiculo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vehiculo_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MovimientoVehicular" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "vehiculoId" TEXT,
    "placa" TEXT NOT NULL,
    "tipoMovimiento" TEXT NOT NULL,
    "fechaHora" TEXT NOT NULL,
    "registradoPor" TEXT NOT NULL,
    "observaciones" TEXT,
    "esVisitante" BOOLEAN NOT NULL DEFAULT false,
    "visitanteNombre" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MovimientoVehicular_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovimientoVehicular_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "visitanteDni" TEXT NOT NULL,
    "visitanteNombre" TEXT NOT NULL,
    "inmuebleId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "fechaHoraIngreso" TEXT NOT NULL,
    "fechaHoraSalida" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Programada',
    "qrGenerado" TEXT,
    "vehiculoPlaca" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Visita_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Visita_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Visita_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "tipoContrato" TEXT NOT NULL,
    "fechaIngreso" TEXT NOT NULL,
    "fechaSalida" TEXT,
    "salario" REAL NOT NULL DEFAULT 0,
    "telefono" TEXT,
    "email" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Empleado_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dispositivo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "empleadoId" TEXT,
    "fechaAsignacion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Disponible',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dispositivo_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dispositivo_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "tipoTurno" TEXT NOT NULL DEFAULT 'Mañana',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Horario_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Horario_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "prioridad" TEXT NOT NULL DEFAULT 'Media',
    "categoria" TEXT NOT NULL,
    "reportadaPor" TEXT NOT NULL,
    "asignadaA" TEXT NOT NULL,
    "fechaReporte" TEXT NOT NULL,
    "fechaCierre" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Abierta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Incidencia_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TareaProgramada" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "asignadaA" TEXT NOT NULL,
    "frecuencia" TEXT NOT NULL DEFAULT 'Mensual',
    "proximaEjecucion" TEXT NOT NULL,
    "ultimaEjecucion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TareaProgramada_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CuentaBancaria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Ahorros',
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "numeroCuenta" TEXT NOT NULL,
    "cci" TEXT NOT NULL,
    "titular" TEXT NOT NULL,
    "saldoInicial" REAL NOT NULL DEFAULT 0,
    "saldoActual" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CuentaBancaria_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "rubroNombre" TEXT NOT NULL,
    "montoPresupuestado" REAL NOT NULL DEFAULT 0,
    "montoEjecutado" REAL NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Presupuesto_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Egreso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "cuentaBancariaId" TEXT NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "fechaRegistro" TEXT NOT NULL,
    "fechaPago" TEXT,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "registradoPor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Egreso_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Egreso_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "origen" TEXT NOT NULL,
    "personaId" TEXT,
    "inmuebleId" TEXT,
    "cuentaBancariaId" TEXT NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "registradoPor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ingreso_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ingreso_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingreso_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingreso_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CargoServicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "inmuebleId" TEXT NOT NULL,
    "servicioNombre" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "lecturaAnterior" REAL,
    "lecturaActual" REAL,
    "consumo" REAL,
    "tarifa" REAL NOT NULL DEFAULT 0,
    "monto" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "registradoPor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CargoServicio_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CargoServicio_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "Inmueble" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CuotaMantenimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Ordinaria',
    "montoBase" REAL NOT NULL,
    "criterio" TEXT NOT NULL DEFAULT 'Igual',
    "fechaEmision" TEXT NOT NULL,
    "fechaVencimiento" TEXT NOT NULL,
    "moraDiaria" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Borrador',
    "inmueblesAplicados" INTEGER NOT NULL DEFAULT 0,
    "totalEmitido" REAL NOT NULL DEFAULT 0,
    "totalCobrado" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CuotaMantenimiento_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrupoRubro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GrupoRubro_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServicioRubro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Ordinario',
    "unidad" TEXT NOT NULL,
    "tarifaBase" REAL NOT NULL DEFAULT 0,
    "cuentaContable" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServicioRubro_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServicioRubro_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "GrupoRubro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Archivo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "visibilidad" TEXT NOT NULL DEFAULT 'Público',
    "subidoPor" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "tamano" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Archivo_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "condominioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notificacion_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notificacion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
