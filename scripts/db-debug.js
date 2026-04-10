const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // 1. Datos del usuario Sergio (Búsqueda amplia)
    const resUser = await client.query("SELECT id, nombre_completo, correo, rol_id, organizacion_id FROM usuarios WHERE correo ILIKE '%sergio%'");
    console.log('USERS FOUND:', resUser.rows);

    // 2. Roles existentes para SJM
    const resRoles = await client.query("SELECT id, nombre, es_admin_sistema FROM roles_sistema WHERE organizacion_id = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd'");
    console.log('ROLES:', resRoles.rows);

    // 3. Planes
    const resPlanes = await client.query("SELECT * FROM planes");
    console.log('ALL PLANES:', resPlanes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
