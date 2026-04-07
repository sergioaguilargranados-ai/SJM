<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🎯 SJM Platform — Referencia Rápida para Agentes AI

## Información del Proyecto
- **Nombre:** Plataforma SJM — "Servidores de Jesús por María"
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Drizzle ORM, Neon PostgreSQL
- **Directorio:** `c:\SJM\sjm-platform`
- **Auth:** NextAuth v5 (Google OAuth)
- **Almacenamiento:** Cloudflare R2 (S3-compatible)

## Idioma (¡CRÍTICO!)
- **TODO en español:** Comunicación, código (variables de negocio), DB (tablas/columnas), comentarios
- **Excepción:** Keywords de lenguaje (import, export, function)

## Git
- **Remote:** `origin` → `https://github.com/sergioaguilargranados-ai/SJM.git`
- **Branch:** `main`
- **Deploy:** Vercel (auto-deploy desde push)

## Base de Datos
- **Proveedor:** Neon PostgreSQL (URL en `.env.local`)
- **ORM:** Drizzle ORM (`src/lib/schema.ts`)
- **Convención:** snake_case español, UUID para IDs, `organizacion_id` en toda tabla principal

## Tema Claro/Oscuro (¡MANDATORIO!)
- **Mecanismo:** `next-themes` con `attribute="class"` (clase `dark` en `<html>`)
- **CSS:** Usar `.dark` selector, NUNCA `@media (prefers-color-scheme: dark)`
- **Colores dark estándar:** `bg-[#0f1015]`, `bg-[#1a1b26]`, `border-[#2a2b3d]`, `text-[#8e8ea0]`
- **REGLA:** Todo componente nuevo DEBE incluir variantes `dark:` de Tailwind

## Patrones de UI
- **Modales:** Nunca se cierran con backdrop click. Solo con botón "Cancelar" o éxito.
- **Tablas:** Usar componente `TablaConsulta` para consultas con filtros + PDF + Excel.
- **Formularios:** React Hook Form + Zod para validación.
- **Exportación:** Todo catálogo debe soportar Excel (.xlsx) y PDF.

## Versionamiento
- **Formato:** `v1.XXX`
- **Zona horaria:** CST (CDMX)
- **Archivos:** Ver workflow `/version`

## Workflows Disponibles
- `/build` — Compilar y verificar
- `/version` — Actualizar versión en todos los archivos  
- `/deploy` — Commit y push a GitHub/Vercel
- `/database` — Migraciones y esquema con Drizzle

## Checklist Pre-Commit
1. ☐ Build pasa sin errores (`npm run build`)
2. ☐ Versión actualizada en 4 archivos
3. ☐ Dark mode funciona en componentes nuevos/modificados
4. ☐ No hay credenciales en archivos de código
5. ☐ Histórico de cambios actualizado
