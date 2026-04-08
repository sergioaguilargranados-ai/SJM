"use client";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  title: string;
  message: string;
  type: ToastType;
  onClose: () => void;
}

function ToastComponent({ title, message, type, onClose }: ToastProps) {
  const dotColor = {
    success: "#10B981", // Verde
    error: "#EF4444",   // Rojo
    warning: "#F59E0B", // Amarillo
    info: "#3B82F6",    // Azul
  }[type];

  return (
    <div className="sjm-toast">
      <div className="sjm-toast-content">
        <div className="sjm-toast-dot" style={{ backgroundColor: dotColor }} />
        <div className="sjm-toast-text">
          <p className="sjm-toast-title">{title}</p>
          <p className="sjm-toast-message">{message}</p>
        </div>
        <button onClick={onClose} className="sjm-toast-btn">
          Aceptar
        </button>
      </div>
    </div>
  );
}

export const sjmToast = (title: string, message: string, type: ToastType = "success") => {
  if (typeof window === "undefined") return;

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(<ToastComponent title={title} message={message} type={type} onClose={close} />);

  // Auto-close después de 5 segundos
  setTimeout(close, 5000);
};
