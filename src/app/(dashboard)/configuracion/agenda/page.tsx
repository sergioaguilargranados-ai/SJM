import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { agenda_retiros, tipos_eventos, sedes, casas_retiro } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import AgendaAdminClientView from "./AgendaAdminClientView";

export default async function AgendaAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const orgId = session.user.organizacion_id;
  if (!orgId) redirect("/dashboard");

  const [retiros, tiposEv, sedesData, casasData] = await Promise.all([
    db.select({
      id: agenda_retiros.id, nombre_evento: agenda_retiros.nombre_evento, 
      fecha_inicio: agenda_retiros.fecha_inicio, fecha_fin: agenda_retiros.fecha_fin,
      hora_entrada: agenda_retiros.hora_entrada, hora_salida: agenda_retiros.hora_salida,
      cupo_maximo: agenda_retiros.cupo_maximo, costo: agenda_retiros.costo,
      descripcion: agenda_retiros.descripcion, estatus: agenda_retiros.estatus,
      tipo_evento_id: agenda_retiros.tipo_evento_id, sede_id: agenda_retiros.sede_id,
      tipo_evento: tipos_eventos.nombre, sede_nombre: sedes.nombre,
    })
      .from(agenda_retiros)
      .leftJoin(tipos_eventos, eq(agenda_retiros.tipo_evento_id, tipos_eventos.id))
      .leftJoin(sedes, eq(agenda_retiros.sede_id, sedes.id))
      .where(eq(agenda_retiros.organizacion_id, orgId))
      .orderBy(asc(agenda_retiros.fecha_inicio)),
    db.select().from(tipos_eventos).where(eq(tipos_eventos.organizacion_id, orgId)),
    db.select().from(sedes).where(eq(sedes.organizacion_id, orgId)),
    db.select().from(casas_retiro),
  ]);

  return <AgendaAdminClientView retiros={retiros} tiposEvento={tiposEv} sedes={sedesData} casasRetiro={casasData} organizacionId={orgId} />;
}
