import { Layers, Building2, DoorClosed, Trash2 } from "lucide-react";
import type { Bloque } from "@/types";

interface BloqueCardProps {
  bloque: Bloque;
  onClick?: () => void;
  onDelete?: () => void;
}

export function BloqueCard({ bloque, onClick, onDelete }: BloqueCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group relative"
    >
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div className="h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-2xl flex items-center justify-center">
        <Layers className="h-10 w-10 text-primary-400" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
            {bloque.nombre}
          </h3>
          <span className="text-[10px] text-surface-400 bg-surface-50 px-2 py-0.5 rounded-full">
            {bloque.edificioNombre}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-surface-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-600">
              <Building2 className="h-3.5 w-3.5" />
              <p className="text-lg font-extrabold">{bloque.pisos}</p>
            </div>
            <p className="text-[10px] text-surface-400">Pisos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-600">
              <DoorClosed className="h-3.5 w-3.5" />
              <p className="text-lg font-extrabold">{bloque.inmuebles}</p>
            </div>
            <p className="text-[10px] text-surface-400">Inmuebles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
