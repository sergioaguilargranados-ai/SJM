import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roles_sistema } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(
      sql`UPDATE roles_sistema SET es_admin_sistema = true WHERE nombre ILIKE '%admin%';`
    );
    
    const roles = await db.select().from(roles_sistema);
    
    return NextResponse.json({ ok: true, message: "Roles actualizados correctamente", roles });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message });
  }
}
