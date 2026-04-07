# 📄 Documentación de Transferencia SJM Platform (Fase 3 - Operación Core)

Este documento sirve como bitácora técnica y guía de continuidad para el desarrollo de la plataforma SJM. Cubre los hitos alcanzados durante la estabilización del módulo de inscripciones y gestión de eventos.

---

## 🚀 1. Estado del Proyecto (v1.026)
- **Versión Actual:** `v1.026 - Master Production` (Hardcoded en `AppFooter.tsx`).
- **Estado:** 🟢 Operativo (Registro de usuarios y gestión de eventos funcionales).
- **Entorno:** 
  - **Framework:** Next.js 15 (App Router).
  - **BD:** Neon PostgreSQL via Drizzle ORM.
  - **Hosting:** Vercel (Repositorio: `https://github.com/sergioaguilargranados-ai/SJM.git`).

---

## 🛠 2. Bitácora de Cambios (Control de Versiones)

### [v1.026] - 05/04/2026 - Entrega Fase 3 (Actual)
- **Panel de Control de Eventos:** Implementada la página `(dashboard)/eventos/[eventoId]` con visualización en tiempo real de inscritos.
- **Soporte Legacy:** Habilitado el link `/diplomado/registro/1` mediante un mapeo inteligente en el backend que traduce el ID "1" al diplomado más reciente.
- **Next.js 15 Fix:** Actualizados todos los puntos de entrada dinámicos (`params`) para usar `await` asíncrono, eliminando errores de "ID no encontrado".
- **Ajuste Legal:** Sustitución global de la etiqueta "Costo Público" por **"Aportación Sugerida"** en catálogos y formularios.
- **Auto-Seed:** Inyección forzada del tipo de evento *"Diplomados y Talleres on-line"* al cargar la lista de tipos si no se encuentra.

---

## 💾 3. Esquema de Base de Datos (Claves)
Los campos críticos añadidos o modificados:
- `eventos.costo_publico` -> Se muestra como **Aportación Sugerida**.
- `solicitudes_inscripcion` -> Ahora captura `pais_ciudad` y `ministerio_actual` para perfiles de diplomado.
- `tipos_eventos` -> Categorizado para diferenciar retiros matrimoniales de diplomados académicos.

---

## 🚧 4. Próximos Pasos (Fase 3 - Continuación)

> [!IMPORTANT]
> El siguiente agente debe priorizar estos 3 puntos:

1.  **Módulo de Gastos (Finanzas):** Implementar la carga masiva de facturas/recibos y la visualización de margen de rentabilidad por evento. Actualmente, el 404 en consola es por falta de esta ruta.
2.  **Gestión Documental:** Conectar los campos de Cloudflare R2 para que los usuarios puedan descargar su "Carta de Confirmación" o materiales del diplomado tras registrarse.
3.  **Refactor de IDs Legacy:** Una vez termine la campaña del diplomado actual, se recomienda migrar todos los links a UUIDs reales para mayor seguridad.

---

## ⚡ Notas para el Siguiente Agente
- **Variables de Env:** Mantener `NEXT_PUBLIC_APP_URL` actualizado para que los links de copia en el Panel de Control funcionen bien.
- **Drizzle / Neon:** Siempre realizar `npx drizzle-kit push` si el usuario solicita cambios en el archivo `schema.ts`.
- **Estándar de Lenguaje:** Mantener estrictamente el español tanto en UI como en nombres de columnas de base de datos.

---
**Firmado:** Antigravity AI (Lead Dev)
**Ubicación de Referencia:** `C:\SJM\docs\AG-Esquema-DB-260404.md`
