"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  Users,
  ReceiptText,
  AlertTriangle,
  MessageCircle,
  CreditCard,
  Vote,
  FileText,
  BarChart3,
  Bell,
  Shield,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const allFeatures = [
  {
    icon: Calculator,
    title: "Control Financiero",
    description:
      "Panel financiero completo con ingresos, egresos, conciliación bancaria y reportes en tiempo real.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: Users,
    title: "Gestión de Residentes",
    description:
      "Directorio actualizado, registro de mascotas, vehículos, visitantes y personal de servicio.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: ReceiptText,
    title: "Recibos Automáticos",
    description:
      "Generación y envío automático de recibos por WhatsApp y email. Plantillas personalizables.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: AlertTriangle,
    title: "Control de Morosidad",
    description:
      "IA predictiva que identifica unidades en riesgo. Alertas automáticas y planes de pago flexibles.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Integrado",
    description:
      "Comunicación bidireccional. Alertas, consultas de saldo, reportes de incidentes y pagos por chat.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: CreditCard,
    title: "Pasarela de Pagos",
    description:
      "Pagos con tarjeta, PSE y transferencia. Conciliación automática. Recibos con facturación.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: Vote,
    title: "Votación Digital",
    description:
      "Asambleas virtuales con votación vinculante. Quorum automático, actas digitales, firmas electrónicas.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: FileText,
    title: "Documentos Digitales",
    description:
      "Repositorio de actas, reglamentos, contratos y pólizas. Acceso controlado por rol.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: BarChart3,
    title: "Reportes Avanzados",
    description:
      "Dashboard con KPIs, proyecciones financieras, comparativas mensuales y exportación a Excel/PDF.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: Bell,
    title: "Notificaciones Inteligentes",
    description:
      "Push, email, SMS y WhatsApp. Cada stakeholder recibe solo lo que necesita, cuando lo necesita.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: Shield,
    title: "Seguridad Bancaria",
    description:
      "Cifrado AES-256, backups diarios, autenticación de dos factores y cumplimiento de protección de datos.",
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: Settings,
    title: "Personalización Total",
    description:
      "Adapta la plataforma a tu condominio. Crea categorías de gasto, roles personalizados y reglas propias.",
    color: "text-accent-600 bg-accent-50",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${feature.color} flex-shrink-0`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="mb-1">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
