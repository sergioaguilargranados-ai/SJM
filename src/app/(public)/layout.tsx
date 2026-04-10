import { CenefaNavbar } from "@/components/landing/CenefaNavbar";
import { FooterPublico } from "@/components/landing/FooterPublico";
import { resolverTenant } from "@/lib/tenant";

// ============================================================
// LayoutPaginaPublica — Layout compartido para TODAS las páginas
// públicas de la landing. Incluye cenefa 70% + footer degradado.
// Resuelve el tenant para pasar logo y nombre dinámico.
// ============================================================

interface LayoutPaginaPublicaProps {
  children: React.ReactNode;
}

export default async function LayoutPaginaPublica({ children }: LayoutPaginaPublicaProps) {
  const tenant = await resolverTenant();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f1015] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <CenefaNavbar
        transparencia={70}
        logoUrl={tenant?.logo_url || "/logo-sjm-oficial.png"}
        nombreOrg={tenant?.nombre || "SJM Nacional"}
        lemaOrg={tenant?.lema || "Servidores de Jesús por María"}
      />
      <main className="flex-1">
        {children}
      </main>
      <FooterPublico
        organizacion={tenant?.nombre || "Servidores de Jesús por María"}
        correo={tenant?.correo_contacto || "sisepuede@serjema.com"}
        telefono={tenant?.telefono_contacto || undefined}
        facebook_url={tenant?.facebook_url || undefined}
        instagram_url={tenant?.instagram_url || undefined}
        youtube_url={tenant?.youtube_url || undefined}
        logoUrl={tenant?.logo_url || "/logo-sjm-oficial.png"}
      />
    </div>
  );
}
