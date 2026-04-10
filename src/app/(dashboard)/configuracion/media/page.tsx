import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { media_contenido } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import MediaAdminClientView from "./MediaAdminClientView";

export default async function MediaAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const orgId = session.user.organizacion_id;
  if (!orgId) redirect("/dashboard");

  const media = await db.select().from(media_contenido).where(eq(media_contenido.organizacion_id, orgId)).orderBy(asc(media_contenido.orden));

  return <MediaAdminClientView media={media} organizacionId={orgId} />;
}
