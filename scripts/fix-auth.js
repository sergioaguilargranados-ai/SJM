const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const ORG_ID = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd"; // ID Nacional del seed

async function fix() {
  try {
    await client.connect();
    console.log("🚀 Iniciando reparación de autenticación v2...");

    // 1. Asegurar Organización
    await client.query(`
      INSERT INTO organizaciones (id, nombre, lema)
      VALUES ($1, 'SJM Nacional', 'Para mayor gloria de Dios')
      ON CONFLICT (id) DO NOTHING
    `, [ORG_ID]);
    console.log("✅ Organización Nacional verificada.");

    // 2. Asegurar Roles (Sin creado_en)
    await client.query(`
      INSERT INTO roles_sistema (organizacion_id, nombre, es_admin_sistema)
      VALUES 
        ($1, 'Super Administrador', true),
        ($1, 'Administrador', false),
        ($1, 'Coordinador', false)
      ON CONFLICT DO NOTHING
    `, [ORG_ID]);
    
    // Obtener el ID del SuperAdmin
    const rolesCurrent = await client.query("SELECT id FROM roles_sistema WHERE nombre = 'Super Administrador' LIMIT 1");
    if (rolesCurrent.rows.length === 0) throw new Error("No se pudo crear el rol de Super Administrador");
    const superAdminRoleId = rolesCurrent.rows[0].id;
    console.log(`✅ Roles verificados. SuperAdmin Role ID: ${superAdminRoleId}`);

    // 3. Crear Usuarios Administradores (Aquí sí hay creado_en según schema.ts)
    const adminEmails = [
      'sergioaguilargranados@gmail.com',
      'sisepuede@serjema.com',
      'aguilargranados@gmail.com'
    ];

    for (const email of adminEmails) {
      await client.query(`
        INSERT INTO usuarios (organizacion_id, rol_id, nombre_completo, correo)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (correo) DO UPDATE SET rol_id = $2
      `, [ORG_ID, superAdminRoleId, 'Sergio Aguilar', email]);
      console.log(`👤 Usuario autorizado: ${email}`);
    }

    console.log("\n✨ ¡Reparación completada! Sergio debería poder entrar ahora.");

  } catch (err) {
    console.error("❌ Error en reparación:", err);
  } finally {
    await client.end();
  }
}

fix();
