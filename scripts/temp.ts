import { db } from "../src/lib/db";
import { organizaciones, secciones_contenido } from "../src/lib/schema";

async function run() {
  const orgs = await db.select().from(organizaciones).limit(1);
  if (!orgs.length) return;
  const orgId = orgs[0].id;
  
  await db.insert(secciones_contenido).values([
    {
      organizacion_id: orgId, paginas_clave: "nosotros", clave_seccion: "carisma", // CORRECCION: pagina_clave
      titulo: "Nuestro Carisma",
      contenido: "Configurados con Cristo compasivo y misericordioso, anunciar la Buena Nueva, haciendo presente la misericordia de Dios",
      orden: 4, mostrar_titulo: true, estatus: true
    }
  ]).onConflictDoNothing();
}
run();
