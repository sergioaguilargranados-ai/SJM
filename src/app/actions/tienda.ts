"use server";

import { db } from "@/lib/db";
import { 
  categorias_producto, productos_tienda, pedidos_web, detalle_pedido,
  formas_entrega, textos_medios_pago
} from "@/lib/schema";
import { eq, and, desc, asc, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============================================================
// TIENDA ONLINE — Acciones del servidor (Modelo ERPCubox)
// Alineado al schema real de schema.ts
// ============================================================

// ===== LECTURA (público) =====

export async function obtenerCategorias(organizacionId: string) {
  return db.select().from(categorias_producto)
    .where(and(eq(categorias_producto.organizacion_id, organizacionId), eq(categorias_producto.estatus, true)))
    .orderBy(asc(categorias_producto.orden));
}

export async function obtenerProductos(organizacionId: string, categoriaId?: string) {
  const condiciones = [
    eq(productos_tienda.organizacion_id, organizacionId),
    eq(productos_tienda.estatus, true),
  ];
  if (categoriaId) condiciones.push(eq(productos_tienda.categoria_id, categoriaId));

  return db.select({
    id: productos_tienda.id,
    nombre: productos_tienda.nombre,
    descripcion: productos_tienda.descripcion,
    precio: productos_tienda.precio,
    precio_anterior: productos_tienda.precio_anterior,
    stock: productos_tienda.stock,
    sku: productos_tienda.sku,
    imagen_principal_url: productos_tienda.imagen_principal_url,
    categoria_id: productos_tienda.categoria_id,
    destacado: productos_tienda.destacado,
    categoria: categorias_producto.nombre,
  })
    .from(productos_tienda)
    .leftJoin(categorias_producto, eq(productos_tienda.categoria_id, categorias_producto.id))
    .where(and(...condiciones))
    .orderBy(desc(productos_tienda.destacado));
}

export async function obtenerProductoPorId(id: string) {
  const [producto] = await db.select().from(productos_tienda).where(eq(productos_tienda.id, id)).limit(1);
  return producto || null;
}

export async function obtenerFormasEntrega(organizacionId: string) {
  return db.select().from(formas_entrega)
    .where(and(eq(formas_entrega.organizacion_id, organizacionId), eq(formas_entrega.estatus, true)));
}

export async function obtenerMediosPago(organizacionId: string) {
  return db.select().from(textos_medios_pago)
    .where(and(eq(textos_medios_pago.organizacion_id, organizacionId), eq(textos_medios_pago.estatus, true)))
    .orderBy(asc(textos_medios_pago.orden));
}

// ===== PEDIDOS =====

export async function crearPedidoWeb(datos: {
  organizacion_id: string;
  nombre_cliente: string;
  correo_cliente?: string;
  telefono_cliente?: string;
  direccion_envio?: string;
  subtotal: string;
  total: string;
  items: Array<{ producto_id: string; cantidad: number; precio_unitario: string; subtotal: string; }>;
}) {
  const { items, ...datosPedido } = datos;
  
  const [ultimo] = await db.select({ folio: pedidos_web.folio })
    .from(pedidos_web).where(eq(pedidos_web.organizacion_id, datos.organizacion_id))
    .orderBy(desc(pedidos_web.creado_en)).limit(1);
  
  const numFolio = ultimo?.folio ? parseInt(ultimo.folio.replace(/\D/g, "")) + 1 : 1;
  const folio = `PED-${numFolio.toString().padStart(5, "0")}`;

  const [pedido] = await db.insert(pedidos_web).values({
    ...datosPedido, folio,
  }).returning({ id: pedidos_web.id });

  if (pedido && items.length > 0) {
    await db.insert(detalle_pedido).values(
      items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      }))
    );
    // Descontar stock
    for (const item of items) {
      const producto = await obtenerProductoPorId(item.producto_id);
      if (producto && producto.stock !== null) {
        await db.update(productos_tienda)
          .set({ stock: Math.max(0, producto.stock - item.cantidad) })
          .where(eq(productos_tienda.id, item.producto_id));
      }
    }
  }

  revalidatePath("/tienda");
  return { id: pedido?.id, folio };
}

export async function obtenerPedidos(organizacionId: string) {
  return db.select().from(pedidos_web).where(eq(pedidos_web.organizacion_id, organizacionId)).orderBy(desc(pedidos_web.creado_en));
}

export async function obtenerDetallePedido(pedidoId: string) {
  return db.select().from(detalle_pedido).where(eq(detalle_pedido.pedido_id, pedidoId));
}

export async function actualizarEstatusPedido(id: string, estatus: string) {
  await db.update(pedidos_web).set({ estatus, actualizado_en: new Date() }).where(eq(pedidos_web.id, id));
  revalidatePath("/configuracion/tienda");
}

// ===== ADMIN TIENDA =====

export async function crearCategoria(datos: { organizacion_id: string; nombre: string; descripcion?: string; imagen_url?: string; orden?: number; }) {
  await db.insert(categorias_producto).values(datos);
  revalidatePath("/tienda");
  revalidatePath("/configuracion/tienda");
}

export async function actualizarCategoria(id: string, datos: Record<string, unknown>) {
  await db.update(categorias_producto).set(datos).where(eq(categorias_producto.id, id));
  revalidatePath("/tienda");
}

export async function eliminarCategoria(id: string) {
  await db.delete(categorias_producto).where(eq(categorias_producto.id, id));
  revalidatePath("/tienda");
}

export async function crearProducto(datos: {
  organizacion_id: string; nombre: string; descripcion?: string; precio: string;
  precio_anterior?: string; stock?: number; sku?: string;
  imagen_principal_url?: string; categoria_id?: string; destacado?: boolean;
}) {
  await db.insert(productos_tienda).values(datos);
  revalidatePath("/tienda");
  revalidatePath("/configuracion/tienda");
}

export async function actualizarProducto(id: string, datos: Record<string, unknown>) {
  await db.update(productos_tienda).set(datos).where(eq(productos_tienda.id, id));
  revalidatePath("/tienda");
}

export async function eliminarProducto(id: string) {
  await db.delete(productos_tienda).where(eq(productos_tienda.id, id));
  revalidatePath("/tienda");
}

export async function crearFormaEntrega(datos: { organizacion_id: string; nombre: string; descripcion?: string; costo?: string; }) {
  await db.insert(formas_entrega).values(datos);
  revalidatePath("/configuracion/tienda");
}

export async function actualizarFormaEntrega(id: string, datos: Record<string, unknown>) {
  await db.update(formas_entrega).set(datos).where(eq(formas_entrega.id, id));
}

export async function eliminarFormaEntrega(id: string) {
  await db.delete(formas_entrega).where(eq(formas_entrega.id, id));
  revalidatePath("/configuracion/tienda");
}

export async function crearMedioPago(datos: { organizacion_id: string; titulo: string; contenido: string; tipo?: string; orden?: number; }) {
  await db.insert(textos_medios_pago).values(datos);
  revalidatePath("/configuracion/tienda");
}

export async function actualizarMedioPago(id: string, datos: Record<string, unknown>) {
  await db.update(textos_medios_pago).set(datos).where(eq(textos_medios_pago.id, id));
}

export async function eliminarMedioPago(id: string) {
  await db.delete(textos_medios_pago).where(eq(textos_medios_pago.id, id));
  revalidatePath("/configuracion/tienda");
}
