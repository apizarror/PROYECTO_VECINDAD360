import { Building2, Trash2 } from "lucide-react";
import type { Edificio } from "@/types";

interface EdificioCardProps {
  edificio: Edificio;
  onClick?: () => void;
  onDelete?: () => void;
}

export function EdificioCard({ edificio, onClick, onDelete }: EdificioCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group relative"
    >
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-t-2xl flex items-center justify-center">
        <Building2 className="h-12 w-12 text-white/70" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-surface-800 text-lg group-hover:text-primary-600 transition-colors">
          {edificio.nombre}
        </h3>
        <p className="text-xs text-surface-400 mt-1 truncate">{edificio.direccion}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            edificio.estado === "Activo"
              ? "bg-green-50 text-green-700"
              : "bg-surface-100 text-surface-500"
          }`}>
            {edificio.estado}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-surface-100">
          <div className="text-center">
            <p className="text-lg font-extrabold text-surface-800">{edificio.bloques}</p>
            <p className="text-[10px] text-surface-400">Bloques</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-surface-800">{edificio.pisosTotales}</p>
            <p className="text-[10px] text-surface-400">Pisos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-surface-800">{edificio.departamentosTotales}</p>
            <p className="text-[10px] text-surface-400">Dptos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
