const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    console.log('--- EXECUTING PROMOTION SCRIPT ---');

    // 1. Obtener el ID del rol "Super Administrador" de SJM
    const resRole = await client.query("SELECT id FROM roles_sistema WHERE nombre = 'Super Administrador' AND organizacion_id = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd'");
    const superAdminRoleId = resRole.rows[0]?.id;

    if (superAdminRoleId) {
      // 2. Asignar este rol al usuario Sergio
      const resUpdate = await client.query("UPDATE usuarios SET rol_id = $1 WHERE correo = 'sergio.aguilar.granados@gmail.com' RETURNING id, nombre_completo", [superAdminRoleId]);
      console.log('✅ Usuario Sergio promovido a Super Administrador:', resUpdate.rows[0]);
    } else {
      console.error('❌ No se encontró el rol Super Administrador');
    }

    // 3. Asegurar que el rol "Administrador" también tenga es_admin_sistema = true (para facilitar pruebas)
    await client.query("UPDATE roles_sistema SET es_admin_sistema = true WHERE nombre = 'Administrador' AND organizacion_id = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd'");
    console.log('✅ Rol Administrador marcado como Admin de Sistema');

    // 4. Verificar resultado final
    const finalCheck = await client.query(`
      SELECT u.correo, u.nombre_completo, r.nombre as rol_nombre, r.es_admin_sistema
      FROM usuarios u
      JOIN roles_sistema r ON u.rol_id = r.id
      WHERE u.correo = 'sergio.aguilar.granados@gmail.com'
    `);
    console.log('ESTADO FINAL:', finalCheck.rows[0]);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
