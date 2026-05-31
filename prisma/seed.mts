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

  // ─── Personas ────────────────────────────────
  const personasData = [
    { documento: '12345678', nombres: 'Luis', apellidos: 'García', genero: 'Masculino', email: 'luis.garcia@email.com', telefono: '999111222', inmuebleIdx: 0, rol: 'Propietario' },
    { documento: '23456789', nombres: 'María', apellidos: 'Torres', genero: 'Femenino', email: 'maria.torres@email.com', telefono: '999333444', inmuebleIdx: 1, rol: 'Propietario' },
    { documento: '34567890', nombres: 'Ana', apellidos: 'Quispe', genero: 'Femenino', email: 'ana.quispe@email.com', telefono: '999555666', inmuebleIdx: 2, rol: 'Inquilino' },
    { documento: '45678901', nombres: 'Pedro', apellidos: 'Sánchez', genero: 'Masculino', email: 'pedro.sanchez@email.com', telefono: '999777888', inmuebleIdx: 3, rol: 'Propietario' },
  ]

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
    console.log(`Persona creada: ${persona.nombres} ${persona.apellidos}`)
  }

  // ─── Áreas Comunes ───────────────────────────
  const areasData = [
    { nombre: 'Parrilla', descripcion: 'Zona de parrillas con capacidad para 20 personas', costoPorHora: 30, capacidadMaxima: 20 },
    { nombre: 'Salón de Eventos', descripcion: 'Salón multiusos para eventos y reuniones', costoPorHora: 50, capacidadMaxima: 60 },
    { nombre: 'Piscina', descripcion: 'Piscina temperada con horario de 8am a 8pm', costoPorHora: 0, capacidadMaxima: 30 },
  ]

  for (const area of areasData) {
    await prisma.areaComun.create({
      data: {
        condominioId: condominio.id,
        ...area,
      },
    })
  }
  console.log('3 áreas comunes creadas.')

  // ─── Cuenta Bancaria ─────────────────────────
  await prisma.cuentaBancaria.create({
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
  await prisma.empleado.create({
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
