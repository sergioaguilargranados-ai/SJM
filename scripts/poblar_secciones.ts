import { db } from "../src/lib/db";
import { organizaciones, secciones_contenido } from "../src/lib/schema";

async function run() {
  const orgs = await db.select().from(organizaciones).limit(1);
  if (!orgs.length) {
    console.log("No hay organizaciones");
    return;
  }
  const orgId = orgs[0].id;
  
  await db.insert(secciones_contenido).values([
    {
      organizacion_id: orgId,
      pagina_clave: "nosotros",
      titulo: "UN DON DEL ESPÍRITU SANTO EN NUESTRO TIEMPO",
      contenido: "Configurados con Cristo compasivo y misericordioso, anunciamos la Buena Nueva, haciendo presente la misericordia de Dios y su redención a los más necesitados.",
      orden: 1,
      estatus: true
    },
    {
      organizacion_id: orgId,
      pagina_clave: "nosotros",
      titulo: "Nuestra Misión",
      contenido: "El Instituto Secular Servidores de Jesús por María, movidos por el Espíritu Santo, bajo el cuidado maternal de María Santísima nuestra Madre, busca instaurar el Reino de los Cielos a través de diferentes apostolados: niños, jóvenes, adultos y matrimonios, y así responder al llamado universal de la santidad viviendo en la civilización del amor.",
      orden: 2,
      estatus: true
    },
    {
      organizacion_id: orgId,
      pagina_clave: "nosotros",
      titulo: "Nuestra Visión",
      contenido: "Ser reconocidos como una fuerza viva de transformación social y espiritual. Ser un claro referente de fe que inspire a cada vez más fieles a sumarse a esta gran obra.",
      orden: 3,
      estatus: true
    }
  ]).onConflictDoNothing();
  
  console.log("DB Poblada exitosamente.");
}
run();
