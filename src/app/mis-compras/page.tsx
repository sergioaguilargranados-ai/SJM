import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pedidos_web, detalle_pedido, productos_tienda } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { MisComprasClientView } from "./MisComprasClientView";

export const metadata = {
  title: "Mis Compras | SJM Nacional",
};

export default async function MisComprasPage() {
  const session = await auth();
  if (!session?.user?.usuario_id) redirect("/login");

  // Obtener pedidos del usuario
  const pedidos = await db
    .select()
    .from(pedidos_web)
    .where(eq(pedidos_web.usuario_id, session.user.usuario_id))
    .orderBy(desc(pedidos_web.creado_en));

  // Para cada pedido, obtener sus detalles y productos
  const pedidosConDetalles = await Promise.all(
    pedidos.map(async (pedido) => {
      const detalles = await db
        .select({
          id: detalle_pedido.id,
          cantidad: detalle_pedido.cantidad,
          precio_unitario: detalle_pedido.precio_unitario,
          subtotal: detalle_pedido.subtotal,
          producto: {
            id: productos_tienda.id,
            nombre: productos_tienda.nombre,
            imagen_principal_url: productos_tienda.imagen_principal_url,
          },
        })
        .from(detalle_pedido)
        .innerJoin(productos_tienda, eq(detalle_pedido.producto_id, productos_tienda.id))
        .where(eq(detalle_pedido.pedido_id, pedido.id));

      return {
        ...pedido,
        detalles,
      };
    })
  );

  return <MisComprasClientView pedidos={pedidosConDetalles as any} />;
}
