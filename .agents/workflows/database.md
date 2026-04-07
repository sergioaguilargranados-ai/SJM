---
description: Gestión de base de datos SJM con Drizzle ORM y Neon PostgreSQL
---

# Database - Migraciones y Esquema

## Información de Conexión
- **Proveedor:** Neon PostgreSQL (Serverless)
- **URL:** Definida en `.env.local` como `DATABASE_URL`
- **ORM:** Drizzle ORM v0.45+
- **Esquema:** `src/lib/schema.ts`
- **Config:** `drizzle.config.ts`
- **Migraciones:** `drizzle/` (directorio de archivos SQL generados)
- **Directorio de trabajo:** `c:\SJM\sjm-platform`

## Comandos Principales

### Generar migración SQL (sin ejecutar)
```
npx drizzle-kit generate
```
Genera archivos `.sql` en `drizzle/` basándose en cambios detectados en `schema.ts`.

### Empujar esquema directamente a la BD (desarrollo)
```
npx drizzle-kit push
```
⚠️ Aplica cambios directamente a la BD sin generar archivos de migración. Usar solo en desarrollo.

### Visualizar esquema en Drizzle Studio
```
npx drizzle-kit studio
```
Abre una interfaz web para explorar tablas y datos.

## Flujo de Trabajo para Cambios en DB

1. **Modificar** `src/lib/schema.ts` con los nuevos campos/tablas
2. **Generar** migración: `npx drizzle-kit generate`
3. **Revisar** el SQL generado en `drizzle/`
4. **Empujar** a Neon: `npx drizzle-kit push`
5. **Verificar** con Drizzle Studio o query directa

## Convenciones de Nombres (ESPAÑOL OBLIGATORIO)
- Tablas: snake_case plural (`organizaciones`, `solicitudes_inscripcion`)
- Columnas: snake_case singular (`nombre_completo`, `fecha_inicio`)
- IDs: siempre `uuid` con `defaultRandom()`
- Timestamps: `timestamp("creado_en").defaultNow()`
- Booleans: `boolean("estatus").default(true)`
- Multi-tenant: TODA tabla principal debe tener `organizacion_id` como FK

## Tablas Actuales (17)
| Tabla | Propósito |
|---|---|
| `organizaciones` | Core multi-tenant, branding |
| `sedes` | Ubicaciones por organización |
| `roles_sistema` | SuperAdmin, Admin, Operativo, Servidor |
| `usuarios` | Usuarios autenticados |
| `estados_republica` | Catálogo geográfico |
| `ministerios` | Catálogo por organización |
| `cargos` | Catálogo de cargos |
| `servidores` | Padrón de servidores |
| `tipos_eventos` | Catálogo por organización |
| `casas_retiro` | Catálogo de venues |
| `eventos` | Retiros y actividades |
| `solicitudes_inscripcion` | Registro público |
| `equipo_evento` | Asignación de servidores |
| `clasificaciones_gasto` | Catálogo financiero |
| `gastos_evento` | Registro de gastos |
| `documentos_institucionales` | Gestor documental |
| `evaluaciones_evento` | Feedback post-evento |

## Seed Data
- Script: `src/lib/seed.ts`
- Ejecutar con: `npx tsx src/lib/seed.ts`
