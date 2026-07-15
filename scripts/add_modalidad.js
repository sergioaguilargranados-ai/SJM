const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    console.log("Iniciando migración...");
    await pool.query("ALTER TABLE eventos ADD COLUMN IF NOT EXISTS modalidad_evento VARCHAR(50) DEFAULT 'PRESENCIAL';");
    console.log("Migración completada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando migración:", error);
    process.exit(1);
  }
}
main();
