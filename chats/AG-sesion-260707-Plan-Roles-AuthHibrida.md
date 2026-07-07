# 📝 Sesión de Trabajo - Plataforma SJM
**Fecha:** 07 de Julio de 2026
**Tema:** Correcciones RENASE, Plan de Roles Multi-Tenant y Autenticación Híbrida
**Agente Responsable:** AntiGravity AI Assistant

---

## 1. 🐛 Correcciones Realizadas Hoy (Completadas)
- **Corrección de "Gafete":** Se actualizó `registrarRenaseAction` y la consulta de la tabla operativa (`AsistentesEventoClientView`). Ahora el gafete guardado en `solicitudes_inscripcion` tiene prioridad y además se sincroniza automáticamente con el campo `nombre_gafete` de la tabla `servidores` maestro.
- **Flujo Directo de Edición (Bypass):** Se implementó un enlace con `editId` y `returnTo` en el botón "Lápiz" de la tabla de asistentes. Esto omite el paso de contraseña, carga automáticamente todos los datos del usuario en el paso "CAPTURA", y al finalizar retorna al usuario a la tabla de la Intranet.

---

## 2. 🏗️ Plan Aprobado: Roles, Multi-Tenant y Autenticación (PENDIENTE)

Se analizó la estructura actual y se acordó el siguiente plan a desarrollar en las próximas sesiones. **El siguiente agente de IA debe continuar ejecutando estas tareas secuencialmente.**

### [x] Fase 1: Gestor Global de Módulos (SuperAdmin)
- [x] Crear la interfaz en `/configuracion/modulos` (solo visible si `es_admin_sistema` es true).
- [x] Permitir listar, crear, editar y eliminar registros en `modulos_sistema` y `funciones_sistema`.
- [x] Construir la lógica para asignar (vincular) módulos a `planes` específicos (actualizar `plan_permisos`).

### [x] Fase 2: Filtrado Granular para el Admin de Marca
- [x] Modificar `getEstructuraPermisos()` en `src/app/actions/permisos.ts`.
- [x] Recibir el `plan_id` de la organización del usuario actual.
- [x] Retornar **solamente** los módulos permitidos para ese plan (basado en `plan_permisos`), para que en `PermisosClient.tsx` no se puedan asignar permisos no pagados/no correspondientes.

### [x] Fase 3: Corrección de Sesión y Sidebar Dinámico
- [x] Inyectar el arreglo comodín `permisos: ["*"]` en la sesión de NextAuth o middleware si el usuario tiene `roles_sistema.es_admin_sistema = true`.
- [x] Refactorizar `AppSidebar.tsx` para eliminar la validación quemada de planes (ej. `planes: ["admin"]`) y hacer que la visibilidad dependa 100% de la validación del arreglo de `permisos` del usuario.

### [x] Fase 4: Nuevos Perfiles (Servidor y Usuario) en Intranet
- [x] Crear el registro en BD de los módulos `mi_perfil` y `mis_compras`.
- [x] Al registrarse en RENASE, asignar automáticamente un rol "Servidor" con permiso `mi_perfil.view`.
- [x] Al registrarse en Tienda, asignar rol "Usuario Tienda" con permiso `mis_compras.view`.
- [x] Modificar el flujo post-login: Si el usuario no tiene permisos operativos (no tiene `dashboard.view`), redirigirlo a `/mi-perfil` o `/mis-compras`.

### [x] Fase 5: Autenticación Híbrida (Celular o Correo)
- [x] **Base de Datos (`schema.ts`):** Permitir que `usuarios.correo` pueda ser nulo si el usuario se registra con `celular`.
- [x] **Login UI (`src/app/login/page.tsx`):** Cambiar el campo "Email" para que acepte "Correo o Celular" y validar con regex si es un email (contiene `@`) o es un número a 10 dígitos.
- [x] **Server Actions / Auth:** Modificar las consultas de `login`/`comparePassword` para buscar al usuario usando un `WHERE correo = ? OR celular = ?`.
- [x] **Soporte Google Auth:** Mantener Google Auth funcional para quienes tengan Gmail; añadir un botón en "Mi Perfil" para que los registrados con Celular puedan vincular su cuenta de Google en un futuro.

---

## 3. 🚀 Instrucciones para el Próximo Agente
1. Revisa este documento de sesión en su totalidad para absorber el contexto.
2. Lee `DOCS/AG-Contexto-Proyecto.md` si necesitas conocer los colores, el versionamiento y la arquitectura multi-tenant base.
3. El proyecto actualmente se encuentra en la versión **v1.197**. Todos los módulos base de autenticación híbrida, tienda (historial) y perfil están funcionales.

---

### ✅ Cierre de Sesión (07 Julio 2026)
- Se ejecutó el plan en su totalidad (Fases 1 a 7).
- Se subió la versión del proyecto a la **v1.197**.
- Queda pendiente para las siguientes fases:
  - Generación de PDF real para "Descargar Recibo" en Mis Compras.
  - Funcionalidad real de carrito para el botón "Volver a comprar".
