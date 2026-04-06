"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { actualizarEstatusInscripcion } from "@/app/actions/catalogos";

const OPCIONES_ESTATUS = [
  { valor: "PENDIENTE_PAGO", label: "Pendiente Pago", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  { valor: "CONFIRMADO", label: "Confirmado", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  { valor: "ASISTIO", label: "Asistió", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  { valor: "CANCELADO", label: "Cancelado", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
];

export function SelectorEstatus({ inscripcionId, estatusActual }: { inscripcionId: string; estatusActual: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const opcionActual = OPCIONES_ESTATUS.find((o) => o.valor === estatusActual);

  const handleChange = (nuevoEstatus: string) => {
    if (nuevoEstatus === estatusActual) return;
    startTransition(async () => {
      await actualizarEstatusInscripcion(inscripcionId, nuevoEstatus);
      router.refresh();
    });
  };

  return (
    <select
      value={estatusActual || "PENDIENTE_PAGO"}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border cursor-pointer transition-all disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48] ${opcionActual?.color || "bg-slate-100 text-slate-600 border-slate-200"}`}
    >
      {OPCIONES_ESTATUS.map((op) => (
        <option key={op.valor} value={op.valor}>
          {op.label}
        </option>
      ))}
    </select>
  );
}
