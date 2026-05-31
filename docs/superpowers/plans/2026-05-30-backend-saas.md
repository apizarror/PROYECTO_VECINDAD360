# Vecindad360 Backend SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Vecindad360 from a mock-data demo into a working multi-tenant SaaS with SQLite persistence, real auth, roles, and 15-day trial.

**Architecture:** Prisma ORM with SQLite for persistence (migrable to PostgreSQL). Auth via httpOnly cookies with sessions stored in DB. Multi-tenancy enforced by `condominioId` on every business table. TanStack React Query replaces in-memory mock stores on the frontend.

**Tech Stack:** Next.js 16, TypeScript, Prisma + SQLite, bcrypt, TanStack React Query, Zod

**Super Admin credentials:** email `admin@vecindad360.com`, password `123456`

---

## File Structure

### New files to create

```
prisma/
  schema.prisma                          # Full database schema
  seed.ts                                # Seed script with Super Admin + demo data

src/lib/
  prisma.ts                              # Prisma client singleton
  auth.ts                                # Auth helpers: hashPassword, verifyPassword, createSession, getSession, requireAuth
  api-helpers.ts                         # CRUD factory: createCrudHandlers(model, options)

src/app/api/auth/
  register/route.ts                      # POST - register admin + condominio
  login/route.ts                         # POST - login, create session cookie
  logout/route.ts                        # POST - destroy session
  me/route.ts                            # GET - current user from cookie

src/app/api/
  edificios/route.ts                     # GET/POST
  edificios/[id]/route.ts                # GET/PUT/DELETE
  bloques/route.ts
  bloques/[id]/route.ts
  inmuebles/route.ts
  inmuebles/[id]/route.ts
  personas/route.ts
  personas/[id]/route.ts
  directiva/route.ts
  directiva/[id]/route.ts
  multas/route.ts
  multas/[id]/route.ts
  areas-comunes/route.ts
  areas-comunes/[id]/route.ts
  reservas/route.ts
  reservas/[id]/route.ts
  vehiculos/route.ts
  vehiculos/[id]/route.ts
  movimientos/route.ts
  movimientos/[id]/route.ts
  visitas/route.ts
  visitas/[id]/route.ts
  empleados/route.ts
  empleados/[id]/route.ts
  dispositivos/route.ts
  dispositivos/[id]/route.ts
  horarios/route.ts
  horarios/[id]/route.ts
  incidencias/route.ts
  incidencias/[id]/route.ts
  tareas/route.ts
  tareas/[id]/route.ts
  cuentas-bancarias/route.ts
  cuentas-bancarias/[id]/route.ts
  presupuestos/route.ts
  presupuestos/[id]/route.ts
  egresos/route.ts
  egresos/[id]/route.ts
  ingresos/route.ts
  ingresos/[id]/route.ts
  cargos-servicio/route.ts
  cargos-servicio/[id]/route.ts
  cuotas/route.ts
  cuotas/[id]/route.ts
  grupos-rubro/route.ts
  grupos-rubro/[id]/route.ts
  servicios-rubro/route.ts
  servicios-rubro/[id]/route.ts
  archivos/route.ts
  archivos/[id]/route.ts
  notificaciones/route.ts
  notificaciones/[id]/route.ts
  admin/condominios/route.ts             # Super Admin: list all condominios
  admin/condominios/[id]/route.ts        # Super Admin: activate plan
  admin/metricas/route.ts                # Super Admin: global metrics

src/hooks/
  use-api.ts                             # Generic CRUD hooks using React Query

src/app/auth/
  register/page.tsx                      # Public registration page

src/components/dashboard/
  trial-overlay.tsx                      # Trial expired overlay

src/app/dashboard/admin/
  page.tsx                               # Super Admin dashboard
  condominios/page.tsx                   # Manage all condominios
```

### Files to modify

```
package.json                             # Add prisma, @prisma/client, bcryptjs
src/app/providers.tsx                    # Add QueryClientProvider
src/hooks/use-auth.tsx                   # Replace mock auth with API calls
src/app/dashboard/layout.tsx             # Add trial check
src/components/dashboard/sidebar.tsx     # Add admin menu, role-based visibility
src/app/dashboard/residentes/page.tsx    # Replace useMockStore with useApi
  (and all other dashboard pages)        # Same pattern
```

---

## Task 1: Install dependencies and set up Prisma

