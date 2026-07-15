import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const logs = [];
    logs.push("Iniciando migración para agregar modalidad_evento a eventos...");
    
    // Add column if it doesn't exist
    await db.execute(sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS modalidad_evento VARCHAR(50) DEFAULT 'PRESENCIAL';`);
    logs.push("Migración completada exitosamente.");
    
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
