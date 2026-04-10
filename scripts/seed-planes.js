const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('--- SEEDING PLANES ---');

    const planes = [
      { id: '16616056-b088-4444-9999-000000000001', nombre: 'Landing', clave: 'landing', descripcion: 'Solo presencia web y registro básico.' },
      { id: '16616056-b088-4444-9999-000000000002', nombre: 'Admin', clave: 'admin', descripcion: 'Control operativo de servidores y eventos.' },
      { id: '16616056-b088-4444-9999-000000000003', nombre: 'Premium', clave: 'premium', descripcion: 'Control total incluyendo Finanzas y Documentos.' }
    ];

    for (const p of planes) {
      await client.query(
        "INSERT INTO planes (id, nombre, clave, descripcion) VALUES ($1, $2, $3, $4) ON CONFLICT (clave) DO UPDATE SET nombre = $2",
        [p.id, p.nombre, p.clave, p.descripcion]
      );
    }
    console.log('✅ Planes creados.');

    // 2. Vincular SJM Nacional al plan Premium
    const sjmOrgId = '6fb191cc-a477-4632-9cb1-c30c33a9f9bd';
    const premiumId = '16616056-b088-4444-9999-000000000003';
    
    await client.query(
      "UPDATE organizaciones SET plan_id = $1 WHERE id = $2",
      [premiumId, sjmOrgId]
    );
    console.log('✅ SJM Nacional vinculado a Plan PREMIUM.');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
