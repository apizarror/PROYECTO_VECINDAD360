# Vecindad360 — Backend SaaS Design Spec

## Resumen

Implementar backend con SQLite + Prisma para convertir Vecindad360 de demo con mock data a un SaaS funcional multi-tenant con auth real, roles, prueba de 15 días y persistencia de datos.

---

## 1. Stack Técnico

- **ORM:** Prisma con SQLite (migrable a PostgreSQL cambiando `datasource`)
- **Auth:** Cookies httpOnly con sesiones en BD (bcrypt para passwords)
- **API:** Next.js API Routes (App Router)
- **Frontend:** Se mantiene igual, se reemplaza `useMockStore` por llamadas a API

---

## 2. Roles y Permisos

| Rol | Acceso | Scope |
|-----|--------|-------|
| `SUPER_ADMIN` | Panel maestro: todos los condominios, activar/desactivar cuentas, métricas globales | Global |
| `ADMIN_CONDOMINIO` | Dashboard completo de SU condominio | Su condominioId |
| `EMPLEADO` | Visitas, incidencias, movimiento vehicular | Su condominioId, funciones limitadas |
| `RESIDENTE` | Ver cuotas, pagar, reservar áreas, reportar incidencias | Su condominioId, su inmuebleId |

---

## 3. Flujo de Registro

1. Desde la landing, el usuario hace clic en "Comenzar"
2. Elige modalidad:
   - "Quiero administrar mi condominio" (SaaS puro)
   - "Quiero que Vecindad360 lo administre" (servicio + software)
3. Llena formulario: nombre, email, teléfono, password, nombre del condominio, dirección, cantidad de unidades
4. Se crea la cuenta como `ADMIN_CONDOMINIO` con `plan: "Trial"` y `trialEndsAt: now + 15 días`
5. Se crea el condominio vinculado
6. Redirige al dashboard

---

## 4. Vencimiento de Prueba

Cuando `trialEndsAt < now` y `plan === "Trial"`:

- El dashboard muestra un overlay/banner bloqueante:
  - "Tu período de prueba ha vencido"
  - "Contacta con nosotros para activar tu plan"
  - Botón WhatsApp: `https://wa.me/51984798650?text=Hola, quiero activar mi plan de Vecindad360`
  - Info para Yapear: "Yapea al 984798650 el monto de tu plan"
  - Tabla con los 3 planes y precios
- El admin NO puede operar (middleware bloquea API calls)
- El Super Admin activa el plan manualmente desde su panel (cambia `plan` y `planExpiresAt`)

---

## 5. Modelo de Datos (Prisma)

### Tablas Core (nuevas)

```
User
  id, email, password (hash), nombre, apellidos, dni, telefono
  rol (SUPER_ADMIN | ADMIN_CONDOMINIO | EMPLEADO | RESIDENTE)
  condominioId (FK, nullable para SUPER_ADMIN)
  inmuebleId (FK, nullable, solo para RESIDENTE)
  activo, avatar
  createdAt, updatedAt

Condominio
  id, nombre, direccion, ruc, razonSocial
  modalidad (AUTOGESTIÓN | ADMINISTRADO)
  plan (TRIAL | BASICO | PRO | EMPRESARIAL)
  trialEndsAt, planExpiresAt
  colorPrimario, moneda, zonaHoraria, moraDiaria
  whatsappBusinessId, pasarelaPago, smtpHost
  adminId (FK User que lo creó)
  activo
  createdAt, updatedAt

Session
  id, userId (FK), token (unique), expiresAt
  createdAt
```

### Tablas de Negocio (migradas de types)

Todas incluyen `condominioId` para multi-tenancy:

