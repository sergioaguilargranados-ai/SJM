import { db } from './src/lib/db.js';
import { usuarios, roles_sistema } from './src/lib/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const email = 'sergio.aguilar.granados@gmail.com';
    const user = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, email),
      with: { rol: true }
    });
    
    console.log('USER DATA:', JSON.stringify(user, null, 2));

    const roles = await db.select().from(roles_sistema).where(eq(roles_sistema.organizacion_id, '6fb191cc-a477-4632-9cb1-c30c33a9f9bd'));
    console.log('ALL ROLES:', JSON.stringify(roles, null, 2));
    
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

main();
