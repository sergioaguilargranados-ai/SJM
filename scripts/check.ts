import { db } from "../src/lib/db";
import { funciones_sistema } from "../src/lib/schema";

async function main() {
  const funcRes = await db.select().from(funciones_sistema);
  console.log(funcRes);
  process.exit(0);
}
main();
