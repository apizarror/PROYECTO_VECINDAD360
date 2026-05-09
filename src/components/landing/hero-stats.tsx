"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Building2, Users, ThumbsUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const statItems = [
  { icon: Building2, value: 500, suffix: "+", label: "Vecindades activas", color: "text-accent-400" },
  { icon: Users, value: 12000, suffix: "+", label: "Residentes", color: "text-primary-400" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Satisfacción", color: "text-green-400" },
  { icon: Zap, value: 5, suffix: " min", label: "Configuración", color: "text-amber-400" },
];

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  inView,
}: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
  inView: boolean;
}) {
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 3, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col items-center text-center gap-2 hover:bg-white/15 transition-colors"
    >
      <Icon className={`h-7 w-7 ${color}`} />
      <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
        <motion.span>{displayValue}</motion.span>
        {suffix}
      </div>
      <p className="text-sm text-white/60">{label}</p>
    </motion.div>
  );
}

export function HeroStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-2 gap-4 w-full max-w-[460px]"
    >
      {statItems.map((stat, i) => (
        <StatCard key={i} {...stat} inView={inView} />
      ))}
    </motion.div>
  );
}
