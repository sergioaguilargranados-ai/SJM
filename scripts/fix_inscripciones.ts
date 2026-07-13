import { db } from "../src/lib/db";
import { solicitudes_inscripcion, usuarios, servidores, sedes, ministerios } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function run() {
  console.log("Starting migration...");
  
  const records = await db.select().from(solicitudes_inscripcion);
  console.log(`Found ${records.length} records.`);
  
  let updated = 0;
  for (const record of records) {
    if (!record.usuario_id) continue;
    
    const user: any = await db.query.usuarios.findFirst({ where: eq(usuarios.id, record.usuario_id) });
    const serv: any = await db.query.servidores.findFirst({ where: eq(servidores.usuario_id, record.usuario_id) });
    
    if (user || serv) {
      const fechaNacimiento = serv?.fecha_nacimiento || user?.fecha_nacimiento || record.fecha_nacimiento;
      const sexo = serv?.sexo || user?.sexo || record.sexo;
      const estadoCivil = serv?.estado_civil || record.estado_civil;
      
      let edadNum = record.edad;
      if (fechaNacimiento) {
        const birthDate = new Date(fechaNacimiento);
        const today = new Date();
        edadNum = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          edadNum--;
        }
      }
      
      let sedeNombre = record.pais_ciudad;
      if (serv?.sede_id) {
        const resSede = await db.query.sedes.findFirst({ where: eq(sedes.id, serv.sede_id) });
        if (resSede) sedeNombre = resSede.nombre;
      }
      
      let minNombre = record.ministerio_actual;
      if (serv?.ministerio_id) {
        const resMin = await db.query.ministerios.findFirst({ where: eq(ministerios.id, serv.ministerio_id) });
        if (resMin) minNombre = resMin.nombre;
      }
      
      await db.update(solicitudes_inscripcion)
        .set({
          fecha_nacimiento: fechaNacimiento,
          edad: edadNum,
          sexo: sexo,
          estado_civil: estadoCivil,
          pais_ciudad: sedeNombre,
          ministerio_actual: minNombre
        })
        .where(eq(solicitudes_inscripcion.id, record.id));
        
      updated++;
    }
  }
  
  console.log(`Migration complete. Updated ${updated} records.`);
  process.exit(0);
}

run().catch(console.error);