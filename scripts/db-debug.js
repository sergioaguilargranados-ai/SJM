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

    // 3. Permisos asignados a esos roles
    const resPerms = await client.query(`
      SELECT r.nombre as rol, m.clave as modulo, a.clave as accion
      FROM rol_permisos rp
      JOIN roles_sistema r ON rp.rol_id = r.id
      JOIN acciones_sistema a ON rp.accion_id = a.id
      JOIN funciones_sistema f ON a.funcion_id = f.id
      JOIN modulos_sistema m ON f.modulo_id = m.id
      WHERE r.organizacion_id = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd'
    `);
    console.log('PERMISSIONS:', resPerms.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
