import type { GrupoRubro, ServicioRubro, ConfiguracionCondominio } from "@/types";

export const gruposRubro: GrupoRubro[] = [
  { id: "g1", nombre: "Servicios Básicos", orden: 1 },
  { id: "g2", nombre: "Mantenimiento", orden: 2 },
  { id: "g3", nombre: "Personal", orden: 3 },
  { id: "g4", nombre: "Administrativos", orden: 4 },
  { id: "g5", nombre: "Fondos y Reservas", orden: 5 },
];

export const serviciosRubro: ServicioRubro[] = [
  { id: "s1", grupoId: "g1", grupoNombre: "Servicios Básicos", nombre: "Agua", tipo: "Ordinario", unidad: "m³", tarifaBase: 3.50, cuentaContable: "63.1.01" },
  { id: "s2", grupoId: "g1", grupoNombre: "Servicios Básicos", nombre: "Luz de Áreas Comunes", tipo: "Ordinario", unidad: "kWh", tarifaBase: 0.85, cuentaContable: "63.1.02" },
  { id: "s3", grupoId: "g1", grupoNombre: "Servicios Básicos", nombre: "Internet Común", tipo: "Ordinario", unidad: "mes", tarifaBase: 250, cuentaContable: "63.1.03" },
  { id: "s4", grupoId: "g2", grupoNombre: "Mantenimiento", nombre: "Jardinería", tipo: "Ordinario", unidad: "mes", tarifaBase: 350, cuentaContable: "63.2.01" },
  { id: "s5", grupoId: "g2", grupoNombre: "Mantenimiento", nombre: "Limpieza de Áreas Comunes", tipo: "Ordinario", unidad: "mes", tarifaBase: 480, cuentaContable: "63.2.02" },
  { id: "s6", grupoId: "g2", grupoNombre: "Mantenimiento", nombre: "Fumigación", tipo: "Ordinario", unidad: "mes", tarifaBase: 200, cuentaContable: "63.2.03" },
  { id: "s7", grupoId: "g2", grupoNombre: "Mantenimiento", nombre: "Pintura de Fachada", tipo: "Extraordinario", unidad: "global", tarifaBase: 5000, cuentaContable: "63.2.04" },
  { id: "s8", grupoId: "g3", grupoNombre: "Personal", nombre: "Vigilancia", tipo: "Ordinario", unidad: "mes", tarifaBase: 2500, cuentaContable: "63.3.01" },
  { id: "s9", grupoId: "g3", grupoNombre: "Personal", nombre: "Conserje", tipo: "Ordinario", unidad: "mes", tarifaBase: 1500, cuentaContable: "63.3.02" },
  { id: "s10", grupoId: "g4", grupoNombre: "Administrativos", nombre: "Gastos Bancarios", tipo: "Ordinario", unidad: "mes", tarifaBase: 45, cuentaContable: "63.4.01" },
  { id: "s11", grupoId: "g4", grupoNombre: "Administrativos", nombre: "Software de Gestión", tipo: "Ordinario", unidad: "mes", tarifaBase: 89, cuentaContable: "63.4.02" },
  { id: "s12", grupoId: "g5", grupoNombre: "Fondos y Reservas", nombre: "Fondo de Contingencia", tipo: "Ordinario", unidad: "mes", tarifaBase: 300, cuentaContable: "63.5.01" },
];

export const configuracionCondominio: ConfiguracionCondominio = {
  razonSocial: "Edificio Principal SAC",
  ruc: "20123456789",
  direccion: "Av. Los Olivos 123, San Isidro, Lima",
  colorPrimario: "#3B82F6",
  zonaHoraria: "America/Lima",
  moneda: "PEN",
  moraDiaria: 0.05,
  whatsappBusinessId: "+51987654321",
  pasarelaPago: "Niubiz",
  smtpHost: "smtp.gmail.com",
};
