const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    console.log("Migrating fecha_hora_llegada and fecha_hora_salida to VARCHAR...");
    await pool.query("ALTER TABLE solicitudes_inscripcion ALTER COLUMN fecha_hora_llegada TYPE VARCHAR(255);");
    await pool.query("ALTER TABLE solicitudes_inscripcion ALTER COLUMN fecha_hora_salida TYPE VARCHAR(255);");
    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}
main();
