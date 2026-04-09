const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkUsers() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, nombre_completo, correo, rol_id FROM usuarios');
    console.log("Usuarios en DB:");
    console.table(res.rows);
    
    const orgs = await client.query('SELECT id, nombre FROM organizaciones');
    console.log("\nOrganizaciones en DB:");
    console.table(orgs.rows);

    const roles = await client.query('SELECT id, nombre FROM roles_sistema');
    console.log("\nRoles en DB:");
    console.table(roles.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkUsers();
