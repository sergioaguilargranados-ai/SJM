import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Fallback vacío para que Next.js "Build Time" no truene si Vercel aún no tiene la clave
const sql = neon(process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost/dummy");
export const db = drizzle(sql, { schema });
