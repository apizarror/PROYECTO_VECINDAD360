import { User, Home, Ruler, Trash2 } from "lucide-react";
import type { Inmueble } from "@/types";

interface InmuebleCardProps {
  inmueble: Inmueble;
  onClick?: () => void;
  onDelete?: () => void;
}

export function InmuebleCard({ inmueble, onClick, onDelete }: InmuebleCardProps) {
  const tieneDeuda = inmueble.saldo < 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group relative overflow-hidden"
    >
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        inmueble.estado === "Ocupado" ? "bg-green-500" : "bg-surface-300"
      }`} />
      <div className="p-4 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-surface-800">Dpto {inmueble.numero}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                inmueble.estado === "Ocupado"
                  ? "bg-green-50 text-green-700"
                  : "bg-surface-100 text-surface-500"
              }`}>
                {inmueble.estado}
              </span>
            </div>
            <p className="text-[11px] text-surface-400 mt-0.5">
              {inmueble.edificioNombre} · {inmueble.bloqueNombre} · Piso {inmueble.piso}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1">
            <Ruler className="h-3 w-3 text-surface-400" />
            <span className="text-xs text-surface-600">{inmueble.area} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-3 w-3 text-surface-400" />
            <span className="text-xs text-surface-600">{inmueble.habitaciones} hab</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-surface-400">Aliq.</span>
            <span className="text-xs text-surface-600">{inmueble.alicuota}%</span>
          </div>
        </div>

        {inmueble.residenteActual && (
          <div className="flex items-center gap-1.5 mt-2">
            <User className="h-3 w-3 text-surface-400" />
            <span className="text-xs text-surface-600">{inmueble.residenteActual}</span>
          </div>
        )}

        {tieneDeuda && (
          <div className="mt-2 px-2 py-1 bg-red-50 rounded-lg">
            <p className="text-xs font-semibold text-red-600">
              Saldo: S/ {Math.abs(inmueble.saldo).toLocaleString()}
            </p>
          </div>
        )}
        {!tieneDeuda && inmueble.estado === "Ocupado" && (
          <div className="mt-2 px-2 py-1 bg-green-50 rounded-lg">
            <p className="text-xs font-semibold text-green-600">Al día</p>
          </div>
        )}
      </div>
    </div>
  );
}
