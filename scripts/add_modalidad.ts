import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Iniciando migración para agregar modalidad_evento a eventos...");
    await db.execute(sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS modalidad_evento VARCHAR(50) DEFAULT 'PRESENCIAL';`);
    console.log("Migración completada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando migración:", error);
    process.exit(1);
  }
}
main();
