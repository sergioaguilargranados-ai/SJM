import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Deleting duplicates...");
  
  await db.execute(sql`
    DELETE FROM solicitudes_inscripcion 
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY correo, evento_id ORDER BY id) as row_num 
        FROM solicitudes_inscripcion 
        WHERE correo IS NOT NULL AND correo != ''
      ) t WHERE t.row_num > 1
    )
  `);

  await db.execute(sql`
    DELETE FROM solicitudes_inscripcion 
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY telefono_celular, evento_id ORDER BY id) as row_num 
        FROM solicitudes_inscripcion 
        WHERE (correo IS NULL OR correo = '') AND telefono_celular IS NOT NULL AND telefono_celular != ''
      ) t WHERE t.row_num > 1
    )
  `);
  
  console.log("Done");
  process.exit(0);
}

run().catch(console.error);