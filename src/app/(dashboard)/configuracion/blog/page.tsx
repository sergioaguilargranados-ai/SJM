import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { articulos_blog } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import BlogAdminClientView from "./BlogAdminClientView";

export default async function BlogAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const orgId = session.user.organizacion_id;
  if (!orgId) redirect("/dashboard");

  const articulos = await db.select().from(articulos_blog).where(eq(articulos_blog.organizacion_id, orgId)).orderBy(desc(articulos_blog.creado_en));

  return <BlogAdminClientView articulos={articulos} organizacionId={orgId} />;
}
