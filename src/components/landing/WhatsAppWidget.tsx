"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

// ============================================================
// WhatsAppWidget — Botón flotante de WhatsApp
// Usa el número del tenant para generar el link wa.me
// ============================================================

interface WhatsAppWidgetProps {
  telefono: string; // Formato: +521234567890
  mensaje?: string;
  nombreOrg?: string;
}

export function WhatsAppWidget({
  telefono,
  mensaje = "¡Hola! Me gustaría obtener más información.",
  nombreOrg = "SJM",
}: WhatsAppWidgetProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Limpiar teléfono (solo números y +)
  const tel = telefono.replace(/[^+\d]/g, "");
  const waUrl = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / Burbuja */}
      {tooltipVisible && (
        <div className="relative bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] p-4 max-w-[280px] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={() => setTooltipVisible(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            💬 ¿Necesitas ayuda?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chatea con nosotros por WhatsApp. Estamos para servirte.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Iniciar Chat
          </a>
        </div>
      )}

      {/* Botón principal flotante */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setTooltipVisible(true)}
        className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110 active:scale-95"
        aria-label={`Contactar a ${nombreOrg} por WhatsApp`}
      >
        <MessageCircle className="w-7 h-7 text-white" />

        {/* Efecto de ping */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
      </a>
    </div>
  );
}
