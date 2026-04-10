import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { productos_tienda, categorias_producto, pedidos_web, formas_entrega, textos_medios_pago } from "@/lib/schema";
import { eq, desc, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import TiendaAdminClientView from "./TiendaAdminClientView";

export default async function TiendaAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const orgId = session.user.organizacion_id;
  if (!orgId) redirect("/dashboard");

  const [productos, categorias, pedidos, formasEntrega, mediosPago] = await Promise.all([
    db.select({
      id: productos_tienda.id,
      nombre: productos_tienda.nombre,
      precio: productos_tienda.precio,
      precio_anterior: productos_tienda.precio_anterior,
      stock: productos_tienda.stock,
      sku: productos_tienda.sku,
      imagen_principal_url: productos_tienda.imagen_principal_url,
      estatus: productos_tienda.estatus,
      destacado: productos_tienda.destacado,
      categoria_id: productos_tienda.categoria_id,
      descripcion: productos_tienda.descripcion,
    })
      .from(productos_tienda)
      .where(eq(productos_tienda.organizacion_id, orgId)),
    db.select().from(categorias_producto).where(eq(categorias_producto.organizacion_id, orgId)).orderBy(asc(categorias_producto.orden)),
    db.select().from(pedidos_web).where(eq(pedidos_web.organizacion_id, orgId)).orderBy(desc(pedidos_web.creado_en)),
    db.select().from(formas_entrega).where(eq(formas_entrega.organizacion_id, orgId)),
    db.select().from(textos_medios_pago).where(eq(textos_medios_pago.organizacion_id, orgId)),
  ]);

  return (
    <TiendaAdminClientView
      productos={productos}
      categorias={categorias}
      pedidos={pedidos}
      formasEntrega={formasEntrega}
      mediosPago={mediosPago}
      organizacionId={orgId}
    />
  );
}
