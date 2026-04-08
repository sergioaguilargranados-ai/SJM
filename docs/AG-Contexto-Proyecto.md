# 🎯 AG-Contexto-Proyecto - Plataforma SJM

**Última actualización:** 08 de Abril de 2026 - 16:55 CST  
**Versión actual:** v1.090  
**Actualizado por:** AntiGravity AI Assistant  
**Propósito:** Documento maestro del proyecto. Establece las bases, reglas y estándares técnicos para el desarrollo integral de SJM.

---

## 🏗️ ARQUITECTURA DE ACCESOS Y SEGURIDAD (MANDATORIO)

Desde la versión **v1.090**, el sistema implementa un **Triple Filtro de Seguridad** obligatorio:

1. **Capa de Negocio (SaaS - Planes):** `validarAccesoPlan("modulo")` para filtrar funciones por nivel de suscripción.
2. **Capa Operativa (RBAC - Roles):** `getPermisosUsuario()` para filtrar el Sidebar y Server Actions por rol.
3. **Capa de Datos (Multi-tenancy):** Filtrado obligatorio por `organizacion_id` en todas las tablas.

---

## 📌 INFORMACIÓN DEL PROYECTO

### Nombre del Proyecto
**Plataforma SJM - "Servidores de Jesús por María"**

### Objetivo General
Sistema integral SaaS Multi-Organización (Marca Blanca) con portal público y de administración nacional, con control de acceso por planes y roles granulares.

### Repositorios y Despliegue
- **Dominio actual:** www.serjema.com.mx (migrando a serjema.com)
- **Repositorio Git:** GitHub (por inicializar)
- **Hosting de App:** Vercel

---

## 🛠️ STACK TECNOLÓGICO

- **Frontend:** Next.js 15 (App Router), React, TypeScript.
- **Estilos:** Tailwind CSS + shadcn/ui. (Diseño limpio, serio y moderno, tonos azules/blancos, soporte Modo Claro/Oscuro).
- **Backend / API:** Next.js API Routes (Serverless).
- **Base de Datos:** PostgreSQL alojada en NEON.
- **ORM:** Prisma o Drizzle ORM.
- **Autenticación:** Auth.js (NextAuth) con Google, Email Magic Links o Celular.
- **Almacenamiento de Archivos:** Cloudflare R2 (compatible con S3 API) para gestor documental y fotos/comprobantes.

---

## 🇪🇸 ESTÁNDARES DE IDIOMA Y CÓDIGO (¡CRÍTICO!)

### 1. Español en Todos los Niveles
Al igual que en otros proyectos (ej. AS Operadora), **se exige el uso del idioma ES español** en todo sentido:
- **Comunicación de Agentes AI:** 100% en español. Todas las explicaciones, razonamientos y reportes.
- **Base de Datos:** Nombres de tablas, columnas, relaciones y constraints **estrictamente en ESPAÑOL** (ej: `usuarios`, `solicitudes`, `retiros`, `aportaciones`, `sedes`).
- **Código:** Nombres de variables de negocio, funciones del dominio SJM y los **comentarios del código** deben estar en español.

### 2. Diseño de Interfaces Visuales y UX
- **Modals:** Todas las interfaces de captura/alta o edición se deben manejar mediante **Modales**.
- **Persistencia de Modales:** Los modales no deben cerrarse al hacer clic afuera (backdrop click cerrado) para evitar pérdida de datos. Solo se cierran con el botón "Cancelar" estricto o al completar exitosamente.
- **Importaciones/Exportaciones:** Todo catálogo en la plataforma requerirá soporte de carga masiva por Excel (`.xlsx`, `.csv`) y salida en PDF/Excel.

---

## 🔢 SISTEMA DE VERSIONAMIENTO (Igual que AS Operadora)

- **Versiones:** Formato `v1.XXX` para iniciar.
- **Zona Horaria:** Toda modificación documentada se anota en huso horario **CST (CDMX)**.
- **Documentación:** Todo trabajo queda registrado en `AG-Historico-Cambios.md` (en la misma carpeta `docs/`).
- **Documentación de sesiones:** Todo documento importante, reporte o guía generado por el asistente debe llevar el prefijo **AG-** (AntiGravity) al inicio para estandarización: `AG-[tema]-v1.XXX.md`.

