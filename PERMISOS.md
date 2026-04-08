# 🛡️ Estándar Maestro de Permisos y Acceso Granular (v1.090)

Este documento define la arquitectura **MANDATORIA** para el desarrollo y mantenimiento de funciones dentro de la plataforma SJM. Ninguna funcionalidad nueva puede ser implementada sin adherirse a estas capas de seguridad.

## 🧱 Jerarquía de Control
El sistema se rige por un filtrado de tres capas en cascada:

1. **Capa 1: Plan de Contratación (SaaS)**
   - Definido en la tabla `planes` (`landing`, `admin`, `premium`).
   - Controla el acceso a nivel **Módulo**. (Ej: Si el plan es Landing, el módulo de Finanzas es físicamente inaccesible).
   - *Validación:* `validarAccesoPlan(modulo_clave)`.

2. **Capa 2: Rol del Usuario (RBAC)**
   - Definido en las tablas `roles_sistema` y `rol_permisos`.
   - Controla el acceso a nivel **Acción** dentro de una función.
   - Acciones estándar: `view`, `create`, `edit`, `delete`, `export`.
   - *Validación:* `getPermisosUsuario()`.

3. **Capa 3: Aislamiento de Datos (Multi-tenancy)**
   - Todo registro en la base de datos **DEBE** contener una columna `organizacion_id`.
   - Las consultas filtran estrictamente por el `orgId` de la sesión del usuario.

## 🛠️ Protocolo de Desarrollo para Nuevas Funciones

Si vas a crear una nueva pantalla o acción (ej: "Módulo de Inventarios"):

1. **Registro en Catálogo:**
   - Crear el módulo en la tabla `modulos_sistema`.
   - Crear las funciones en `funciones_sistema`.
   - Definir las acciones en `acciones_sistema`.

2. **Asignación a Planes:**
   - Determinar a qué planes de contratación pertenece este nuevo módulo en la lógica de `validarAccesoPlan`.

3. **Protección de Ruta (Server Side):**
   - En la página principal (`page.tsx`), invocar: 
     ```typescript
     const { orgId } = await validarAccesoPlan("clave-modulo");
     ```

4. **Protección de Interfaz (Client Side):**
   - En el Sidebar, añadir la clave del módulo para que el filtrado por permisos oculte/muestre el botón automáticamente.

---
**Nota:** El rol de **Admin Sistema** (Super Administrador) posee un comodín de acceso total (`*`), pero aun así debe pasar por las funciones de validación para mantener la integridad del código.