**Files:**
- Modify: `package.json`
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`

- [ ] **Step 1: Install Prisma and bcrypt**

```bash
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 2: Write the Prisma schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// ─── Core ──────────────────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  nombre        String
  apellidos     String
  dni           String?
  telefono      String?
  rol           String   @default("ADMIN_CONDOMINIO") // SUPER_ADMIN, ADMIN_CONDOMINIO, EMPLEADO, RESIDENTE
  condominioId  String?
  condominio    Condominio? @relation(fields: [condominioId], references: [id])
  inmuebleId    String?
  activo        Boolean  @default(true)
  avatar        String?
  sessions      Session[]
  notificaciones Notificacion[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Condominio {
  id              String   @id @default(cuid())
  nombre          String
  direccion       String
  ruc             String?
  razonSocial     String?
  modalidad       String   @default("AUTOGESTION") // AUTOGESTION, ADMINISTRADO
  plan            String   @default("TRIAL")       // TRIAL, BASICO, PRO, EMPRESARIAL
  trialEndsAt     DateTime?
  planExpiresAt   DateTime?
  colorPrimario   String?
  moneda          String   @default("PEN")
  zonaHoraria     String   @default("America/Lima")
  moraDiaria      Float    @default(0.05)
  whatsappBusinessId String?
  pasarelaPago    String   @default("Ninguna")
  smtpHost        String?
  adminId         String
  activo          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users           User[]
  edificios       Edificio[]
  bloques         Bloque[]
  inmuebles       Inmueble[]
  personas        Persona[]
  miembrosDirectiva MiembroDirectiva[]
  multas          Multa[]
  areasComunes    AreaComun[]
  reservas        Reserva[]
  vehiculos       Vehiculo[]
  movimientos     MovimientoVehicular[]
  visitas         Visita[]
  empleados       Empleado[]
  dispositivos    Dispositivo[]
  horarios        Horario[]
  incidencias     Incidencia[]
  tareas          TareaProgramada[]
  cuentasBancarias CuentaBancaria[]
  presupuestos    Presupuesto[]
  egresos         Egreso[]
  ingresos        Ingreso[]
  cargosServicio  CargoServicio[]
  cuotas          CuotaMantenimiento[]
  gruposRubro     GrupoRubro[]
  serviciosRubro  ServicioRubro[]
  archivos        Archivo[]
  notificaciones  Notificacion[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// ─── Inmobiliaria ──────────────────────────

model Edificio {
  id                    String   @id @default(cuid())
  condominioId          String
  condominio            Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  nombre                String
  direccion             String
  bloques               Int      @default(0)
  pisosTotales          Int      @default(1)
  departamentosTotales  Int      @default(1)
  estado                String   @default("Activo")
  bloquesRel            Bloque[]
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Bloque {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  edificioId    String
  edificio      Edificio @relation(fields: [edificioId], references: [id], onDelete: Cascade)
  nombre        String
  pisos         Int      @default(1)
  inmuebles     Int      @default(1)
  inmueblesRel  Inmueble[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Inmueble {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  bloqueId      String
  bloque        Bloque   @relation(fields: [bloqueId], references: [id], onDelete: Cascade)
  numero        String
  piso          Int      @default(0)
  area          Float    @default(0)
  habitaciones  Int      @default(0)
  banos         Int      @default(0)
  alicuota      Float    @default(0)
  estado        String   @default("Desocupado")
  saldo         Float    @default(0)
  vinculaciones Vinculacion[]
  reservas      Reserva[]
  vehiculos     Vehiculo[]
  visitas       Visita[]
  multas        Multa[]
  cargosServicio CargoServicio[]
  ingresos      Ingreso[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ─── Residentes ────────────────────────────

model Persona {
  id              String   @id @default(cuid())
  condominioId    String
  condominio      Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  tipo            String   @default("Natural")
  documento       String
  nombres         String
  apellidos       String
  razonSocial     String?
  genero          String?
  fechaNacimiento String?
  saldo           Float    @default(0)
  activo          Boolean  @default(true)
  contactos       Contacto[]
  vinculaciones   Vinculacion[]
  miembrosDirectiva MiembroDirectiva[]
  multas          Multa[]
  reservas        Reserva[]
  vehiculos       Vehiculo[]
  visitas         Visita[]
  ingresos        Ingreso[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Contacto {
  id        String   @id @default(cuid())
  personaId String
  persona   Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  tipo      String   // email, telefono
  valor     String
}

model Vinculacion {
  id         String   @id @default(cuid())
  personaId  String
  persona    Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  inmuebleId String
  inmueble   Inmueble @relation(fields: [inmuebleId], references: [id], onDelete: Cascade)
  rol        String   // Propietario, Inquilino, Familiar
}

model MiembroDirectiva {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  personaId     String
  persona       Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  cargo         String
  fechaInicio   String
  fechaFin      String
  estado        String   @default("Activo")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Multa {
  id               String   @id @default(cuid())
  condominioId     String
  condominio       Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  personaId        String
  persona          Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  inmuebleId       String
  inmueble         Inmueble @relation(fields: [inmuebleId], references: [id], onDelete: Cascade)
  motivo           String
  descripcion      String
  monto            Float
  fechaEmision     String
  fechaVencimiento String
  estado           String   @default("Pendiente")
  aplicadoPor      String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// ─── Áreas Comunes ─────────────────────────

model AreaComun {
  id               String   @id @default(cuid())
  condominioId     String
  condominio       Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  nombre           String
  descripcion      String
  costoPorHora     Float    @default(0)
  modoReserva      String   @default("Por hora")
  capacidadMaxima  Int      @default(0)
  requiereGarantia Boolean  @default(false)
  montoGarantia    Float    @default(0)
  reglasUso        String   @default("")
  estado           String   @default("Activa")
  reservas         Reserva[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Reserva {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  areaComunId   String
  areaComun     AreaComun @relation(fields: [areaComunId], references: [id], onDelete: Cascade)
  personaId     String
  persona       Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  inmuebleId    String?
  inmueble      Inmueble? @relation(fields: [inmuebleId], references: [id])
  fecha         String
  horaInicio    String
  horaFin       String
  costoTotal    Float    @default(0)
  estado        String   @default("Solicitada")
  observaciones String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ─── Vehículos ─────────────────────────────

model Vehiculo {
  id                     String   @id @default(cuid())
  condominioId           String
  condominio             Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  placa                  String
  marca                  String
  modelo                 String
  color                  String
  ano                    Int
  tipo                   String   @default("Auto")
  personaId              String
  persona                Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  inmuebleId             String?
  inmueble               Inmueble? @relation(fields: [inmuebleId], references: [id])
  espacioEstacionamiento String?
  sticker                String?
  estado                 String   @default("Activo")
  movimientos            MovimientoVehicular[]
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}

model MovimientoVehicular {
  id              String   @id @default(cuid())
  condominioId    String
  condominio      Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  vehiculoId      String?
  vehiculo        Vehiculo? @relation(fields: [vehiculoId], references: [id])
  placa           String
  tipoMovimiento  String
  fechaHora       String
  registradoPor   String
  observaciones   String?
  esVisitante     Boolean  @default(false)
  visitanteNombre String?
  createdAt       DateTime @default(now())
}

model Visita {
  id               String   @id @default(cuid())
  condominioId     String
  condominio       Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  visitanteDni     String
  visitanteNombre  String
  inmuebleId       String
  inmueble         Inmueble @relation(fields: [inmuebleId], references: [id], onDelete: Cascade)
  personaId        String
  persona          Persona  @relation(fields: [personaId], references: [id], onDelete: Cascade)
  motivo           String
  fechaHoraIngreso String
  fechaHoraSalida  String?
  estado           String   @default("Programada")
  qrGenerado       String?
  vehiculoPlaca    String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// ─── Empleados ─────────────────────────────

model Empleado {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  dni           String
  nombres       String
  apellidos     String
  cargo         String
  tipoContrato  String
  fechaIngreso  String
  fechaSalida   String?
  salario       Float    @default(0)
  telefono      String?
  email         String?
  estado        String   @default("Activo")
  dispositivos  Dispositivo[]
  horarios      Horario[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Dispositivo {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  tipo          String
  marca         String
  modelo        String
  numeroSerie   String
  empleadoId    String?
  empleado      Empleado? @relation(fields: [empleadoId], references: [id])
  fechaAsignacion String?
  estado        String   @default("Disponible")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Horario {
  id           String   @id @default(cuid())
  condominioId String
  condominio   Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  empleadoId   String
  empleado     Empleado @relation(fields: [empleadoId], references: [id], onDelete: Cascade)
  diaSemana    String
  horaInicio   String
  horaFin      String
  tipoTurno    String   @default("Mañana")
  createdAt    DateTime @default(now())
}

// ─── Incidencias y Tareas ──────────────────

model Incidencia {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  titulo        String
  descripcion   String
  ubicacion     String
  prioridad     String   @default("Media")
  categoria     String
  reportadaPor  String
  asignadaA     String
  fechaReporte  String
  fechaCierre   String?
  estado        String   @default("Abierta")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model TareaProgramada {
  id               String   @id @default(cuid())
  condominioId     String
  condominio       Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  titulo           String
  descripcion      String
  asignadaA        String
  frecuencia       String   @default("Mensual")
  proximaEjecucion String
  ultimaEjecucion  String?
  estado           String   @default("Pendiente")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// ─── Financiero ────────────────────────────

model CuentaBancaria {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  banco         String
  tipo          String   @default("Ahorros")
  moneda        String   @default("PEN")
  numeroCuenta  String
  cci           String
  titular       String
  saldoInicial  Float    @default(0)
  saldoActual   Float    @default(0)
  estado        String   @default("Activa")
  egresos       Egreso[]
  ingresos      Ingreso[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Presupuesto {
  id                 String   @id @default(cuid())
  condominioId       String
  condominio         Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  ano                Int
  rubroNombre        String
  montoPresupuestado Float    @default(0)
  montoEjecutado     Float    @default(0)
  observaciones      String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Egreso {
  id                 String   @id @default(cuid())
  condominioId       String
  condominio         Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  concepto           String
  monto              Float
  categoria          String
  proveedor          String
  cuentaBancariaId   String
  cuentaBancaria     CuentaBancaria @relation(fields: [cuentaBancariaId], references: [id])
  metodoPago         String
  fechaRegistro      String
  fechaPago          String?
  descripcion        String
  estado             String   @default("Pendiente")
  registradoPor      String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Ingreso {
  id                 String   @id @default(cuid())
  condominioId       String
  condominio         Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  concepto           String
  monto              Float
  origen             String
  personaId          String?
  persona            Persona? @relation(fields: [personaId], references: [id])
  inmuebleId         String?
  inmueble           Inmueble? @relation(fields: [inmuebleId], references: [id])
  cuentaBancariaId   String
  cuentaBancaria     CuentaBancaria @relation(fields: [cuentaBancariaId], references: [id])
  metodoPago         String
  fecha              String
  estado             String   @default("Pendiente")
  registradoPor      String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model CargoServicio {
  id              String   @id @default(cuid())
  condominioId    String
  condominio      Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  inmuebleId      String
  inmueble        Inmueble @relation(fields: [inmuebleId], references: [id], onDelete: Cascade)
  servicioNombre  String
  periodo         String
  lecturaAnterior Float?
  lecturaActual   Float?
  consumo         Float?
  tarifa          Float    @default(0)
  monto           Float    @default(0)
  estado          String   @default("Pendiente")
  registradoPor   String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CuotaMantenimiento {
  id                 String   @id @default(cuid())
  condominioId       String
  condominio         Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  periodo            String
  tipo               String   @default("Ordinaria")
  montoBase          Float
  criterio           String   @default("Igual")
  fechaEmision       String
  fechaVencimiento   String
  moraDiaria         Float    @default(0)
  estado             String   @default("Borrador")
  inmueblesAplicados Int      @default(0)
  totalEmitido       Float    @default(0)
  totalCobrado       Float    @default(0)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

// ─── Configuraciones ───────────────────────

model GrupoRubro {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  nombre        String
  orden         Int      @default(0)
  servicios     ServicioRubro[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ServicioRubro {
  id              String   @id @default(cuid())
  condominioId    String
  condominio      Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  grupoId         String
  grupo           GrupoRubro @relation(fields: [grupoId], references: [id], onDelete: Cascade)
  nombre          String
  tipo            String   @default("Ordinario")
  unidad          String
  tarifaBase      Float    @default(0)
  cuentaContable  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ─── Archivos y Notificaciones ─────────────

model Archivo {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  nombre        String
  descripcion   String?
  categoria     String
  formato       String
  visibilidad   String   @default("Público")
  subidoPor     String
  fecha         String
  tamano        String?
  url           String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Notificacion {
  id            String   @id @default(cuid())
  condominioId  String
  condominio    Condominio @relation(fields: [condominioId], references: [id], onDelete: Cascade)
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  titulo        String
  descripcion   String
  tipo          String
  leida         Boolean  @default(false)
  fecha         String
  createdAt     DateTime @default(now())
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Run initial migration**

```bash
npx prisma migrate dev --name init
```

Expected: SQLite database created at `prisma/dev.db` with all tables.

- [ ] **Step 5: Commit**

```bash
git add prisma/ src/lib/prisma.ts package.json package-lock.json
git commit -m "feat: Prisma schema + SQLite database with all tables"
```

---

## Task 2: Seed script with Super Admin and demo data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add prisma.seed config)

- [ ] **Step 1: Add seed config to package.json**

Add to `package.json` root:

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

Install tsx:

```bash
npm install -D tsx
```

- [ ] **Step 2: Write the seed script**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notificacion.deleteMany();
  await prisma.archivo.deleteMany();
  await prisma.servicioRubro.deleteMany();
  await prisma.grupoRubro.deleteMany();
  await prisma.cuotaMantenimiento.deleteMany();
  await prisma.cargoServicio.deleteMany();
  await prisma.ingreso.deleteMany();
  await prisma.egreso.deleteMany();
  await prisma.presupuesto.deleteMany();
  await prisma.cuentaBancaria.deleteMany();
  await prisma.tareaProgramada.deleteMany();
  await prisma.incidencia.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.dispositivo.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.visita.deleteMany();
  await prisma.movimientoVehicular.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.areaComun.deleteMany();
  await prisma.multa.deleteMany();
  await prisma.miembroDirectiva.deleteMany();
  await prisma.vinculacion.deleteMany();
  await prisma.contacto.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.inmueble.deleteMany();
  await prisma.bloque.deleteMany();
  await prisma.edificio.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.condominio.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@vecindad360.com",
      password: hashedPassword,
      nombre: "Admin",
      apellidos: "Vecindad360",
      dni: "00000000",
      telefono: "+51 984798650",
      rol: "SUPER_ADMIN",
      avatar: "AV",
      activo: true,
    },
  });

  // Demo condominium
  const condo = await prisma.condominio.create({
    data: {
      nombre: "Residencial Torre Sol",
      direccion: "Av. El Sol 1234, San Isidro, Lima",
      ruc: "20601234567",
      razonSocial: "Junta de Propietarios Torre Sol",
      modalidad: "AUTOGESTION",
      plan: "PRO",
      trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      adminId: superAdmin.id,
      activo: true,
    },
  });

  // Admin for the demo condominium
  const adminCondo = await prisma.user.create({
    data: {
      email: "demo@vecindad360.com",
      password: await bcrypt.hash("demo123", 10),
      nombre: "Carlos",
      apellidos: "Mendoza",
      dni: "45678901",
      telefono: "+51 999555666",
      rol: "ADMIN_CONDOMINIO",
      condominioId: condo.id,
      avatar: "CM",
      activo: true,
    },
  });

  // Edificio
  const edificio = await prisma.edificio.create({
    data: {
      condominioId: condo.id,
      nombre: "Torre Sol",
      direccion: "Av. El Sol 1234",
      bloques: 3,
      pisosTotales: 10,
      departamentosTotales: 30,
      estado: "Activo",
    },
  });

  // Bloques
  const bloqueA = await prisma.bloque.create({
    data: { condominioId: condo.id, edificioId: edificio.id, nombre: "Torre A", pisos: 10, inmuebles: 10 },
  });
  const bloqueB = await prisma.bloque.create({
    data: { condominioId: condo.id, edificioId: edificio.id, nombre: "Torre B", pisos: 10, inmuebles: 10 },
  });

  // Inmuebles
  const inmueble101 = await prisma.inmueble.create({
    data: { condominioId: condo.id, bloqueId: bloqueA.id, numero: "101", piso: 1, area: 85, habitaciones: 3, banos: 2, alicuota: 3.33, estado: "Ocupado", saldo: 0 },
  });
  const inmueble102 = await prisma.inmueble.create({
    data: { condominioId: condo.id, bloqueId: bloqueA.id, numero: "102", piso: 1, area: 72, habitaciones: 2, banos: 1, alicuota: 2.78, estado: "Ocupado", saldo: -120 },
  });
  const inmueble201 = await prisma.inmueble.create({
    data: { condominioId: condo.id, bloqueId: bloqueA.id, numero: "201", piso: 2, area: 95, habitaciones: 3, banos: 2, alicuota: 3.67, estado: "Ocupado", saldo: 0 },
  });
  const inmueble301 = await prisma.inmueble.create({
    data: { condominioId: condo.id, bloqueId: bloqueB.id, numero: "301", piso: 3, area: 110, habitaciones: 4, banos: 3, alicuota: 4.5, estado: "Ocupado", saldo: -1250 },
  });
  const inmueble302 = await prisma.inmueble.create({
    data: { condominioId: condo.id, bloqueId: bloqueB.id, numero: "302", piso: 3, area: 65, habitaciones: 2, banos: 1, alicuota: 2.5, estado: "Desocupado", saldo: 0 },
  });

  // Personas (residentes)
  const luis = await prisma.persona.create({
    data: {
      condominioId: condo.id, tipo: "Natural", documento: "45678901", nombres: "Luis", apellidos: "García",
      genero: "M", saldo: 0, activo: true,
      contactos: { create: [{ tipo: "email", valor: "luis@email.com" }, { tipo: "telefono", valor: "999111222" }] },
      vinculaciones: { create: [{ inmuebleId: inmueble101.id, rol: "Propietario" }] },
    },
  });
  const maria = await prisma.persona.create({
    data: {
      condominioId: condo.id, tipo: "Natural", documento: "32145698", nombres: "María", apellidos: "Torres",
      genero: "F", saldo: -120, activo: true,
      contactos: { create: [{ tipo: "email", valor: "maria@email.com" }, { tipo: "telefono", valor: "999333444" }] },
      vinculaciones: { create: [{ inmuebleId: inmueble102.id, rol: "Propietario" }] },
    },
  });
  const ana = await prisma.persona.create({
    data: {
      condominioId: condo.id, tipo: "Natural", documento: "78912345", nombres: "Ana", apellidos: "Quispe",
      genero: "F", saldo: 0, activo: true,
      contactos: { create: [{ tipo: "email", valor: "ana@email.com" }] },
      vinculaciones: { create: [{ inmuebleId: inmueble201.id, rol: "Inquilino" }] },
    },
  });
  const pedro = await prisma.persona.create({
    data: {
      condominioId: condo.id, tipo: "Natural", documento: "65432198", nombres: "Pedro", apellidos: "Sánchez",
      genero: "M", saldo: -1250, activo: true,
      contactos: { create: [{ tipo: "telefono", valor: "999555666" }] },
      vinculaciones: { create: [{ inmuebleId: inmueble301.id, rol: "Propietario" }] },
    },
  });

  // Áreas comunes
  const parrilla = await prisma.areaComun.create({
    data: { condominioId: condo.id, nombre: "Parrilla", descripcion: "Zona de parrilla con mesas y sillas", costoPorHora: 25, modoReserva: "Por hora", capacidadMaxima: 15, requiereGarantia: true, montoGarantia: 50, reglasUso: "Máximo 15 personas. Limpiar después de usar.", estado: "Activa" },
  });
  await prisma.areaComun.create({
    data: { condominioId: condo.id, nombre: "Salón de Eventos", descripcion: "Salón multiusos para reuniones y eventos", costoPorHora: 50, modoReserva: "Medio día", capacidadMaxima: 50, requiereGarantia: true, montoGarantia: 200, reglasUso: "Reservar con 48 horas de anticipación.", estado: "Activa" },
  });
  await prisma.areaComun.create({
    data: { condominioId: condo.id, nombre: "Piscina", descripcion: "Piscina para adultos y niños", costoPorHora: 0, modoReserva: "Por hora", capacidadMaxima: 30, requiereGarantia: false, montoGarantia: 0, reglasUso: "Horario: 8am-8pm. Prohibido alimentos.", estado: "Activa" },
  });

  // Cuenta bancaria
  const cuentaBCP = await prisma.cuentaBancaria.create({
    data: { condominioId: condo.id, banco: "BCP", tipo: "Ahorros", moneda: "PEN", numeroCuenta: "191-2345678-0-12", cci: "00219112345678012345", titular: "Junta de Propietarios Torre Sol", saldoInicial: 20000, saldoActual: 24850, estado: "Activa" },
  });

  // Empleado
  await prisma.empleado.create({
    data: { condominioId: condo.id, dni: "44556677", nombres: "Roberto", apellidos: "Flores", cargo: "Conserje", tipoContrato: "Planilla", fechaIngreso: "2024-03-15", salario: 1200, telefono: "999888777", email: "roberto@email.com", estado: "Activo" },
  });

  console.log("Seed completado exitosamente");
  console.log(`Super Admin: admin@vecindad360.com / 123456`);
  console.log(`Demo Admin: demo@vecindad360.com / demo123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 3: Run seed**

```bash
npx prisma db seed
```

Expected: "Seed completado exitosamente" with two users listed.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: seed script con Super Admin y datos demo"
```

---

## Task 3: Auth library (password hashing, sessions, cookie helpers)

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Write auth helpers**

Create `src/lib/auth.ts`:

```typescript
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          condominio: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(...roles: string[]) {
  const user = await requireAuth();
  if (!roles.includes(user.rol)) throw new Error("Forbidden");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.delete("session_token");
  }
}

export function isTrialExpired(condominio: { plan: string; trialEndsAt: Date | null }) {
  if (condominio.plan !== "TRIAL") return false;
  if (!condominio.trialEndsAt) return true;
  return new Date() > condominio.trialEndsAt;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: auth library con sesiones, cookies y helpers"
```

---

## Task 4: Auth API routes (register, login, logout, me)

**Files:**
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`

- [ ] **Step 1: Register route**

Create `src/app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nombre, apellidos, telefono, condominioNombre, direccion, unidades, modalidad } = body;

    if (!email || !password || !nombre || !apellidos || !condominioNombre || !direccion) {
      return NextResponse.json({ error: "Campos obligatorios faltantes" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const trialEndsAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellidos,
        telefono: telefono || null,
        rol: "ADMIN_CONDOMINIO",
        avatar: `${nombre[0]}${apellidos[0]}`.toUpperCase(),
        activo: true,
      },
    });

    const condominio = await prisma.condominio.create({
      data: {
        nombre: condominioNombre,
        direccion,
        modalidad: modalidad === "ADMINISTRADO" ? "ADMINISTRADO" : "AUTOGESTION",
        plan: "TRIAL",
        trialEndsAt,
        adminId: user.id,
        activo: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { condominioId: condominio.id },
    });

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, nombre: user.nombre, apellidos: user.apellidos, rol: user.rol, avatar: user.avatar },
      condominio: { id: condominio.id, nombre: condominio.nombre, plan: condominio.plan, trialEndsAt: condominio.trialEndsAt },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Login route**

Create `src/app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { condominio: true },
    });

    if (!user || !user.activo) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        telefono: user.telefono,
        rol: user.rol,
        avatar: user.avatar,
        condominioId: user.condominioId,
      },
      condominio: user.condominio ? {
        id: user.condominio.id,
        nombre: user.condominio.nombre,
        plan: user.condominio.plan,
        trialEndsAt: user.condominio.trialEndsAt,
        modalidad: user.condominio.modalidad,
      } : null,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Logout route**

Create `src/app/api/auth/logout/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Me route**

Create `src/app/api/auth/me/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getSession, isTrialExpired } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const trialExpired = user.condominio ? isTrialExpired(user.condominio) : false;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        telefono: user.telefono,
        rol: user.rol,
        avatar: user.avatar,
        condominioId: user.condominioId,
      },
      condominio: user.condominio ? {
        id: user.condominio.id,
        nombre: user.condominio.nombre,
        plan: user.condominio.plan,
        trialEndsAt: user.condominio.trialEndsAt,
        modalidad: user.condominio.modalidad,
      } : null,
      trialExpired,
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: auth API routes (register, login, logout, me)"
```

---

## Task 5: CRUD API factory and resource routes

**Files:**
- Create: `src/lib/api-helpers.ts`
- Create: All resource API route files (edificios, personas, etc.)

- [ ] **Step 1: Write CRUD factory**

Create `src/lib/api-helpers.ts`:

```typescript
import { NextResponse } from "next/server";
import { getSession, isTrialExpired } from "./auth";
import { prisma } from "./prisma";

type PrismaModel = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown | null>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

interface CrudOptions {
  model: string;
  allowedRoles?: string[];
  include?: Record<string, boolean>;
}

function getModel(modelName: string): PrismaModel {
  return (prisma as Record<string, unknown>)[modelName] as PrismaModel;
}

async function authenticate(options?: { allowedRoles?: string[] }) {
  const user = await getSession();
  if (!user) return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }), user: null };

  if (options?.allowedRoles && !options.allowedRoles.includes(user.rol)) {
    return { error: NextResponse.json({ error: "Sin permisos" }, { status: 403 }), user: null };
  }

  if (user.condominio && isTrialExpired(user.condominio)) {
    return { error: NextResponse.json({ error: "Período de prueba vencido" }, { status: 403 }), user: null };
  }

  return { error: null, user };
}

export function createListHandler(options: CrudOptions) {
  return async function GET() {
    const { error, user } = await authenticate({ allowedRoles: options.allowedRoles });
    if (error || !user) return error;

    const model = getModel(options.model);
    const where = user.rol === "SUPER_ADMIN" ? {} : { condominioId: user.condominioId };
    const items = await model.findMany({ where, ...(options.include ? { include: options.include } : {}), orderBy: { createdAt: "desc" } } as unknown);
    return NextResponse.json(items);
  };
}

export function createCreateHandler(options: CrudOptions) {
  return async function POST(request: Request) {
    const { error, user } = await authenticate({ allowedRoles: options.allowedRoles });
    if (error || !user) return error;

    const body = await request.json();
    const model = getModel(options.model);
    const item = await model.create({
      data: { ...body, condominioId: user.condominioId },
    } as unknown);
    return NextResponse.json(item, { status: 201 });
  };
}

export function createGetHandler(options: CrudOptions) {
  return async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error, user } = await authenticate({ allowedRoles: options.allowedRoles });
    if (error || !user) return error;

    const { id } = await params;
    const model = getModel(options.model);
    const where = user.rol === "SUPER_ADMIN" ? { id } : { id, condominioId: user.condominioId };
    const item = await model.findUnique({ where, ...(options.include ? { include: options.include } : {}) } as unknown);
    if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(item);
  };
}

export function createUpdateHandler(options: CrudOptions) {
  return async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error, user } = await authenticate({ allowedRoles: options.allowedRoles });
    if (error || !user) return error;

    const { id } = await params;
    const body = await request.json();
    const model = getModel(options.model);

    // Verify ownership
    const existing = await model.findUnique({ where: { id } } as unknown) as { condominioId?: string } | null;
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (user.rol !== "SUPER_ADMIN" && existing.condominioId !== user.condominioId) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { id: _id, condominioId: _cid, createdAt: _ca, updatedAt: _ua, ...updateData } = body;
    const item = await model.update({ where: { id }, data: updateData } as unknown);
    return NextResponse.json(item);
  };
}

export function createDeleteHandler(options: CrudOptions) {
  return async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error, user } = await authenticate({ allowedRoles: options.allowedRoles });
    if (error || !user) return error;

    const { id } = await params;
    const model = getModel(options.model);

    const existing = await model.findUnique({ where: { id } } as unknown) as { condominioId?: string } | null;
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (user.rol !== "SUPER_ADMIN" && existing.condominioId !== user.condominioId) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    await model.delete({ where: { id } } as unknown);
    return NextResponse.json({ success: true });
  };
}
```

- [ ] **Step 2: Create resource routes (all follow the same pattern)**

Example for `src/app/api/edificios/route.ts`:

```typescript
import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "edificio" };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
```

Example for `src/app/api/edificios/[id]/route.ts`:

```typescript
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-helpers";

const options = { model: "edificio" };

export const GET = createGetHandler(options);
export const PUT = createUpdateHandler(options);
export const DELETE = createDeleteHandler(options);
```

Create this same 2-file pattern for each resource:
- `edificios`, `bloques`, `inmuebles`, `personas` (with include: `{ contactos: true, vinculaciones: true }`), `directiva` (model: `miembroDirectiva`), `multas` (model: `multa`), `areas-comunes` (model: `areaComun`), `reservas` (model: `reserva`), `vehiculos` (model: `vehiculo`), `movimientos` (model: `movimientoVehicular`), `visitas` (model: `visita`), `empleados` (model: `empleado`), `dispositivos` (model: `dispositivo`), `horarios` (model: `horario`), `incidencias` (model: `incidencia`), `tareas` (model: `tareaProgramada`), `cuentas-bancarias` (model: `cuentaBancaria`), `presupuestos` (model: `presupuesto`), `egresos` (model: `egreso`), `ingresos` (model: `ingreso`), `cargos-servicio` (model: `cargoServicio`), `cuotas` (model: `cuotaMantenimiento`), `grupos-rubro` (model: `grupoRubro`), `servicios-rubro` (model: `servicioRubro`), `archivos` (model: `archivo`), `notificaciones` (model: `notificacion`)

- [ ] **Step 3: Commit**

```bash
git add src/lib/api-helpers.ts src/app/api/
git commit -m "feat: CRUD API factory + routes para todos los recursos"
```

---

## Task 6: Frontend auth hook and providers (replace mock auth)

**Files:**
- Modify: `src/hooks/use-auth.tsx`
- Modify: `src/app/providers.tsx`
- Create: `src/hooks/use-api.ts`

- [ ] **Step 1: Rewrite use-auth.tsx to use API**

Replace `src/hooks/use-auth.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string | null;
  telefono: string | null;
  rol: "SUPER_ADMIN" | "ADMIN_CONDOMINIO" | "EMPLEADO" | "RESIDENTE";
  avatar: string | null;
  condominioId: string | null;
}

interface Condominio {
  id: string;
  nombre: string;
  plan: string;
  trialEndsAt: string | null;
  modalidad: string;
}

interface AuthContextType {
  user: User | null;
  condominio: Condominio | null;
  trialExpired: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  condominioNombre: string;
  direccion: string;
  unidades?: number;
  modalidad: "AUTOGESTION" | "ADMINISTRADO";
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  condominio: null,
  trialExpired: false,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setCondominio(data.condominio);
        setTrialExpired(data.trialExpired || false);
      } else {
        setUser(null);
        setCondominio(null);
        setTrialExpired(false);
      }
    } catch {
      setUser(null);
      setCondominio(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setUser(data.user);
      setCondominio(data.condominio);
      setTrialExpired(false);
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión" };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.error };

      setUser(result.user);
      setCondominio(result.condominio);
      setTrialExpired(false);
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión" };
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCondominio(null);
    setTrialExpired(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      condominio,
      trialExpired,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

- [ ] **Step 2: Update providers.tsx to add QueryClientProvider**

Replace `src/app/providers.tsx`:

```typescript
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000, retry: 1 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 3: Create generic API hook**

Create `src/hooks/use-api.ts`:

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error del servidor" }));
    throw new Error(error.error || "Error del servidor");
  }
  return res.json();
}

export function useApiList<T>(resource: string) {
  return useQuery<T[]>({
    queryKey: [resource],
    queryFn: () => apiFetch<T[]>(`/api/${resource}`),
  });
}

export function useApiGet<T>(resource: string, id: string | undefined) {
  return useQuery<T>({
    queryKey: [resource, id],
    queryFn: () => apiFetch<T>(`/api/${resource}/${id}`),
    enabled: !!id,
  });
}

export function useApiCreate<T>(resource: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, Record<string, unknown>>({
    mutationFn: (data) => apiFetch<T>(`/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useApiUpdate<T>(resource: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { id: string; data: Record<string, unknown> }>({
    mutationFn: ({ id, data }) => apiFetch<T>(`/api/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useApiDelete(resource: string) {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch(`/api/${resource}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-auth.tsx src/hooks/use-api.ts src/app/providers.tsx
git commit -m "feat: auth hook con API + React Query provider + useApi hooks"
```

---

## Task 7: Update login page to use real auth

**Files:**
- Modify: `src/app/auth/page.tsx`
- Modify: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Update login page**

Update `src/app/auth/page.tsx` to call `login()` from the new auth hook which uses the API instead of the mock USERS dictionary. The form structure stays the same — only the `onSubmit` handler changes to use `const { success, error } = await login(username, password)` instead of the previous mock check.

- [ ] **Step 2: Update dashboard layout for loading state**

Update `src/app/dashboard/layout.tsx` to use `isLoading` from the auth hook: show `LoadingScreen` while `isLoading` is true, redirect to `/auth` when `!isLoading && !isAuthenticated`.

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/page.tsx src/app/dashboard/layout.tsx
git commit -m "feat: login page y layout usan auth real con API"
```

---

## Task 8: Trial expired overlay

**Files:**
- Create: `src/components/dashboard/trial-overlay.tsx`
- Modify: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Create trial overlay component**

Create `src/components/dashboard/trial-overlay.tsx`:

```typescript
"use client";

import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Básico", price: "S/ 99", units: "Hasta 20 unidades" },
  { name: "Pro", price: "S/ 269", units: "Hasta 100 unidades" },
  { name: "Empresarial", price: "S/ 679", units: "Ilimitado" },
];

export function TrialOverlay() {
  const whatsappUrl = "https://wa.me/51984798650?text=Hola%2C%20quiero%20activar%20mi%20plan%20de%20Vecindad360";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center">
          <Phone className="h-8 w-8 text-accent-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-surface-800">Tu período de prueba ha vencido</h2>
          <p className="text-surface-500 mt-2">Contacta con nosotros para activar tu plan y seguir gestionando tu condominio.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div key={plan.name} className="border border-surface-200 rounded-xl p-3">
              <p className="font-bold text-surface-800">{plan.name}</p>
              <p className="text-xl font-extrabold text-primary-600">{plan.price}</p>
              <p className="text-xs text-surface-400">/mes</p>
              <p className="text-xs text-surface-500 mt-1">{plan.units}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="accent" size="lg" className="w-full">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contactar por WhatsApp
            </Button>
          </a>
          <p className="text-sm text-surface-500">
            O yapea al <span className="font-bold text-surface-700">984 798 650</span> el monto de tu plan
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add trial check to dashboard layout**

In `src/app/dashboard/layout.tsx`, import `useAuth` and `TrialOverlay`. After the auth check, add:

```typescript
const { trialExpired } = useAuth();

// Inside the return, before {children}:
{trialExpired && <TrialOverlay />}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/trial-overlay.tsx src/app/dashboard/layout.tsx
git commit -m "feat: trial overlay cuando vence la prueba de 15 días"
```

---

## Task 9: Migrate first dashboard page (residentes) from mock to API

**Files:**
- Modify: `src/app/dashboard/residentes/page.tsx`

- [ ] **Step 1: Replace useMockStore with useApi hooks**

In `src/app/dashboard/residentes/page.tsx`:

1. Remove imports: `useMockStore`, `residentes as initialResidentes` from mock data
2. Add imports: `useApiList`, `useApiCreate`, `useApiUpdate`, `useApiDelete` from `@/hooks/use-api`
3. Replace `const store = useMockStore<Persona>(initialResidentes)` with:

```typescript
const { data: items = [], isLoading } = useApiList<Persona>("personas");
const createMutation = useApiCreate<Persona>("personas");
const updateMutation = useApiUpdate<Persona>("personas");
const deleteMutation = useApiDelete("personas");
```

4. Update `handleSubmit` to use mutations:

```typescript
const handleSubmit = useCallback(
  async (data: Record<string, unknown>) => {
    const payload = {
      tipo: data.tipo,
      documento: data.documento,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
    };

    if (form?.mode === "edit" && form.item) {
      await updateMutation.mutateAsync({ id: form.item.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload as Record<string, unknown>);
    }
    setForm(null);
  },
  [form, createMutation, updateMutation]
);
```

5. Update `handleDelete` to use `deleteMutation.mutate(deleteTarget.id)`
6. Replace `store.items` with `items` in the filtered memo and rendering
7. Add loading state: if `isLoading`, show a loading indicator

- [ ] **Step 2: Test the page works**

Run `npm run dev`, navigate to `/dashboard/residentes`, verify:
- List loads from API (initially shows seed data)
- Create a new resident
- Edit an existing resident
- Delete a resident
- Page refresh preserves data

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/residentes/page.tsx
git commit -m "feat: residentes migrado de mock a API real"
```

---

## Task 10: Migrate remaining dashboard pages from mock to API

**Files:**
- Modify: All remaining dashboard pages that use `useMockStore`

- [ ] **Step 1: Apply the same pattern from Task 9 to all pages**

Each page follows the same migration:
1. Remove `useMockStore` and mock data imports
2. Add `useApiList`, `useApiCreate`, `useApiUpdate`, `useApiDelete` imports
3. Replace store with query/mutation hooks
4. Update handlers to use mutations
5. Add loading state

Pages to migrate (resource → API endpoint):
- `residentes/directiva/page.tsx` → `directiva`
- `residentes/multas/page.tsx` → `multas`
- `areas-comunes/page.tsx` → `areas-comunes`
- `areas-comunes/reservas/page.tsx` → `reservas`
- `inmobiliaria/page.tsx` → `edificios`, `bloques`, `inmuebles` (this page uses 3 stores)
- `empleados/page.tsx` → `empleados`
- `empleados/dispositivos/page.tsx` → `dispositivos`
- `empleados/horarios/page.tsx` → `horarios`
- `financiero/cuentas/page.tsx` → `cuentas-bancarias`
- `financiero/presupuestos/page.tsx` → `presupuestos`
- `financiero/egresos/page.tsx` → `egresos`
- `financiero/ingresos/page.tsx` → `ingresos`
- `servicios/cargos-servicio/page.tsx` → `cargos-servicio`
- `servicios/cuotas/page.tsx` → `cuotas`
- `incidencias/page.tsx` → `incidencias`
- `tareas/page.tsx` → `tareas`
- `vehiculos/page.tsx` → `vehiculos`
- `vehiculos/movimiento/page.tsx` → `movimientos`
- `visitas/page.tsx` → `visitas`
- `configuraciones/page.tsx` → `grupos-rubro`, `servicios-rubro`
- `archivos/page.tsx` → `archivos`
- `notificaciones/page.tsx` → `notificaciones`

- [ ] **Step 2: Commit after each batch (group by module)**

```bash
git commit -m "feat: migrar residentes (directiva, multas) a API"
git commit -m "feat: migrar areas-comunes y reservas a API"
git commit -m "feat: migrar inmobiliaria a API"
git commit -m "feat: migrar empleados (dispositivos, horarios) a API"
git commit -m "feat: migrar financiero (cuentas, presupuestos, egresos, ingresos) a API"
git commit -m "feat: migrar servicios (cargos, cuotas) a API"
git commit -m "feat: migrar incidencias, tareas, vehiculos, visitas a API"
git commit -m "feat: migrar configuraciones, archivos, notificaciones a API"
```

---

## Task 11: Super Admin panel

**Files:**
- Create: `src/app/api/admin/condominios/route.ts`
- Create: `src/app/api/admin/condominios/[id]/route.ts`
- Create: `src/app/api/admin/metricas/route.ts`
- Create: `src/app/dashboard/admin/page.tsx`
- Create: `src/app/dashboard/admin/condominios/page.tsx`
- Modify: `src/components/dashboard/sidebar.tsx`

- [ ] **Step 1: Create admin API routes**

`src/app/api/admin/condominios/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole("SUPER_ADMIN");
    const condominios = await prisma.condominio.findMany({
      include: { users: { select: { id: true, email: true, nombre: true, apellidos: true, rol: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(condominios);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
```

`src/app/api/admin/condominios/[id]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("SUPER_ADMIN");
    const { id } = await params;
    const body = await request.json();

    const condominio = await prisma.condominio.update({
      where: { id },
      data: {
        plan: body.plan,
        planExpiresAt: body.planExpiresAt ? new Date(body.planExpiresAt) : null,
        activo: body.activo,
      },
    });

    return NextResponse.json(condominio);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
```

`src/app/api/admin/metricas/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole("SUPER_ADMIN");

    const [totalCondominios, totalUsuarios, condominiosPorPlan] = await Promise.all([
      prisma.condominio.count(),
      prisma.user.count(),
      prisma.condominio.groupBy({ by: ["plan"], _count: true }),
    ]);

    return NextResponse.json({
      totalCondominios,
      totalUsuarios,
      condominiosPorPlan: condominiosPorPlan.map((g) => ({ plan: g.plan, count: g._count })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
```

- [ ] **Step 2: Create admin dashboard and condominios pages**

These are standard dashboard pages showing:
- `admin/page.tsx`: KPI cards (total condominios, usuarios, por plan) using data from `/api/admin/metricas`
- `admin/condominios/page.tsx`: Table of all condominios with ability to change plan and toggle active. Uses `/api/admin/condominios`.

- [ ] **Step 3: Update sidebar for admin role**

In `src/components/dashboard/sidebar.tsx`, add admin menu group visible only when `user?.rol === "SUPER_ADMIN"`:

```typescript
{user?.rol === "SUPER_ADMIN" && (
  // Add "Administración" menu group with:
  // - Panel Admin → /dashboard/admin
  // - Condominios → /dashboard/admin/condominios
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/ src/app/dashboard/admin/ src/components/dashboard/sidebar.tsx
git commit -m "feat: panel Super Admin con gestión de condominios"
```

---

## Task 12: Public registration page

**Files:**
- Create: `src/app/auth/register/page.tsx`
- Modify: `src/app/auth/page.tsx` (add link to register)
- Modify: Landing page CTAs (point to `/auth/register`)

- [ ] **Step 1: Create registration page**

Create `src/app/auth/register/page.tsx` with:
- Step 1: Choose modalidad ("Administro yo mismo" / "Quiero que Vecindad360 lo administre")
- Step 2: Form with fields: nombre, apellidos, email, telefono, password, condominioNombre, direccion
- On submit: call `register()` from auth hook
- On success: redirect to `/dashboard`
- Show errors from API

- [ ] **Step 2: Add register link to login page**

In `src/app/auth/page.tsx`, add below the login form:

```typescript
<p className="text-center text-sm text-surface-500 mt-4">
  ¿No tienes cuenta?{" "}
  <Link href="/auth/register" className="text-primary-600 font-medium hover:underline">
    Regístrate gratis
  </Link>
</p>
```

- [ ] **Step 3: Update landing page CTAs**

Change "Comenzar Gratis" / "Probar gratis" buttons in hero and header to point to `/auth/register` instead of `/auth`.

- [ ] **Step 4: Commit**

```bash
git add src/app/auth/register/ src/app/auth/page.tsx src/components/landing/hero.tsx src/components/layout/header.tsx
git commit -m "feat: página de registro público con selección de modalidad"
```

---

## Task 13: Build, verify, and final commit

- [ ] **Step 1: Run build**

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

Expected: Successful build with all routes.

- [ ] **Step 2: Run ESLint**

```bash
npx eslint src/
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Test full flow manually**

1. Run `npx prisma db seed` to reset data
2. Run `npm run dev`
3. Login as Super Admin: `admin@vecindad360.com` / `123456`
4. Verify admin panel shows condominios
5. Login as demo admin: `demo@vecindad360.com` / `demo123`
6. Verify dashboard loads, CRUD works on residentes
7. Register a new account from `/auth/register`
8. Verify 15-day trial starts
9. Verify data persists across page refreshes

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: Vecindad360 SaaS completo con SQLite + Prisma"
git push origin master
```
