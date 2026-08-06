# AG-sesion-260805-tarjeta-usuarios-movil

## Resumen de Sesión - 5 de Agosto de 2026

**Objetivo Principal:**
Mejorar la experiencia de usuario (UX) y usabilidad táctil del módulo de Usuarios en dispositivos móviles (PWA), permitiendo que la tarjeta completa sea clickable/tappable y solucionando el problema de la visibilidad de los botones de acción que solo aparecían al hacer hover en escritorio.

**Tareas Realizadas:**
- **Módulo de Usuarios (UsuariosClient.tsx):**
  - Se añadió la clase `cursor-pointer` y el evento `onClick` a nivel de tarjeta del usuario. Al hacer clic/tap en cualquier parte de la tarjeta, ahora se abre el modal para gestionar el rol del usuario de forma inmediata.
  - Se agregó `e.stopPropagation()` a los manejadores de los botones internos ("Gestionar" y "Eliminar") para prevenir la propagación de eventos y comportamientos erráticos (como abrir el modal del rol al presionar eliminar).
  - Se modificó la visibilidad de los botones en móviles: ahora la clase de opacidad es `opacity-100 md:opacity-0 md:group-hover:opacity-100`, lo que garantiza que los botones sean 100% visibles y utilizables en pantallas táctiles, mientras que en pantallas más grandes (ordenadores) se mantiene el efecto estético de aparecer únicamente al pasar el cursor (hover).
- **Versionamiento:**
  - Se incrementó la versión de SJM Core Engine a **v1.203**.
  - Se actualizaron las referencias de versión y hora de compilación en `AppFooter.tsx`, `src/app/page.tsx` (landing), `src/app/login/page.tsx` (login) e `AG-Historico-Cambios.md`.

**Próximos Pasos (si aplica):**
- Probar el comportamiento de las tarjetas en un simulador de móvil o teléfono celular con la PWA instalada, asegurando que se pueda presionar cómodamente cualquier tarjeta para abrir el modal y que los botones de acción no tengan doble activación.