```
Edificio       → id, condominioId, nombre, direccion, bloques, pisosTotales, departamentosTotales, estado
Bloque         → id, condominioId, edificioId, nombre, pisos, inmuebles
Inmueble       → id, condominioId, bloqueId, numero, piso, area, habitaciones, banos, alicuota, estado, saldo
Persona        → id, condominioId, tipo, documento, nombres, apellidos, razonSocial, genero, fechaNacimiento, saldo, activo
Contacto       → id, personaId, tipo, valor
Vinculacion    → id, personaId, inmuebleId, rol
MiembroDirectiva → id, condominioId, personaId, cargo, fechaInicio, fechaFin, estado
Multa          → id, condominioId, personaId, inmuebleId, motivo, descripcion, monto, fechaEmision, fechaVencimiento, estado, aplicadoPor
AreaComun      → id, condominioId, nombre, descripcion, costoPorHora, modoReserva, capacidadMaxima, requiereGarantia, montoGarantia, reglasUso, estado
Reserva        → id, condominioId, areaComunId, personaId, inmuebleId, fecha, horaInicio, horaFin, costoTotal, estado, observaciones
Vehiculo       → id, condominioId, placa, marca, modelo, color, ano, tipo, personaId, inmuebleId, espacioEstacionamiento, sticker, estado
MovimientoVehicular → id, condominioId, vehiculoId, placa, tipoMovimiento, fechaHora, registradoPor, observaciones, esVisitante, visitanteNombre
Visita         → id, condominioId, visitanteDni, visitanteNombre, inmuebleId, personaId, motivo, fechaHoraIngreso, fechaHoraSalida, estado, qrGenerado, vehiculoPlaca
Empleado       → id, condominioId, dni, nombres, apellidos, cargo, tipoContrato, fechaIngreso, fechaSalida, salario, telefono, email, estado
Dispositivo    → id, condominioId, tipo, marca, modelo, numeroSerie, empleadoId, fechaAsignacion, estado
Horario        → id, condominioId, empleadoId, diaSemana, horaInicio, horaFin, tipoTurno
Incidencia     → id, condominioId, titulo, descripcion, ubicacion, prioridad, categoria, reportadaPor, asignadaA, fechaReporte, fechaCierre, estado
TareaProgramada → id, condominioId, titulo, descripcion, asignadaA, frecuencia, proximaEjecucion, ultimaEjecucion, estado
CuentaBancaria → id, condominioId, banco, tipo, moneda, numeroCuenta, cci, titular, saldoInicial, saldoActual, estado
Presupuesto    → id, condominioId, ano, rubroNombre, montoPresupuestado, montoEjecutado, observaciones
Egreso         → id, condominioId, concepto, monto, categoria, proveedor, cuentaBancariaId, metodoPago, fechaRegistro, fechaPago, descripcion, estado, registradoPor
Ingreso        → id, condominioId, concepto, monto, origen, personaId, inmuebleId, cuentaBancariaId, metodoPago, fecha, estado, registradoPor
CargoServicio  → id, condominioId, inmuebleId, servicioNombre, periodo, lecturaAnterior, lecturaActual, consumo, tarifa, monto, estado, registradoPor
CuotaMantenimiento → id, condominioId, periodo, tipo, montoBase, criterio, fechaEmision, fechaVencimiento, moraDiaria, estado, inmueblesAplicados, totalEmitido, totalCobrado
GrupoRubro     → id, condominioId, nombre, orden
ServicioRubro  → id, condominioId, grupoId, nombre, tipo, unidad, tarifaBase, cuentaContable
Archivo        → id, condominioId, nombre, descripcion, categoria, formato, visibilidad, subidoPor, fecha, tamano, url
Notificacion   → id, condominioId, userId, titulo, descripcion, tipo, leida, fecha
```

---

## 6. API Routes

### Auth
```
POST /api/auth/register    → Crear cuenta + condominio (trial 15 días)
POST /api/auth/login       → Login, crear sesión, set cookie
POST /api/auth/logout      → Eliminar sesión, clear cookie
GET  /api/auth/me          → Usuario actual desde cookie
```

### CRUD genérico por recurso
```
GET    /api/[recurso]         → Listar (filtrado por condominioId del usuario)
GET    /api/[recurso]/[id]    → Obtener uno
POST   /api/[recurso]         → Crear
PUT    /api/[recurso]/[id]    → Actualizar
DELETE /api/[recurso]/[id]    → Eliminar
```

Recursos: edificios, bloques, inmuebles, personas, directiva, multas, areas-comunes, reservas, vehiculos, movimientos, visitas, empleados, dispositivos, horarios, incidencias, tareas, cuentas-bancarias, presupuestos, egresos, ingresos, cargos-servicio, cuotas, grupos-rubro, servicios-rubro, archivos, notificaciones

### Super Admin
```
GET    /api/admin/condominios       → Listar todos los condominios
PUT    /api/admin/condominios/[id]  → Activar plan, cambiar estado
GET    /api/admin/metricas          → Dashboard global
POST   /api/admin/usuarios          → Crear usuario (residentes, empleados)
```

---

## 7. Middleware de Seguridad

1. **Auth middleware:** Valida cookie → busca sesión → adjunta user al request
2. **Tenant middleware:** Inyecta `condominioId` del usuario en todas las queries
3. **Role middleware:** Verifica que el rol tenga permiso para la operación
4. **Trial middleware:** Si `plan === "Trial"` y `trialEndsAt < now`, bloquea operaciones (solo permite GET /api/auth/me y logout)

---

## 8. Migración del Frontend

### Reemplazos
- `useMockStore` → `useQuery` / `useMutation` (TanStack React Query, ya instalado)
- `use-auth.tsx` → Llama a `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Datos mock importados → Se eliminan, vienen de la API
- Formularios mantienen la misma estructura, solo cambia el `onSubmit` (fetch a API en vez de store local)

### Nuevas páginas
- `/auth/register` → Formulario de registro con selección de modalidad
- `/dashboard` → Detecta si trial venció, muestra overlay si es así
- Panel Super Admin (rutas `/dashboard/admin/*`) → Solo visible para SUPER_ADMIN

### Portal Residente
- Vista limitada del dashboard (sin sidebar completo)
- Secciones: Mis cuotas, Mis pagos, Reservar área, Reportar incidencia, Mi perfil

---

## 9. Seed Data

Script `prisma/seed.ts` que crea:
- 1 usuario SUPER_ADMIN (tú): email configurable
- 1 condominio de ejemplo con plan PRO
- Edificios, bloques, inmuebles de ejemplo
- Residentes de ejemplo
- Datos financieros de ejemplo

---

## 10. Orden de Implementación

1. Prisma schema + SQLite + seed
2. Auth (register, login, logout, me, middleware)
3. CRUD API para cada recurso
4. Migrar frontend de mock a API (React Query)
5. Trial/vencimiento con overlay
6. Panel Super Admin
7. Portal Residente
8. Registro público desde landing

---

## 11. Migración futura a PostgreSQL

Cambiar en `prisma/schema.prisma`:
```diff
- datasource db {
-   provider = "sqlite"
-   url      = "file:./dev.db"
- }
+ datasource db {
+   provider = "postgresql"
+   url      = env("DATABASE_URL")
+ }
```

Ejecutar `npx prisma migrate dev` y listo. Prisma maneja la diferencia.
