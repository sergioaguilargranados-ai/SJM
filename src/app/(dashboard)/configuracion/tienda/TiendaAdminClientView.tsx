"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Package, Truck, CreditCard, ShoppingCart, Eye } from "lucide-react";
import { crearProducto, actualizarProducto, eliminarProducto, crearCategoria, actualizarCategoria, eliminarCategoria, actualizarEstatusPedido, crearFormaEntrega, eliminarFormaEntrega, crearMedioPago, eliminarMedioPago } from "@/app/actions/tienda";

interface TiendaAdminClientViewProps {
  productos: any[];
  categorias: any[];
  pedidos: any[];
  formasEntrega: any[];
  mediosPago: any[];
  organizacionId: string;
}

export default function TiendaAdminClientView({ productos, categorias, pedidos, formasEntrega, mediosPago, organizacionId }: TiendaAdminClientViewProps) {
  const [isPending, startTransition] = useTransition();
  const [tabActiva, setTabActiva] = useState("productos");
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [formProducto, setFormProducto] = useState({ nombre: "", descripcion: "", precio: "", precio_oferta: "", stock: 0, sku: "", categoria_id: "", imagen_url: "", destacado: false, orden: 0 });
  const [formCategoria, setFormCategoria] = useState({ nombre: "", descripcion: "", imagen_url: "", orden: 0 });

  const tabs = [
    { id: "productos", nombre: "Productos", icono: Package, count: productos.length },
    { id: "categorias", nombre: "Categorías", icono: ShoppingBag, count: categorias.length },
    { id: "pedidos", nombre: "Pedidos", icono: ShoppingCart, count: pedidos.length },
    { id: "envios", nombre: "Envíos y Pagos", icono: Truck, count: formasEntrega.length + mediosPago.length },
  ];

  const guardarProductoForm = () => {
    startTransition(async () => {
      const datos = { ...formProducto, organizacion_id: organizacionId };
      if (editandoId) {
        await actualizarProducto(editandoId, datos);
      } else {
        await crearProducto(datos);
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const guardarCategoriaForm = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarCategoria(editandoId, formCategoria);
      } else {
        await crearCategoria({ ...formCategoria, organizacion_id: organizacionId });
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const estatusPedidoColor: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    confirmado: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    enviado: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    entregado: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    cancelado: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Tienda Online</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra productos, pedidos y configuración de la tienda</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-[#2a2b3d] pb-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setTabActiva(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabActiva === tab.id ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d]"}`}>
            <tab.icono className="w-4 h-4" /> {tab.nombre}
            {tab.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tabActiva === tab.id ? "bg-white/20" : "bg-slate-200 dark:bg-[#2a2b3d]"}`}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* === TAB PRODUCTOS === */}
      {tabActiva === "productos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFormProducto({ nombre: "", descripcion: "", precio: "", precio_oferta: "", stock: 0, sku: "", categoria_id: "", imagen_url: "", destacado: false, orden: productos.length + 1 }); setEditandoId(null); setModalAbierto("producto"); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nuevo Producto
            </button>
          </div>

          {productos.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Aún no hay productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productos.map((p) => (
                <div key={p.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a2b3d] dark:to-[#1a1b26] flex items-center justify-center">
                    {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} className="h-full w-full object-cover" /> : <Package className="w-10 h-10 text-slate-300" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.nombre}</h3>
                        {p.sku && <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>}
                      </div>
                      {p.destacado && <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-bold">⭐</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black text-emerald-600">${p.precio}</span>
                      {p.precio_oferta && <span className="text-sm text-slate-400 line-through">${p.precio_oferta}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-500">Stock: {p.stock ?? "∞"}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setFormProducto({ nombre: p.nombre, descripcion: p.descripcion || "", precio: p.precio, precio_oferta: p.precio_oferta || "", stock: p.stock || 0, sku: p.sku || "", categoria_id: p.categoria_id || "", imagen_url: p.imagen_url || "", destacado: p.destacado || false, orden: p.orden || 0 }); setEditandoId(p.id); setModalAbierto("producto"); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => startTransition(() => eliminarProducto(p.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB CATEGORÍAS === */}
      {tabActiva === "categorias" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFormCategoria({ nombre: "", descripcion: "", imagen_url: "", orden: categorias.length + 1 }); setEditandoId(null); setModalAbierto("categoria"); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nueva Categoría
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((c) => (
              <div key={c.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold shrink-0">
                  {c.nombre?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.nombre}</h3>
                  {c.descripcion && <p className="text-xs text-slate-500 mt-0.5">{c.descripcion}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setFormCategoria({ nombre: c.nombre, descripcion: c.descripcion || "", imagen_url: c.imagen_url || "", orden: c.orden || 0 }); setEditandoId(c.id); setModalAbierto("categoria"); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => startTransition(() => eliminarCategoria(c.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TAB PEDIDOS === */}
      {tabActiva === "pedidos" && (
        <div className="space-y-3">
          {pedidos.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
              <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No hay pedidos aún</p>
            </div>
          ) : (
            pedidos.map((p) => (
              <div key={p.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-slate-900 dark:text-white">{p.folio_pedido}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${estatusPedidoColor[p.estatus_pedido] || estatusPedidoColor.pendiente}`}>
                      {p.estatus_pedido}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{p.nombre_cliente} · {p.correo_cliente}</p>
                  <p className="text-xs text-slate-400">{new Date(p.creado_en).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-emerald-600">${p.total}</p>
                </div>
                <select
                  value={p.estatus_pedido}
                  onChange={(e) => startTransition(() => actualizarEstatusPedido(p.id, e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-xs font-medium"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}

      {/* === TAB ENVÍOS Y PAGOS === */}
      {tabActiva === "envios" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" /> Formas de Entrega</h2>
            <div className="space-y-3">
              {formasEntrega.map((f) => (
                <div key={f.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{f.nombre}</h3>
                    <p className="text-xs text-slate-500">{f.descripcion} {f.costo && `· $${f.costo}`}</p>
                  </div>
                  <button onClick={() => startTransition(() => eliminarFormaEntrega(f.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <button onClick={() => startTransition(() => crearFormaEntrega({ organizacion_id: organizacionId, nombre: "Nueva forma de entrega" }))} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                <Plus className="w-3.5 h-3.5" /> Agregar forma de entrega
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-500" /> Medios de Pago</h2>
            <div className="space-y-3">
              {mediosPago.map((m) => (
                <div key={m.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{m.titulo}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{m.contenido}</p>
                  </div>
                  <button onClick={() => startTransition(() => eliminarMedioPago(m.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <button onClick={() => startTransition(() => crearMedioPago({ organizacion_id: organizacionId, titulo: "Nuevo medio de pago", contenido: "Instrucciones del medio de pago" }))} className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                <Plus className="w-3.5 h-3.5" /> Agregar medio de pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODALES === */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(null)}>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a2b3d]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editandoId ? "Editar" : "Nuevo"} {modalAbierto === "producto" ? "Producto" : "Categoría"}</h2>
              <button onClick={() => setModalAbierto(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {modalAbierto === "producto" && (
                <>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label><input type="text" value={formProducto.nombre} onChange={(e) => setFormProducto({...formProducto, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label><textarea rows={3} value={formProducto.descripcion} onChange={(e) => setFormProducto({...formProducto, descripcion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-xs font-bold mb-1">Precio</label><input type="text" value={formProducto.precio} onChange={(e) => setFormProducto({...formProducto, precio: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                    <div><label className="block text-xs font-bold mb-1">Oferta</label><input type="text" value={formProducto.precio_oferta} onChange={(e) => setFormProducto({...formProducto, precio_oferta: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                    <div><label className="block text-xs font-bold mb-1">Stock</label><input type="number" value={formProducto.stock} onChange={(e) => setFormProducto({...formProducto, stock: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-bold mb-1">SKU</label><input type="text" value={formProducto.sku} onChange={(e) => setFormProducto({...formProducto, sku: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                    <div><label className="block text-xs font-bold mb-1">Categoría</label><select value={formProducto.categoria_id} onChange={(e) => setFormProducto({...formProducto, categoria_id: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm"><option value="">Sin categoría</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
                  </div>
                  <div><label className="block text-xs font-bold mb-1">URL Imagen</label><input type="url" value={formProducto.imagen_url} onChange={(e) => setFormProducto({...formProducto, imagen_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer"><input type="checkbox" checked={formProducto.destacado} onChange={(e) => setFormProducto({...formProducto, destacado: e.target.checked})} /> Producto destacado</label>
                  <button onClick={guardarProductoForm} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Producto"}</button>
                </>
              )}
              {modalAbierto === "categoria" && (
                <>
                  <div><label className="block text-xs font-bold mb-1">Nombre</label><input type="text" value={formCategoria.nombre} onChange={(e) => setFormCategoria({...formCategoria, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                  <div><label className="block text-xs font-bold mb-1">Descripción</label><textarea rows={3} value={formCategoria.descripcion} onChange={(e) => setFormCategoria({...formCategoria, descripcion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" /></div>
                  <button onClick={guardarCategoriaForm} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar"}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
