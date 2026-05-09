import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderPageProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeaderPage({ icon: Icon, title, subtitle, children, className }: HeaderPageProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-800 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-surface-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
