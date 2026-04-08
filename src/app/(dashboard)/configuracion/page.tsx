import { getUsuarioSesion } from "@/lib/sesion";
import { db } from "@/lib/db";
import { organizaciones } from "@/lib/schema";
import { eq } from "drizzle-orm";
import ConfiguracionClient from "./ConfiguracionClient";

export const dynamic = 'force-dynamic';

export default async function ConfiguracionPage() {
  const usuario = await getUsuarioSesion();
  
  const org = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, usuario.organizacion_id)
  });

  if (!org) {
    return <div>Error: Organización no encontrada</div>;
  }

  return <ConfiguracionClient organizacion={org} />;
}
