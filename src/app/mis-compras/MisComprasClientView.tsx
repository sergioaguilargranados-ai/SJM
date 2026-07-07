"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  FileText,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  ArrowLeft,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarPublica } from "@/components/layout/NavbarPublica";

type PedidoDetalle = {
  id: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  producto: {
    id: string;
    nombre: string;
    imagen_principal_url: string | null;
  };
};

type PedidoWeb = {
  id: string;
  folio: string | null;
  total: string | null;
  estatus: string | null;
  creado_en: Date | null;
  forma_entrega: string | null;
  detalles: PedidoDetalle[];
};

export function MisComprasClientView({ pedidos }: { pedidos: PedidoWeb[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatearMoneda = (valor: string | number | null) => {
    if (!valor) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(valor));
  };

  const getStatusColor = (estatus: string | null) => {
    switch (estatus?.toUpperCase()) {
      case "ENTREGADO":
      case "PAGADO":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30";
      case "PENDIENTE":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30";
      case "CANCELADO":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const handleDescargarPDF = (pedidoId: string) => {
    // Aquí conectaremos con la API de generación de PDF
    alert("Función de descargar PDF próximamente habilitada.");
  };

  const handleVolverAComprar = (pedido: PedidoWeb) => {
    // Aquí conectaremos con el carrito de compras para re-agregar los items
    alert("Función de volver a comprar próximamente habilitada. Serás redirigido a la tienda.");
    window.location.href = "/tienda";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0f1015]">
      <NavbarPublica />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-xs font-black text-[#00B4AA] hover:text-[#009a96] uppercase tracking-tight mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Volver al Inicio
              </Link>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#00B4AA]" /> Mis Compras
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Historial de tus pedidos y compras en la tienda
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-[#1a1b26] p-1 rounded-xl border border-slate-200 dark:border-[#2a2b3d] self-start sm:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-slate-100 dark:bg-[#0f1015] text-[#00B4AA]" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-slate-100 dark:bg-[#0f1015] text-[#00B4AA]" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {pedidos.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1b26] rounded-3xl border border-slate-200 dark:border-[#2a2b3d] p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-[#0f1015] rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-[#2a2b3d]">
                <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aún no tienes compras</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                No se encontraron pedidos en tu historial. Explora la tienda y descubre nuestros recursos.
              </p>
              <Button className="bg-[#00B4AA] hover:bg-[#009a96] text-white rounded-xl font-bold px-8">
                Ir a la Tienda
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {pedidos.map((pedido) => (
                <div 
                  key={pedido.id} 
                  className={`bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm overflow-hidden transition-all hover:shadow-md ${
                    viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
                  }`}
                >
                  {/* Card Header / Info Principal */}
                  <div className={`p-5 flex-1 ${viewMode === "list" ? "border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-[#2a2b3d]" : "border-b border-slate-100 dark:border-[#2a2b3d]"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                            Folio
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {pedido.folio || "Sin Folio"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {pedido.creado_en 
                            ? format(new Date(pedido.creado_en), "dd 'de' MMM, yyyy", { locale: es })
                            : "Fecha desconocida"
                          }
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${getStatusColor(pedido.estatus)}`}>
                        {pedido.estatus || "PENDIENTE"}
                      </div>
                    </div>

                    {/* Resumen de Productos */}
                    <div className="flex gap-2 mb-4">
                      {pedido.detalles.slice(0, 3).map((detalle) => (
                        <div key={detalle.id} className="relative w-12 h-12 rounded-lg bg-slate-50 dark:bg-[#0f1015] border border-slate-200 dark:border-[#2a2b3d] overflow-hidden group">
                          {detalle.producto.imagen_principal_url ? (
                            <Image
                              src={detalle.producto.imagen_principal_url}
                              alt={detalle.producto.nombre}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">x{detalle.cantidad}</span>
                          </div>
                        </div>
                      ))}
                      {pedido.detalles.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#2a2b3d] border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            +{pedido.detalles.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5" /> Entrega: {pedido.forma_entrega || "No especificada"}
                    </div>
                  </div>

                  {/* Card Footer / Acciones */}
                  <div className={`bg-slate-50/50 dark:bg-[#0f1015]/30 p-5 flex flex-col justify-between ${
                    viewMode === "list" ? "sm:w-64" : ""
                  }`}>
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {formatearMoneda(pedido.total)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleVolverAComprar(pedido)}
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 h-10 rounded-xl font-bold text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" /> Volver a Comprar
                      </Button>
                      <Button 
                        onClick={() => handleDescargarPDF(pedido.id)}
                        variant="outline"
                        className="w-full bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0f1015] h-10 rounded-xl font-bold text-xs"
                      >
                        <FileText className="w-3.5 h-3.5 mr-2" /> Descargar PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
