const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    console.log("Migrating quiere_consulta_medica and dia_consulta_medica...");
    await pool.query("ALTER TABLE solicitudes_inscripcion ADD COLUMN IF NOT EXISTS quiere_consulta_medica BOOLEAN DEFAULT false;");
    await pool.query("ALTER TABLE solicitudes_inscripcion ADD COLUMN IF NOT EXISTS dia_consulta_medica VARCHAR(50);");
    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}
main();
