import { RegistroForm } from "@/components/forms/RegistroForm";
import { RegistroPublicoClient } from "@/components/forms/RegistroPublicoClient";
import { RegistroRenaseClient } from "@/components/forms/RegistroRenaseClient";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { eventos, sedes, ministerios, cargos, tipos_eventos } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function RegistroPage({ params }: { params: Promise<{ eventoId: string }> }) {
  const { eventoId } = await params;
  
  const [eventoData] = await db
    .select({
      id: eventos.id,
      tipo: tipos_eventos.nombre,
      casa_retiro_id: eventos.casa_retiro_id,
      fecha_inicio: eventos.fecha_inicio,
      fecha_fin: eventos.fecha_fin,
      estatus: eventos.estatus,
      costo_publico: eventos.costo_publico,
      cupo_maximo: eventos.cupo_maximo,
      contrasena_inscripcion: eventos.contrasena_inscripcion,
      es_matrimonial: eventos.es_matrimonial,
      nombre_evento: eventos.nombre_evento,
      descripcion: eventos.descripcion,
      fecha_inicio_promocion: eventos.fecha_inicio_promocion,
      recomendaciones: eventos.recomendaciones,
      politica_cancelacion: eventos.politica_cancelacion,
      es_evento_servidores: eventos.es_evento_servidores
    })
    .from(eventos)
    .leftJoin(tipos_eventos, eq(eventos.tipo_evento_id, tipos_eventos.id))
    .where(eq(eventos.id, eventoId))
    .limit(1);
  
  if (!eventoData) notFound();

  // Obtener catálogos para el flujo RENASE
  const [
    sedesList,
    ministeriosList,
    cargosList
  ] = await Promise.all([
    db.select().from(sedes).orderBy(sedes.nombre),
    db.select().from(ministerios).orderBy(ministerios.nombre),
    db.select().from(cargos).orderBy(cargos.nombre)
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <RegistroPublicoClient evento={eventoData}>
        {eventoData.es_evento_servidores ? (
          <RegistroRenaseClient evento={eventoData} sedes={sedesList} ministerios={ministeriosList} cargos={cargosList} />
        ) : (
          <RegistroForm eventoId={eventoId} esMatrimonial={eventoData.es_matrimonial ?? false} />
        )}
      </RegistroPublicoClient>
    </div>
  );
}

