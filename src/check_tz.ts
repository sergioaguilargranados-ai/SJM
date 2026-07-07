import { config } from "dotenv";
config({ path: ".env.local" });
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  try {
    await client.connect();
    const res = await client.query('SHOW TIMEZONE;');
    console.log("DB Timezone:", res.rows[0]);
    const res2 = await client.query('SELECT fecha_inicio FROM eventos WHERE nombre_evento ILIKE \'%RENASE%\' LIMIT 1;');
    console.log("Event fecha_inicio in DB:", res2.rows[0]);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

main();
