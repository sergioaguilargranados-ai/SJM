import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from "./src/lib/db";
import { sql } from "drizzle-orm";
async function run() {
  const r = await db.execute(sql`SELECT id, nombre, es_admin_sistema FROM roles_sistema`);
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
}
run();
