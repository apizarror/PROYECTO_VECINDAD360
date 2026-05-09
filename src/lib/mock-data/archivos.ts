import type { Archivo, Notificacion } from "@/types";

export const archivos: Archivo[] = [
  { id: "ar1", nombre: "Reglamento Interno 2026", descripcion: "Reglamento actualizado de convivencia del condominio.", categoria: "Reglamentos", formato: "PDF", visibilidad: "Público", subidoPor: "Carlos Ruiz", fecha: "2026-01-15", tamano: "2.4 MB" },
  { id: "ar2", nombre: "Acta de Asamblea - Marzo 2026", descripcion: "Acta de la asamblea general de propietarios del 15 de marzo.", categoria: "Actas", formato: "PDF", visibilidad: "Público", subidoPor: "Carlos Ruiz", fecha: "2026-03-16", tamano: "1.1 MB" },
  { id: "ar3", nombre: "Contrato de Vigilancia 2026", descripcion: "Contrato con empresa de seguridad para servicios de vigilancia.", categoria: "Contratos", formato: "PDF", visibilidad: "Solo directiva", subidoPor: "Carlos Ruiz", fecha: "2026-01-05", tamano: "3.2 MB" },
  { id: "ar4", nombre: "Estado Financiero - Q1 2026", descripcion: "Reporte financiero del primer trimestre: ingresos, egresos y saldo.", categoria: "Estados financieros", formato: "Excel", visibilidad: "Solo admin", subidoPor: "Carlos Ruiz", fecha: "2026-04-05", tamano: "856 KB" },
  { id: "ar5", nombre: "Manual de Áreas Comunes", descripcion: "Guía de uso y reglamento de cada área común del condominio.", categoria: "Otros", formato: "Word", visibilidad: "Público", subidoPor: "Carlos Ruiz", fecha: "2026-02-10", tamano: "1.8 MB" },
  { id: "ar6", nombre: "Fotos de Áreas Comunes", descripcion: "Registro fotográfico de todas las áreas para inventario.", categoria: "Otros", formato: "Imagen", visibilidad: "Solo admin", subidoPor: "Jorge Ramírez", fecha: "2026-02-20", tamano: "5.6 MB" },
];

export const notificacionesMock: Notificacion[] = [
  { id: "n1", titulo: "Cuota vencida", descripcion: "Dpto 302 tiene cuota de mayo pendiente. Vencimiento: 15/05.", tipo: "cuota", leida: false, fecha: "2026-05-03 08:00" },
  { id: "n2", titulo: "Reserva confirmada", descripcion: "Parrilla reservada por Luis García para el 10/05 de 18:00 a 22:00.", tipo: "reserva", leida: false, fecha: "2026-05-03 10:30" },
  { id: "n3", titulo: "Incidencia asignada", descripcion: "Fuga de agua en Bloque A - Piso 3. Asignada a Miguel Castro.", tipo: "incidencia", leida: false, fecha: "2026-05-02 15:00" },
  { id: "n4", titulo: "Visita programada", descripcion: "Raquel Vega visitará Dpto 102 Bloque B el 04/05 a las 18:00.", tipo: "visita", leida: true, fecha: "2026-05-03 12:00" },
  { id: "n5", titulo: "Pago confirmado", descripcion: "Luis García pagó S/ 350 de cuota ordinaria de mayo vía Yape.", tipo: "pago", leida: true, fecha: "2026-05-01 09:15" },
  { id: "n6", titulo: "Pago confirmado", descripcion: "Roberto Díaz pagó S/ 80 de reserva de parrilla vía Tarjeta.", tipo: "pago", leida: true, fecha: "2026-05-05 14:20" },
  { id: "n7", titulo: "Incidencia resuelta", descripcion: "Ascensor Bloque B reparado y funcionando normalmente.", tipo: "incidencia", leida: true, fecha: "2026-05-02 16:00" },
];
