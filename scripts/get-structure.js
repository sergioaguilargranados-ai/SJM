const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    const modulos = await client.query("SELECT id, nombre, clave FROM modulos_sistema");
    const funciones = await client.query("SELECT id, modulo_id, nombre, clave FROM funciones_sistema");
    const acciones = await client.query("SELECT id, funcion_id, nombre, clave FROM acciones_sistema");
    
    console.log('--- SYSTEM STRUCTURE ---');
    console.log('MODULOS:', JSON.stringify(modulos.rows, null, 2));
    console.log('FUNCIONES:', JSON.stringify(funciones.rows, null, 2));
    console.log('ACCIONES:', JSON.stringify(acciones.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
