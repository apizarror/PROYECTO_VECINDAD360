import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(projectRoot, 'dev.db')}`,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Limpiando base de datos...')

  // Delete child tables first to avoid FK constraints
  await prisma.notificacion.deleteMany()
  await prisma.archivo.deleteMany()
  await prisma.servicioRubro.deleteMany()
  await prisma.grupoRubro.deleteMany()
  await prisma.cuotaMantenimiento.deleteMany()
  await prisma.cargoServicio.deleteMany()
  await prisma.ingreso.deleteMany()
  await prisma.egreso.deleteMany()
  await prisma.presupuesto.deleteMany()
  await prisma.cuentaBancaria.deleteMany()
  await prisma.tareaProgramada.deleteMany()
  await prisma.incidencia.deleteMany()
  await prisma.horario.deleteMany()
  await prisma.dispositivo.deleteMany()
  await prisma.empleado.deleteMany()
  await prisma.visita.deleteMany()
  await prisma.movimientoVehicular.deleteMany()
  await prisma.vehiculo.deleteMany()
  await prisma.reserva.deleteMany()
  await prisma.areaComun.deleteMany()
  await prisma.multa.deleteMany()
  await prisma.miembroDirectiva.deleteMany()
  await prisma.vinculacion.deleteMany()
  await prisma.contacto.deleteMany()
  await prisma.persona.deleteMany()
  await prisma.inmueble.deleteMany()
  await prisma.bloque.deleteMany()
  await prisma.edificio.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.condominio.deleteMany()

  console.log('Base de datos limpia.')

  // ─── Super Admin ─────────────────────────────
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@vecindad360.com',
      password: await bcrypt.hash('123456', 10),
      nombre: 'Admin',
      apellidos: 'Vecindad360',
      rol: 'SUPER_ADMIN',
    },
  })
  console.log('Super Admin creado:', superAdmin.email)

  // ─── Condominio Demo ─────────────────────────
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 90)

  const condominio = await prisma.condominio.create({
    data: {
      nombre: 'Residencial Torre Sol',
      direccion: 'Av. El Sol 1234, Lima',
      plan: 'PRO',
      adminId: superAdmin.id,
      trialEndsAt,
    },
  })
  console.log('Condominio creado:', condominio.nombre)

  // ─── Admin Condominio ────────────────────────
  const adminDemo = await prisma.user.create({
    data: {
      email: 'demo@vecindad360.com',
      password: await bcrypt.hash('demo123', 10),
      nombre: 'Demo',
      apellidos: 'Admin',
      rol: 'ADMIN_CONDOMINIO',
      condominioId: condominio.id,
    },
  })
  console.log('Admin Demo creado:', adminDemo.email)

  // ─── Empleado User ──────────────────────────
  const empleadoUser = await prisma.user.create({
    data: {
      email: 'empleado@vecindad360.com',
      password: await bcrypt.hash('empleado123', 10),
      nombre: 'Roberto',
      apellidos: 'Flores',
      rol: 'EMPLEADO',
      condominioId: condominio.id,
    },
  })
  console.log('Empleado User creado:', empleadoUser.email)

  // ─── Residente User (will link inmuebleId after inmuebles are created) ──
  const residenteUser = await prisma.user.create({
    data: {
      email: 'residente@vecindad360.com',
      password: await bcrypt.hash('residente123', 10),
      nombre: 'Luis',
      apellidos: 'García',
      rol: 'RESIDENTE',
      condominioId: condominio.id,
    },
  })
  console.log('Residente User creado:', residenteUser.email)

  // ─── Edificio ────────────────────────────────
  const edificio = await prisma.edificio.create({
    data: {
      condominioId: condominio.id,
      nombre: 'Torre Sol',
      direccion: 'Av. El Sol 1234, Lima',
      bloques: 2,
      pisosTotales: 5,
      departamentosTotales: 20,
    },
  })

  // ─── Bloques ─────────────────────────────────
  const torreA = await prisma.bloque.create({
    data: {
      condominioId: condominio.id,
      edificioId: edificio.id,
      nombre: 'Torre A',
      pisos: 5,
      inmuebles: 10,
    },
  })

  const torreB = await prisma.bloque.create({
    data: {
      condominioId: condominio.id,
      edificioId: edificio.id,
      nombre: 'Torre B',
      pisos: 5,
      inmuebles: 10,
    },
  })

  // ─── Inmuebles ───────────────────────────────
  const inmuebleData = [
    { numero: '101', piso: 1, area: 85, bloqueId: torreA.id },
    { numero: '102', piso: 1, area: 90, bloqueId: torreA.id },
    { numero: '201', piso: 2, area: 85, bloqueId: torreA.id },
    { numero: '301', piso: 3, area: 95, bloqueId: torreB.id },
    { numero: '302', piso: 3, area: 80, bloqueId: torreB.id },
  ]

  const inmuebles = []
  for (const data of inmuebleData) {
    const inmueble = await prisma.inmueble.create({
      data: {
        condominioId: condominio.id,
        bloqueId: data.bloqueId,
        numero: data.numero,
        piso: data.piso,
        area: data.area,
        habitaciones: 3,
        banos: 2,
        alicuota: 5.0,
        estado: 'Ocupado',
      },
    })
    inmuebles.push(inmueble)
  }
  console.log(`${inmuebles.length} inmuebles creados.`)

  // ─── Link residente user to inmueble 101 ────
  await prisma.user.update({
    where: { id: residenteUser.id },
    data: { inmuebleId: inmuebles[0].id },
  })
  console.log('Residente vinculado a inmueble 101.')

  // ─── Personas ────────────────────────────────
  const personasData = [
    { documento: '12345678', nombres: 'Luis', apellidos: 'García', genero: 'Masculino', email: 'luis.garcia@email.com', telefono: '999111222', inmuebleIdx: 0, rol: 'Propietario' },
    { documento: '23456789', nombres: 'María', apellidos: 'Torres', genero: 'Femenino', email: 'maria.torres@email.com', telefono: '999333444', inmuebleIdx: 1, rol: 'Propietario' },
    { documento: '34567890', nombres: 'Ana', apellidos: 'Quispe', genero: 'Femenino', email: 'ana.quispe@email.com', telefono: '999555666', inmuebleIdx: 2, rol: 'Inquilino' },
    { documento: '45678901', nombres: 'Pedro', apellidos: 'Sánchez', genero: 'Masculino', email: 'pedro.sanchez@email.com', telefono: '999777888', inmuebleIdx: 3, rol: 'Propietario' },
  ]

  const personas = []
  for (const p of personasData) {
    const persona = await prisma.persona.create({
      data: {
        condominioId: condominio.id,
        documento: p.documento,
        nombres: p.nombres,
        apellidos: p.apellidos,
        genero: p.genero,
        contactos: {
          create: [
            { tipo: 'Email', valor: p.email },
            { tipo: 'Teléfono', valor: p.telefono },
          ],
        },
        vinculaciones: {
          create: [
            {
              inmuebleId: inmuebles[p.inmuebleIdx].id,
              rol: p.rol,
            },
          ],
        },
      },
    })
    personas.push(persona)
    console.log(`Persona creada: ${persona.nombres} ${persona.apellidos}`)
  }

  // ─── Áreas Comunes ───────────────────────────
  const areasData = [
    { nombre: 'Parrilla', descripcion: 'Zona de parrillas con capacidad para 20 personas', costoPorHora: 30, capacidadMaxima: 20 },
    { nombre: 'Salón de Eventos', descripcion: 'Salón multiusos para eventos y reuniones', costoPorHora: 50, capacidadMaxima: 60 },
    { nombre: 'Piscina', descripcion: 'Piscina temperada con horario de 8am a 8pm', costoPorHora: 0, capacidadMaxima: 30 },
  ]

  const areasComunes = []
  for (const area of areasData) {
    const ac = await prisma.areaComun.create({
      data: {
        condominioId: condominio.id,
        ...area,
      },
    })
    areasComunes.push(ac)
  }
  console.log('3 áreas comunes creadas.')

  // ─── Cuenta Bancaria ─────────────────────────
  const cuentaBancaria = await prisma.cuentaBancaria.create({
    data: {
      condominioId: condominio.id,
      banco: 'BCP',
      tipo: 'Corriente',
      moneda: 'PEN',
      numeroCuenta: '191-2345678-0-12',
      cci: '00219100234567801234',
      titular: 'Residencial Torre Sol',
      saldoInicial: 5000,
      saldoActual: 5000,
    },
  })
  console.log('Cuenta bancaria BCP creada.')

  // ─── Empleado ────────────────────────────────
  const empleado = await prisma.empleado.create({
    data: {
      condominioId: condominio.id,
      dni: '56789012',
      nombres: 'Roberto',
      apellidos: 'Flores',
      cargo: 'Conserje',
      tipoContrato: 'Tiempo completo',
      fechaIngreso: '2024-01-15',
      salario: 1200,
      telefono: '999000111',
      email: 'roberto.flores@email.com',
    },
  })
  console.log('Empleado Roberto Flores (Conserje) creado.')

  // ═══════════════════════════════════════════════
  // DATOS ENRIQUECIDOS PARA DEMO
  // ═══════════════════════════════════════════════

  // ─── Grupos Rubro y Servicios Rubro ──────────
  const grupoOrdinarios = await prisma.grupoRubro.create({
    data: {
      condominioId: condominio.id,
      nombre: 'Ordinarios',
      orden: 1,
    },
  })

  const grupoExtraordinarios = await prisma.grupoRubro.create({
    data: {
      condominioId: condominio.id,
      nombre: 'Extraordinarios',
      orden: 2,
    },
  })

  const serviciosRubroData = [
    { nombre: 'Agua', tipo: 'Ordinario', unidad: 'm³', tarifaBase: 5.20, grupoId: grupoOrdinarios.id },
    { nombre: 'Luz Áreas Comunes', tipo: 'Ordinario', unidad: 'kWh', tarifaBase: 0.65, grupoId: grupoOrdinarios.id },
    { nombre: 'Mantenimiento', tipo: 'Ordinario', unidad: 'Mensual', tarifaBase: 350, grupoId: grupoOrdinarios.id },
    { nombre: 'Limpieza', tipo: 'Ordinario', unidad: 'Mensual', tarifaBase: 180, grupoId: grupoOrdinarios.id },
    { nombre: 'Vigilancia', tipo: 'Extraordinario', unidad: 'Mensual', tarifaBase: 450, grupoId: grupoExtraordinarios.id },
  ]

  for (const sr of serviciosRubroData) {
    await prisma.servicioRubro.create({
      data: { condominioId: condominio.id, ...sr },
    })
  }
  console.log('2 grupos rubro y 5 servicios rubro creados.')

  // ─── Cuotas de Mantenimiento (6 meses) ───────
  const meses = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']
  for (const periodo of meses) {
    const [y, m] = periodo.split('-').map(Number)
    const emision = `${periodo}-01`
    const lastDay = new Date(y, m, 0).getDate()
    const vencimiento = `${periodo}-${lastDay}`
    await prisma.cuotaMantenimiento.create({
      data: {
        condominioId: condominio.id,
        periodo,
        tipo: 'Ordinaria',
        montoBase: 350,
        criterio: 'Igual',
        fechaEmision: emision,
        fechaVencimiento: vencimiento,
        moraDiaria: 0.05,
        estado: 'Emitida',
        inmueblesAplicados: inmuebles.length,
        totalEmitido: 350 * inmuebles.length,
        totalCobrado: periodo <= '2026-04' ? 350 * inmuebles.length : periodo === '2026-05' ? 350 * 3 : 0,
      },
    })
  }
  console.log('6 cuotas de mantenimiento creadas.')

  // ─── Ingresos (12 variados, últimos 3 meses) ─
  const ingresosData = [
    { concepto: 'Pago cuota mantenimiento - Dpto 101', monto: 350, origen: 'Transferencia', personaIdx: 0, inmuebleIdx: 0, fecha: '2026-03-05', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 102', monto: 350, origen: 'Transferencia', personaIdx: 1, inmuebleIdx: 1, fecha: '2026-03-08', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 201', monto: 350, origen: 'Efectivo', personaIdx: 2, inmuebleIdx: 2, fecha: '2026-03-10', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 301', monto: 350, origen: 'Yape', personaIdx: 3, inmuebleIdx: 3, fecha: '2026-03-12', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 101', monto: 350, origen: 'Transferencia', personaIdx: 0, inmuebleIdx: 0, fecha: '2026-04-03', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 102', monto: 350, origen: 'Transferencia', personaIdx: 1, inmuebleIdx: 1, fecha: '2026-04-07', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 201', monto: 350, origen: 'Plin', personaIdx: 2, inmuebleIdx: 2, fecha: '2026-04-10', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 301', monto: 350, origen: 'Efectivo', personaIdx: 3, inmuebleIdx: 3, fecha: '2026-04-15', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 101', monto: 350, origen: 'Transferencia', personaIdx: 0, inmuebleIdx: 0, fecha: '2026-05-04', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 102', monto: 350, origen: 'Yape', personaIdx: 1, inmuebleIdx: 1, fecha: '2026-05-06', estado: 'Confirmado' },
    { concepto: 'Pago cuota mantenimiento - Dpto 201', monto: 350, origen: 'Transferencia', personaIdx: 2, inmuebleIdx: 2, fecha: '2026-05-12', estado: 'Confirmado' },
    { concepto: 'Reserva Salón de Eventos - Dpto 301', monto: 150, origen: 'Efectivo', personaIdx: 3, inmuebleIdx: 3, fecha: '2026-05-20', estado: 'Confirmado' },
  ]

  for (const ing of ingresosData) {
    await prisma.ingreso.create({
      data: {
        condominioId: condominio.id,
        concepto: ing.concepto,
        monto: ing.monto,
        origen: ing.origen,
        personaId: personas[ing.personaIdx].id,
        inmuebleId: inmuebles[ing.inmuebleIdx].id,
        cuentaBancariaId: cuentaBancaria.id,
        metodoPago: ing.origen,
        fecha: ing.fecha,
        estado: ing.estado,
        registradoPor: adminDemo.id,
      },
    })
  }
  console.log(`${ingresosData.length} ingresos creados.`)

  // ─── Egresos (10 variados, últimos 3 meses) ──
  const egresosData = [
    { concepto: 'Servicio de limpieza - Marzo', monto: 1800, categoria: 'Limpieza', proveedor: 'Limpieza Total SAC', fecha: '2026-03-01', descripcion: 'Servicio mensual de limpieza áreas comunes' },
    { concepto: 'Servicio de vigilancia - Marzo', monto: 4500, categoria: 'Vigilancia', proveedor: 'Seguridad Perú SAC', fecha: '2026-03-01', descripcion: 'Servicio mensual de vigilancia 24/7' },
    { concepto: 'Recibo de luz áreas comunes - Marzo', monto: 680, categoria: 'Servicios', proveedor: 'Luz del Sur', fecha: '2026-03-15', descripcion: 'Consumo eléctrico pasillos, lobby y áreas comunes' },
    { concepto: 'Mantenimiento ascensor', monto: 450, categoria: 'Mantenimiento', proveedor: 'Ascensores del Pacífico', fecha: '2026-03-20', descripcion: 'Mantenimiento preventivo mensual ascensor Torre A' },
    { concepto: 'Servicio de limpieza - Abril', monto: 1800, categoria: 'Limpieza', proveedor: 'Limpieza Total SAC', fecha: '2026-04-01', descripcion: 'Servicio mensual de limpieza áreas comunes' },
    { concepto: 'Servicio de vigilancia - Abril', monto: 4500, categoria: 'Vigilancia', proveedor: 'Seguridad Perú SAC', fecha: '2026-04-01', descripcion: 'Servicio mensual de vigilancia 24/7' },
    { concepto: 'Recibo de luz áreas comunes - Abril', monto: 720, categoria: 'Servicios', proveedor: 'Luz del Sur', fecha: '2026-04-16', descripcion: 'Consumo eléctrico pasillos, lobby y áreas comunes' },
    { concepto: 'Reparación bomba de agua', monto: 850, categoria: 'Mantenimiento', proveedor: 'Hidráulica Lima', fecha: '2026-04-22', descripcion: 'Reparación de bomba cisterna principal' },
    { concepto: 'Servicio de limpieza - Mayo', monto: 1800, categoria: 'Limpieza', proveedor: 'Limpieza Total SAC', fecha: '2026-05-01', descripcion: 'Servicio mensual de limpieza áreas comunes' },
    { concepto: 'Fumigación trimestral', monto: 350, categoria: 'Mantenimiento', proveedor: 'Fumigaciones Express', fecha: '2026-05-10', descripcion: 'Fumigación preventiva trimestral de todo el edificio' },
  ]

  for (const eg of egresosData) {
    await prisma.egreso.create({
      data: {
        condominioId: condominio.id,
        concepto: eg.concepto,
        monto: eg.monto,
        categoria: eg.categoria,
        proveedor: eg.proveedor,
        cuentaBancariaId: cuentaBancaria.id,
        metodoPago: 'Transferencia',
        fechaRegistro: eg.fecha,
        fechaPago: eg.fecha,
        descripcion: eg.descripcion,
        estado: 'Pagado',
        registradoPor: adminDemo.id,
      },
    })
  }
  console.log(`${egresosData.length} egresos creados.`)

  // ─── Presupuestos 2026 ───────────────────────
  const presupuestosData = [
    { rubroNombre: 'Mantenimiento General', montoPresupuestado: 24000, montoEjecutado: 9850, observaciones: 'Incluye ascensor, bombas, pintura y reparaciones menores' },
    { rubroNombre: 'Limpieza y Vigilancia', montoPresupuestado: 75600, montoEjecutado: 37800, observaciones: 'Contratos anuales con Limpieza Total SAC y Seguridad Perú SAC' },
    { rubroNombre: 'Servicios Públicos', montoPresupuestado: 9600, montoEjecutado: 4200, observaciones: 'Luz, agua y otros servicios de áreas comunes' },
  ]

  for (const p of presupuestosData) {
    await prisma.presupuesto.create({
      data: {
        condominioId: condominio.id,
        ano: 2026,
        ...p,
      },
    })
  }
  console.log('3 presupuestos 2026 creados.')

  // ─── Cargos de Servicio (agua 3 meses) ───────
  const periodos = ['2026-03', '2026-04', '2026-05']
  const lecturaBase = [120, 130, 125, 140, 115]

  for (let mi = 0; mi < periodos.length; mi++) {
    for (let ii = 0; ii < inmuebles.length; ii++) {
      const anterior = lecturaBase[ii] + mi * 15
      const actual = anterior + 12 + Math.floor(Math.random() * 8)
      const consumo = actual - anterior
      await prisma.cargoServicio.create({
        data: {
          condominioId: condominio.id,
          inmuebleId: inmuebles[ii].id,
          servicioNombre: 'Agua',
          periodo: periodos[mi],
          lecturaAnterior: anterior,
          lecturaActual: actual,
          consumo,
          tarifa: 5.20,
          monto: parseFloat((consumo * 5.20).toFixed(2)),
          estado: mi < 2 ? 'Pagado' : 'Pendiente',
          registradoPor: adminDemo.id,
        },
      })
    }
  }

  // Cargos de luz áreas comunes prorrateados
  for (const periodo of periodos) {
    const montoTotal = periodo === '2026-03' ? 680 : periodo === '2026-04' ? 720 : 650
    const montoPorInmueble = parseFloat((montoTotal / inmuebles.length).toFixed(2))
    for (const inmueble of inmuebles) {
      await prisma.cargoServicio.create({
        data: {
          condominioId: condominio.id,
          inmuebleId: inmueble.id,
          servicioNombre: 'Luz Áreas Comunes',
          periodo,
          tarifa: 0.65,
          monto: montoPorInmueble,
          estado: periodo !== '2026-05' ? 'Pagado' : 'Pendiente',
          registradoPor: adminDemo.id,
        },
      })
    }
  }
  console.log('Cargos de servicio (agua y luz) creados para 3 meses.')

  // ─── Visitas ─────────────────────────────────
  const visitasData = [
    { visitanteDni: '71234567', visitanteNombre: 'Carlos Mendoza', inmuebleIdx: 0, personaIdx: 0, motivo: 'Visita familiar', fechaHoraIngreso: '2026-05-25T10:00:00', fechaHoraSalida: '2026-05-25T18:00:00', estado: 'Completada' },
    { visitanteDni: '72345678', visitanteNombre: 'Rosa Huamán', inmuebleIdx: 1, personaIdx: 1, motivo: 'Entrega de paquete', fechaHoraIngreso: '2026-05-26T14:30:00', fechaHoraSalida: '2026-05-26T14:45:00', estado: 'Completada' },
    { visitanteDni: '73456789', visitanteNombre: 'Jorge Castillo', inmuebleIdx: 2, personaIdx: 2, motivo: 'Técnico de internet', fechaHoraIngreso: '2026-05-28T09:00:00', estado: 'En curso' },
    { visitanteDni: '74567890', visitanteNombre: 'Elena Vargas', inmuebleIdx: 0, personaIdx: 0, motivo: 'Reunión de trabajo', fechaHoraIngreso: '2026-05-30T15:00:00', estado: 'Programada' },
    { visitanteDni: '75678901', visitanteNombre: 'Miguel Paredes', inmuebleIdx: 3, personaIdx: 3, motivo: 'Visita social', fechaHoraIngreso: '2026-05-31T11:00:00', estado: 'Programada' },
    { visitanteDni: '76789012', visitanteNombre: 'Lucía Fernández', inmuebleIdx: 1, personaIdx: 1, motivo: 'Clase particular', fechaHoraIngreso: '2026-05-24T16:00:00', fechaHoraSalida: '2026-05-24T18:00:00', estado: 'Completada' },
  ]

  for (const v of visitasData) {
    await prisma.visita.create({
      data: {
        condominioId: condominio.id,
        visitanteDni: v.visitanteDni,
        visitanteNombre: v.visitanteNombre,
        inmuebleId: inmuebles[v.inmuebleIdx].id,
        personaId: personas[v.personaIdx].id,
        motivo: v.motivo,
        fechaHoraIngreso: v.fechaHoraIngreso,
        fechaHoraSalida: v.fechaHoraSalida ?? null,
        estado: v.estado,
      },
    })
  }
  console.log(`${visitasData.length} visitas creadas.`)

  // ─── Incidencias ─────────────────────────────
  const incidenciasData = [
    { titulo: 'Filtración de agua piso 3', descripcion: 'Se detectó filtración de agua en el techo del pasillo del piso 3, proveniente del baño del dpto 301.', ubicacion: 'Piso 3 - Pasillo Torre B', prioridad: 'Alta', categoria: 'Plomería', reportadaPor: 'Pedro Sánchez', asignadaA: 'Roberto Flores', fechaReporte: '2026-05-15', estado: 'En Progreso' },
    { titulo: 'Foco quemado en estacionamiento', descripcion: 'Foco LED del sector B2 del estacionamiento no enciende.', ubicacion: 'Estacionamiento - Sector B2', prioridad: 'Baja', categoria: 'Eléctrica', reportadaPor: 'Luis García', asignadaA: 'Roberto Flores', fechaReporte: '2026-05-20', fechaCierre: '2026-05-21', estado: 'Resuelta' },
    { titulo: 'Ruido excesivo Dpto 102', descripcion: 'Vecinos reportan ruidos fuertes en horario nocturno provenientes del dpto 102.', ubicacion: 'Torre A - Piso 1', prioridad: 'Media', categoria: 'Convivencia', reportadaPor: 'Ana Quispe', asignadaA: 'Demo Admin', fechaReporte: '2026-05-22', estado: 'Abierta' },
    { titulo: 'Ascensor trabado en piso 4', descripcion: 'El ascensor de Torre A se quedó detenido en el piso 4 durante 15 minutos. Se reinició manualmente.', ubicacion: 'Torre A - Ascensor', prioridad: 'Alta', categoria: 'Mantenimiento', reportadaPor: 'María Torres', asignadaA: 'Roberto Flores', fechaReporte: '2026-05-10', fechaCierre: '2026-05-10', estado: 'Resuelta' },
    { titulo: 'Puerta de lobby no cierra bien', descripcion: 'La puerta principal del lobby no cierra correctamente, el mecanismo hidráulico está fallando.', ubicacion: 'Lobby Principal', prioridad: 'Media', categoria: 'Mantenimiento', reportadaPor: 'Luis García', asignadaA: 'Roberto Flores', fechaReporte: '2026-05-25', estado: 'Abierta' },
  ]

  for (const inc of incidenciasData) {
    await prisma.incidencia.create({
      data: {
        condominioId: condominio.id,
        ...inc,
      },
    })
  }
  console.log(`${incidenciasData.length} incidencias creadas.`)

  // ─── Tareas Programadas ──────────────────────
  const tareasData = [
    { titulo: 'Limpieza de tanque cisterna', descripcion: 'Limpieza y desinfección del tanque cisterna principal.', asignadaA: 'Roberto Flores', frecuencia: 'Trimestral', proximaEjecucion: '2026-07-15', ultimaEjecucion: '2026-04-15', estado: 'Activa' },
    { titulo: 'Revisión de extintores', descripcion: 'Verificar carga y vigencia de todos los extintores del edificio.', asignadaA: 'Roberto Flores', frecuencia: 'Semestral', proximaEjecucion: '2026-09-01', ultimaEjecucion: '2026-03-01', estado: 'Activa' },
    { titulo: 'Fumigación general', descripcion: 'Fumigación preventiva de áreas comunes y estacionamientos.', asignadaA: 'Demo Admin', frecuencia: 'Trimestral', proximaEjecucion: '2026-08-10', ultimaEjecucion: '2026-05-10', estado: 'Activa' },
    { titulo: 'Mantenimiento de bomba de agua', descripcion: 'Revisión y mantenimiento preventivo de la bomba de agua principal.', asignadaA: 'Roberto Flores', frecuencia: 'Mensual', proximaEjecucion: '2026-06-15', ultimaEjecucion: '2026-05-15', estado: 'Activa' },
  ]

  for (const t of tareasData) {
    await prisma.tareaProgramada.create({
      data: {
        condominioId: condominio.id,
        ...t,
      },
    })
  }
  console.log(`${tareasData.length} tareas programadas creadas.`)

  // ─── Vehículos ───────────────────────────────
  const vehiculosData = [
    { placa: 'ABC-123', marca: 'Toyota', modelo: 'Corolla', color: 'Blanco', ano: 2022, tipo: 'Auto', personaIdx: 0, inmuebleIdx: 0, espacioEstacionamiento: 'A-01' },
    { placa: 'DEF-456', marca: 'Hyundai', modelo: 'Tucson', color: 'Gris', ano: 2023, tipo: 'Camioneta', personaIdx: 1, inmuebleIdx: 1, espacioEstacionamiento: 'A-02' },
    { placa: 'GHI-789', marca: 'Kia', modelo: 'Rio', color: 'Rojo', ano: 2021, tipo: 'Auto', personaIdx: 2, inmuebleIdx: 2, espacioEstacionamiento: 'A-03' },
    { placa: 'JKL-012', marca: 'Nissan', modelo: 'Sentra', color: 'Negro', ano: 2020, tipo: 'Auto', personaIdx: 3, inmuebleIdx: 3, espacioEstacionamiento: 'B-01' },
  ]

  const vehiculos = []
  for (const v of vehiculosData) {
    const vehiculo = await prisma.vehiculo.create({
      data: {
        condominioId: condominio.id,
        placa: v.placa,
        marca: v.marca,
        modelo: v.modelo,
        color: v.color,
        ano: v.ano,
        tipo: v.tipo,
        personaId: personas[v.personaIdx].id,
        inmuebleId: inmuebles[v.inmuebleIdx].id,
        espacioEstacionamiento: v.espacioEstacionamiento,
        estado: 'Activo',
      },
    })
    vehiculos.push(vehiculo)
  }
  console.log(`${vehiculos.length} vehículos creados.`)

  // ─── Movimientos Vehiculares ─────────────────
  const movimientosData = [
    { vehiculoIdx: 0, placa: 'ABC-123', tipoMovimiento: 'Salida', fechaHora: '2026-05-29T07:30:00', registradoPor: 'Roberto Flores' },
    { vehiculoIdx: 0, placa: 'ABC-123', tipoMovimiento: 'Ingreso', fechaHora: '2026-05-29T18:45:00', registradoPor: 'Roberto Flores' },
    { vehiculoIdx: 1, placa: 'DEF-456', tipoMovimiento: 'Salida', fechaHora: '2026-05-30T08:00:00', registradoPor: 'Roberto Flores' },
  ]

  for (const mv of movimientosData) {
    await prisma.movimientoVehicular.create({
      data: {
        condominioId: condominio.id,
        vehiculoId: vehiculos[mv.vehiculoIdx].id,
        placa: mv.placa,
        tipoMovimiento: mv.tipoMovimiento,
        fechaHora: mv.fechaHora,
        registradoPor: mv.registradoPor,
      },
    })
  }
  console.log(`${movimientosData.length} movimientos vehiculares creados.`)

  // ─── Reservas de Áreas Comunes ───────────────
  const reservasData = [
    { areaComunIdx: 0, personaIdx: 0, inmuebleIdx: 0, fecha: '2026-06-01', horaInicio: '12:00', horaFin: '16:00', costoTotal: 120, estado: 'Confirmada', observaciones: 'Cumpleaños familiar' },
    { areaComunIdx: 1, personaIdx: 3, inmuebleIdx: 3, fecha: '2026-06-07', horaInicio: '18:00', horaFin: '22:00', costoTotal: 200, estado: 'Solicitada', observaciones: 'Reunión de promoción' },
    { areaComunIdx: 0, personaIdx: 1, inmuebleIdx: 1, fecha: '2026-05-18', horaInicio: '11:00', horaFin: '15:00', costoTotal: 120, estado: 'Completada', observaciones: 'Almuerzo con amigos' },
  ]

  for (const r of reservasData) {
    await prisma.reserva.create({
      data: {
        condominioId: condominio.id,
        areaComunId: areasComunes[r.areaComunIdx].id,
        personaId: personas[r.personaIdx].id,
        inmuebleId: inmuebles[r.inmuebleIdx].id,
        fecha: r.fecha,
        horaInicio: r.horaInicio,
        horaFin: r.horaFin,
        costoTotal: r.costoTotal,
        estado: r.estado,
        observaciones: r.observaciones,
      },
    })
  }
  console.log(`${reservasData.length} reservas creadas.`)

  // ─── Miembros de Directiva ───────────────────
  const directivaData = [
    { personaIdx: 0, cargo: 'Presidente', fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
    { personaIdx: 1, cargo: 'Tesorera', fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
    { personaIdx: 3, cargo: 'Vocal', fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
  ]

  for (const d of directivaData) {
    await prisma.miembroDirectiva.create({
      data: {
        condominioId: condominio.id,
        personaId: personas[d.personaIdx].id,
        cargo: d.cargo,
        fechaInicio: d.fechaInicio,
        fechaFin: d.fechaFin,
        estado: 'Activo',
      },
    })
  }
  console.log(`${directivaData.length} miembros de directiva creados.`)

  // ─── Multas ──────────────────────────────────
  const multasData = [
    { personaIdx: 1, inmuebleIdx: 1, motivo: 'Ruido excesivo en horario nocturno', descripcion: 'Se registró música a alto volumen después de las 10pm en dos ocasiones durante la semana.', monto: 100, fechaEmision: '2026-05-15', fechaVencimiento: '2026-06-15', estado: 'Pendiente' },
    { personaIdx: 2, inmuebleIdx: 2, motivo: 'Uso indebido de estacionamiento', descripcion: 'Vehículo estacionado en espacio de visitas durante 3 días consecutivos sin autorización.', monto: 50, fechaEmision: '2026-04-20', fechaVencimiento: '2026-05-20', estado: 'Pagada' },
  ]

  for (const m of multasData) {
    await prisma.multa.create({
      data: {
        condominioId: condominio.id,
        personaId: personas[m.personaIdx].id,
        inmuebleId: inmuebles[m.inmuebleIdx].id,
        motivo: m.motivo,
        descripcion: m.descripcion,
        monto: m.monto,
        fechaEmision: m.fechaEmision,
        fechaVencimiento: m.fechaVencimiento,
        estado: m.estado,
        aplicadoPor: adminDemo.id,
      },
    })
  }
  console.log(`${multasData.length} multas creadas.`)

  // ─── Notificaciones ──────────────────────────
  const notificacionesData = [
    { titulo: 'Cuota de mayo emitida', descripcion: 'Se ha emitido la cuota de mantenimiento correspondiente a mayo 2026.', tipo: 'Financiero', fecha: '2026-05-01' },
    { titulo: 'Nueva incidencia reportada', descripcion: 'Pedro Sánchez reportó filtración de agua en el piso 3.', tipo: 'Incidencia', fecha: '2026-05-15' },
    { titulo: 'Reserva de parrilla confirmada', descripcion: 'La reserva de parrilla del 01/06 para Dpto 101 ha sido confirmada.', tipo: 'Reserva', fecha: '2026-05-20' },
    { titulo: 'Pago recibido - Dpto 201', descripcion: 'Ana Quispe realizó el pago de la cuota de mayo por S/350.00.', tipo: 'Financiero', fecha: '2026-05-12' },
    { titulo: 'Fumigación programada', descripcion: 'Se realizó la fumigación trimestral del edificio el 10/05.', tipo: 'Mantenimiento', fecha: '2026-05-10' },
    { titulo: 'Multa aplicada - Dpto 102', descripcion: 'Se aplicó multa de S/100 al Dpto 102 por ruido excesivo.', tipo: 'Multa', fecha: '2026-05-15' },
  ]

  for (const n of notificacionesData) {
    await prisma.notificacion.create({
      data: {
        condominioId: condominio.id,
        userId: adminDemo.id,
        titulo: n.titulo,
        descripcion: n.descripcion,
        tipo: n.tipo,
        fecha: n.fecha,
        leida: n.fecha < '2026-05-15',
      },
    })
  }
  console.log(`${notificacionesData.length} notificaciones creadas.`)

  // ─── Credenciales ────────────────────────────
  console.log('\n========================================')
  console.log('  SEED COMPLETADO EXITOSAMENTE')
  console.log('========================================')
  console.log('\nCredenciales:')
  console.log('  Super Admin:')
  console.log('    Email: admin@vecindad360.com')
  console.log('    Password: 123456')
  console.log('  Admin Demo:')
  console.log('    Email: demo@vecindad360.com')
  console.log('    Password: demo123')
  console.log('  Empleado:')
  console.log('    Email: empleado@vecindad360.com')
  console.log('    Password: empleado123')
  console.log('  Residente:')
  console.log('    Email: residente@vecindad360.com')
  console.log('    Password: residente123')
  console.log('========================================\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