---

## 🏗️ ARQUITECTURA MULTI-TENANT, MARCA BLANCA Y ROLES Granulares

El sistema es Multi-Organización desde su núcleo. Todas las tablas principales estarán unidas lógicamente por `organizacion_id`.  
A nivel de cada organización, los datos se separan por **Sedes**.

**Sistemas de Permisos y Roles:**
- **SuperAdmin:** Gestión global.
- **Administrador de Organización:** Acceso a toda la info de un movimiento (SJM).
- **Operativo de Sede:** Acceso a una sede local.
- **Servidor / Usuario final:** Puede inscribirse, ver su historial en retiros y sus donativos.

---

## 🔧 HERRAMIENTAS DE DESARROLLO Y WORKFLOWS

### Workflows Automatizados
Los siguientes workflows están disponibles en `.agents/workflows/` para ejecutar procesos recurrentes:

| Workflow | Comando | Descripción |
|---|---|---|
| `/build` | `npm run build` | Compilar y verificar TypeScript |
| `/version` | Manual (4 archivos) | Actualizar versión en código y docs |
| `/deploy` | `git push origin main` | Commit + Push → Vercel auto-deploy |
| `/database` | `npx drizzle-kit push` | Migraciones de esquema a Neon |

### Repositorio Git
- **Remote:** `origin` → `https://github.com/sergioaguilargranados-ai/SJM.git`
- **Branch:** `main`
- **Usuario:** `sergioaguilargranados-ai`
- **Deploy:** Vercel (auto-deploy desde push a main)

### Archivos de Versión (TODOS deben actualizarse)
1. `docs/AG-Historico-Cambios.md` — Entrada nueva al inicio
2. `src/app/layout.tsx` — Footer `Build: vX.XXX`
3. `src/app/page.tsx` — Footer `Plataforma SJM vX.XXX`
4. `src/app/login/page.tsx` — Footer `© 2026 Admin SJM Nacional vX.XXX`

---

## 🌓 ESTÁNDAR DE TEMA CLARO/OSCURO (¡MANDATORIO!)

### Mecanismo
- **Librería:** `next-themes` con `attribute="class"`
- **Cómo funciona:** Agrega/remueve clase `dark` en `<html>`
- **Toggle:** Botón Sol/Luna en `TopbarClient.tsx`

### Reglas de CSS
- ✅ SIEMPRE usar el prefix `dark:` de Tailwind para variantes oscuras
- ❌ NUNCA usar `@media (prefers-color-scheme: dark)` en CSS
- ✅ Usar `.dark` como selector si se necesitan variables CSS

### Paleta Dark Mode Estándar
| Token | Color | Uso |
|---|---|---|
| `bg-[#0f1015]` | Negro profundo | Background principal |
| `bg-[#1a1b26]` | Gris oscuro | Cards, sidebar, modals |
| `bg-[#151621]` | Gris medio | Secciones alternas |
| `border-[#2a2b3d]` | Gris borde | Bordes y separadores |
| `text-white` | Blanco | Títulos principales |
| `text-slate-400` | Gris texto | Texto secundario |
| `text-[#8e8ea0]` | Gris sutil | Texto terciario, hints |
| `text-[#5e5e72]` | Gris muy sutil | Labels, section headers |

### Checklist de Dark Mode para CADA componente
- ☐ Background tiene variantes `dark:bg-*`
- ☐ Textos tienen variantes `dark:text-*`
- ☐ Bordes tienen variantes `dark:border-*`
- ☐ Hover states tienen variantes `dark:hover:*`
- ☐ Focus rings tienen variantes `dark:focus:*`
- ☐ Inputs/selects son legibles en oscuro

---

📋 Siempre leer este contexto antes de tomar decisiones sobre el modelo de datos y reglas de desarrollo.
