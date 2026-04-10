const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('--- SEEDING SYSTEM STRUCTURE ---');

    const modulos = [
      { nombre: 'Dashboard', clave: 'dashboard', icono: 'LayoutDashboard' },
      { nombre: 'Servidores', clave: 'servidores', icono: 'Users' },
      { nombre: 'Retiros y Eventos', clave: 'eventos', icono: 'CalendarDays' },
      { nombre: 'Inscripciones', clave: 'inscripciones', icono: 'ClipboardList' },
      { nombre: 'Equipo por Evento', clave: 'equipo', icono: 'UsersRound' },
      { nombre: 'Finanzas', clave: 'finanzas', icono: 'Receipt' },
      { nombre: 'Documentos', clave: 'documentos', icono: 'FileText' },
      { nombre: 'Evaluaciones', clave: 'evaluaciones', icono: 'Star' },
      { nombre: 'Catálogos', clave: 'catalogos', icono: 'BookOpen' },
      { nombre: 'Configuración', clave: 'configuracion', icono: 'Settings' }
    ];

    for (const m of modulos) {
      // 1. Insertar Módulo
      const resMod = await client.query(
        "INSERT INTO modulos_sistema (nombre, clave, icono) VALUES ($1, $2, $3) ON CONFLICT (clave) DO UPDATE SET nombre = $1 RETURNING id",
        [m.nombre, m.clave, m.icono]
      );
      const modId = resMod.rows[0].id;

      // 2. Insertar Función General del Módulo
      const resFunc = await client.query(
        "INSERT INTO funciones_sistema (modulo_id, nombre, clave) VALUES ($1, $2, $3) ON CONFLICT (clave) DO UPDATE SET nombre = $2 RETURNING id",
        [modId, `Gestión de ${m.nombre}`, m.clave]
      );
      const funcId = resFunc.rows[0].id;

      // 3. Insertar Acciones Estándar
      const acciones = ['view', 'create', 'edit', 'delete'];
      for (const a of acciones) {
        await client.query(
          "INSERT INTO acciones_sistema (funcion_id, nombre, clave) VALUES ($1, $2, $3)",
          [funcId, a.charAt(0).toUpperCase() + a.slice(1), a]
        );
      }
    }

    console.log('✅ Estructura de sistema poblada exitosamente.');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
