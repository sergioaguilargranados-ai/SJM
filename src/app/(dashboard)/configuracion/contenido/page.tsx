import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { secciones_contenido, parametros_landing, testimonios, preguntas_frecuentes, telefonos_emergencia, responsables_organizacion } from "@/lib/schema";
import { eq, desc, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import ContenidoClientView from "./ContenidoClientView";

export default async function ContenidoAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const orgId = session.user.organizacion_id;
  if (!orgId) redirect("/dashboard");

  // Cargar datos en paralelo
  const [secciones, parametros, testimoniosData, faq, telefonos, responsables] = await Promise.all([
    db.select().from(secciones_contenido).where(eq(secciones_contenido.organizacion_id, orgId)).orderBy(asc(secciones_contenido.pagina_clave), asc(secciones_contenido.orden)),
    db.select().from(parametros_landing).where(eq(parametros_landing.organizacion_id, orgId)).limit(1),
    db.select().from(testimonios).where(eq(testimonios.organizacion_id, orgId)).orderBy(desc(testimonios.creado_en)),
    db.select().from(preguntas_frecuentes).where(eq(preguntas_frecuentes.organizacion_id, orgId)).orderBy(asc(preguntas_frecuentes.orden)),
    db.select().from(telefonos_emergencia).where(eq(telefonos_emergencia.organizacion_id, orgId)).orderBy(asc(telefonos_emergencia.orden)),
    db.select().from(responsables_organizacion).where(eq(responsables_organizacion.organizacion_id, orgId)).orderBy(asc(responsables_organizacion.orden)),
  ]);

  return (
    <ContenidoClientView
      secciones={secciones}
      parametros={parametros[0] || null}
      testimonios={testimoniosData}
      faq={faq}
      telefonos={telefonos}
      responsables={responsables}
      organizacionId={orgId}
    />
  );
}
