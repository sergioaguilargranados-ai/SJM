# 🎯 AG-Contexto-Proyecto - Plataforma SJM

**Última actualización:** 04 de Abril de 2026 - 17:54 CST  
**Versión actual:** v1.000  
**Actualizado por:** AntiGravity AI Assistant  
**Propósito:** Documento maestro del proyecto para trabajo con agentes AntiGravity. Establece las bases, reglas y estándares técnicos para el desarrollo del sistema integral de SJM.

---

## 📌 INFORMACIÓN DEL PROYECTO

### Nombre del Proyecto
**Plataforma SJM - "Servidores de Jesús por María"**

### Objetivo General
Sistema integral SaaS Multi-Organización para gestión de un movimiento católico con alcance nacional/internacional. Contará con sitio web público (Landing Page, Blog, Tienda, Donativos) y una intranet/portal de control (Servidores, Eventos, Finanzas, Documentos) con accesos granulares por roles.

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

## 🏗️ ARQUITECTURA MULTI-TENANT Y ROLES

El sistema es Multi-Organización desde su núcleo. Todas las tablas principales estarán unidas lógicamente por `organizacion_id`.  
A nivel de cada organización, los datos se separan por **Sedes**.

**Sistemas de Permisos y Roles:**
- **SuperAdmin:** Gestión global.
- **Administrador de Organización:** Acceso a toda la info de un movimiento (SJM).
- **Operativo de Sede:** Acceso a una sede local.
- **Servidor / Usuario final:** Puede inscribirse, ver su historial en retiros y sus donativos.

---

📋 Siempre leer este contexto antes de tomar decisiones sobre el modelo de datos y reglas de desarrollo.
