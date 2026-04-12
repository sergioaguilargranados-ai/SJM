# 📜 Histórico de SJM PLATFORM • v1.166

**Última actualización:** 11 de Abril de 2026 - 21:10 CST
**Responsable:** AntiGravity AI Assistant

---

### v1.166 - 11 de Abril de 2026 - 21:10 CST

#### 🎨 Alineación Visual Intranet y Landing
- **Topbar Client (Intranet):** Se reestructuró la zona del logo para utilizar los mismos parámetros y formato visual que la `CenefaNavbar` (Landing Page).
- **Perfil de Usuario:** El componente de usuario en la Intranet ahora muestra la inicial/avatar alineada a la izquierda, seguida del primer nombre y con el **rol debajo** del nombre, imitando el estilo exacto que se diseñó para la landing, brindando completa paridad visual.
- **Aclaración Color Menú Vertical:** El AppSidebar actualmente usa dinámicamente `tenant.color_primario`. Si el color de selección está en azul, significa que en el módulo *Configuración*, la Organización de SJM tiene asignado este color. El código permanece adaptativo hacia este valor en caso de que se actualice la configuración institucional.
- **Versión Sincronizada:** v1.166 en footers y documentación.

---

### v1.165 - 10 de Abril de 2026 - 11:08 CST

#### ✨ Interfaz Premium y Micro-Interacciones
- **Hero Carrusel Animado:** (`HeroCarrusel.tsx`) Carrusel con auto-advance y transiciones fluidas de fundido y escalado, con soporte para imágenes y "shimmer" (brillo animado).
- **Animaciones Globales:** Implementación nativa en `globals.css` para `.btn-glow` (resplandor de botón interactivo) y `.text-gradient-animated` para títulos importantes.
- **Scroll Reveal Experiencial:** (`ScrollReveal.tsx`) Integración inteligente de Intersection Observer para animaciones en pantalla al hacer scroll (`fade-in-up`).
- **Widget de WhatsApp Flotante:** (`WhatsAppWidget.tsx`) Botón flotante pulsante que detecta automáticamente el número de contacto de la Organización (Tenant) para re-dirigir a un chat en vivo.
- **Resolución de Errores Frontend:** Solución de re-renderizado (`Hydration Mismatch`) causados por `next-themes` en Next.js 16.1+, solución al error de Favicon y mitigación de errores de extensiones externas de Chrome.

#### 🔗 Conexión Dinámica — Páginas Públicas al CMS

##### Infraestructura Multi-Tenant
- **`src/lib/tenant.ts`:** Nuevo resolver de tenant que identifica la organización por dominio (`dominio_tenant`) con fallback a la primera organización. Incluye `obtenerOrganizacionPorId()` con join a planes para compatibilidad con TenantData.
- La Landing (`page.tsx`) fue convertida a `SSR` y resuelve todos sus componentes compartiendo propiedades de organización como el logotipo cargado y contactos.

##### Páginas Públicas Conectadas (8 páginas ○ → ƒ)
- **`/` (Landing Page):** Logo central dinámico y cenefas de navegación que reaccionan a los datos del Tenant.
- **`/nosotros`:** Consume `secciones_contenido` (pagina_clave: "nosotros") con fallback a contenido estático pre-llenado.
- **`/testimonios`:** Consume `testimonios` aprobados con calificación, autores y anonimato.
- **`/tienda`:** Consume `productos_tienda` y `categorias_producto` con grid visual, precios, stock bajo y empty state.
- **`/crecimientos`:** Consume `articulos_blog` (blog_clave: "crecimientos") con portada, extracto y fecha de publicación.
- **`/media`:** Consume `media_contenido` con colores por tipo (música/podcast/video), badges de duración y miniaturas.
- **`/retiros-eventos`:** Consume `agenda_retiros` con joins a tipos_eventos y sedes, tarjetas tipo calendario.
- **`/ayuda`:** Consume `preguntas_frecuentes` con expand/collapse y `telefonos_emergencia` dinámicos.

##### Patrón de Diseño
- **Híbrido CMS-Fallback:** Todas las páginas consultan primero la BD; si no hay datos, muestran contenido estático de respaldo (nunca una página vacía).
- **Empty States:** Tienda, Blog, Media y Retiros muestran estados vacíos elegantes con iconos y texto "Próximamente".

---

### v1.160 - 10 de Abril de 2026 - 09:58 CST

#### 🎛️ Admin CMS + Server Actions (Fases 3-7)

##### Server Actions Layer (2 archivos nuevos)
- **`actions/contenido.ts`:** 30+ funciones de lectura/escritura para CMS (parametros_landing, secciones, testimonios, FAQ, teléfonos, responsables, galería, letreros, media, blog, agenda).
- **`actions/tienda.ts`:** 20+ funciones para tienda online (productos, categorías, pedidos con folio auto-incremental, formas de entrega, medios de pago, descuento de stock automático).

##### Módulos Admin Intranet (5 nuevas páginas)
- **`/configuracion/contenido`:** Admin CMS con 6 tabs (Secciones por página, Branding con color pickers, Testimonios con aprobar/rechazar, FAQ, Teléfonos, Equipo directivo).
- **`/configuracion/tienda`:** Admin Tienda con 4 tabs (Productos con grid visual, Categorías, Pedidos con cambio de estatus, Envíos y Medios de Pago).
- **`/configuracion/blog`:** Admin Blog con publicar/despublicar, editor con blog_clave (crecimientos/formación/general), categorías y extractos.
- **`/configuracion/media`:** Admin Multimedia con filtro por tipo, grid visual con miniaturas, CRUD de música/podcasts/videos con URL externo.
- **`/configuracion/agenda`:** Admin Agenda de Retiros con tarjetas tipo calendario, joins a tipos_eventos y sedes, formulario completo de programación.

##### Sidebar Actualizado
- Nueva sección "Sitio Web" en el sidebar con 5 opciones CMS (Contenido, Tienda, Blog, Media, Agenda).

##### Build
- Verificado exitoso con **30 páginas** (25 anteriores + 5 admin nuevas), **0 errores**.

---


### v1.150 - 10 de Abril de 2026 - 04:35 CST

#### 🏗️ Transformación Landing Marca Blanca — Fase 1 & 2

##### Base de Datos (17 tablas nuevas)
- **`parametros_landing`:** Configuración completa del sitio por org (colores con clave, cenefa, footer degradado, carrusel, videos, WhatsApp QR, Google Maps, orden de secciones).
- **`secciones_contenido`:** CMS parametrizado para todas las páginas (título, subtítulo, contenido, autoría, imagen, video, menú tarjeta, liga a función de permisos).
- **`telefonos_emergencia`:** Teléfonos de emergencia y administración con WhatsApp QR.
- **`responsables_organizacion`:** Directivos con foto, cargo, mensaje de saludo.
- **`testimonios`:** Sistema de testimonios parametrizados con soporte anónimo y aprobación.
- **`preguntas_frecuentes`:** FAQ parametrizadas por página.
- **`galeria_fotos`:** Galería de fotos por página para cintas/collages.
- **`letreros_especiales`:** Letreros parametrizados (ELEMA KIDS, ELEMÁ, etc.) con fuente y estilo.
- **`categorias_producto`:** Categorías para tienda online.
- **`productos_tienda`:** Productos con precio, stock, SKU, imágenes.
- **`pedidos_web`:** Pedidos con datos de cliente, financieros, y entrega.
- **`detalle_pedido`:** Líneas de pedido.
- **`formas_entrega`:** Formas de entrega parametrizadas.
- **`textos_medios_pago`:** Instrucciones de medios de pago.
- **`notificaciones_tienda`:** Plantillas de notificación de tienda.
- **`agenda_retiros`:** Calendario de retiros públicos.
- **`articulos_blog`:** Artículos de blog (Crecimientos, Formación).
- **`media_contenido`:** Música, Podcasts, Videos con URLs externas.

##### Componentes Globales
- **`CenefaNavbar`:** Cenefa traslúcida al 70% + navbar integrada con todas las páginas, soporte de sesión, menú móvil.
- **`FooterPublico`:** Footer alto con degradado negro a gris, parametrizado (navegación, recursos, contacto, redes sociales).
- **`ComponentesLanding`:** TarjetaMenuSeccion, SeccionContenido, CarruselImagenes, CintaFotosVertical, LetreroEspecial.
- **Layout `(public)`:** Layout compartido con cenefa + footer para todas las páginas públicas.

##### Página Principal Rediseñada (14 secciones)
- Cenefa 70% sticky, carrusel parametrizable, bienvenida con logo grande, "No estás solo", retiros, matrimonios, jóvenes, mundo infantil, testimonios, tienda, centros, donaciones, ayuda, contacto.

##### 17 Páginas Públicas
- `/nosotros` — 8 secciones completas con contenido pre-llenado de serjema.com.mx
- `/contactanos` — Formulario, tarjetas de contacto, equipo directivo, redes sociales
- `/testimonios` — Testimonios con CTA para agregar (anónimo)
- `/donativos` — Datos bancarios reales, impactos, 3 métodos de pago
- `/jovenes` — ELEMÁ con letrero colorido juvenil
- `/matrimonios` — Plenitud Matrimonial con colores amorosos
- `/sanacion-interior` — Magnificat con cita bíblica
- `/mundo-infantil` — ELEMA KIDS con colores pastel vivos, juegos, trivias, videos
- `/llama-de-amor` — Oración, teléfonos emergencia, placeholder agente IA
- `/centros` — 8 sedes pre-llenadas con links Facebook
- `/retiros-eventos` — Placeholder para agenda interactiva
- `/ayuda` — 3 categorías (Espiritual, Psicológica, Técnica)
- `/tienda` — Placeholder para catálogo (modelo ERPCubox)
- `/media` — Tabs Música/Podcasts/Videos estilo YouTube
- `/crecimientos` — Blog de crecimientos
- `/formacion` — Blog de formación + E-Learning
- `/blog` — Blog migrado con artículos pre-llenados

##### Infraestructura
- **Middleware:** Agregadas 17 rutas públicas nuevas.
- **Migración:** Eliminadas las páginas antiguas `/blog`, `/donativos`, `/tienda` con nav/footer estáticos propios.
- **CSS:** Animaciones de carrusel vertical, fade-in-up, scroll suave global.
- **Build:** Verificado exitosamente (25 páginas, 0 errores).

---

### v1.140 - 10 de Abril de 2026 - 00:55 CST

#### Módulo Completo de Gestión de Accesos (RBAC)
- **Matriz de Permisos:** Nueva interfaz en `/configuracion/permisos` que permite activar/desactivar permisos (Ver, Crear, Editar, Eliminar) por cada módulo del sistema de forma granular.
- **Gestión de Usuarios:** Nuevo módulo en `/configuracion/usuarios` para listar el equipo y asignar roles dinámicamente mediante un diálogo de gestión.
- **Estructura de Sistema (Seed):** Se pobló la base de datos con la jerarquía completa de Módulos (Dashboard, Servidores, Eventos, Finanzas, etc.) para habilitar el control granular.
- **Acciones Flexibles:** Implementación de `upsertRolAction`, `actualizarPermisosRolAction` y `asignarRolUsuarioAction` para una gestión reactiva.
- **UI Components:** Integración de componentes Radix (`Checkbox`, `Select`) estilizados con la identidad visual SJM (#00B4AA).
- **Consistencia:** Actualización de Sidebar para incluir "Equipo y Usuarios" y sincronización de versiones.

---

### v1.125 - 09 de Abril de 2026 - 17:08 CST

#### Integración WhatsApp Twilio
- **whatsappService.ts:** Servicio Twilio con inicialización lazy (mismo patrón que Resend). Soporte para código de país México automático.
- **Bienvenida WhatsApp:** Al registrarse con celular, se envía mensaje de bienvenida por WhatsApp además del email.
- **Recuperación por WhatsApp:** Cuando solicitan recuperación por celular, el enlace se envía tanto por email como por WhatsApp.
- **Mensajes predefinidos:** `mensajeBienvenidaWhatsApp()` y `mensajeRecuperacionWhatsApp()` con formato markdown de WhatsApp.
- **Fix Menú Intranet:** Se corrigió la visibilidad del menú para el tenant principal (SJM), promoviendo al usuario administrador a "Super Administrador" y activando el flag `es_admin_sistema` en los roles de gestión. Esto restaura las opciones de navegación que se ocultaron tras la implementación del sistema RBAC granular.
- **Versión Sincronizada:** v1.125 en Landing, Login, Registro e Intranet.

---

### v1.120 - 09 de Abril de 2026 - 14:50 CST

#### Recuperación de Contraseña Completa
- **Tabla `tokens_recuperacion`:** Nueva tabla para tokens de recuperación con expiración (1 hora) y uso único. Sincronizada con Neon.
- **Página `/recuperar`:** Formulario para solicitar recuperación por correo o celular. Envía email con enlace seguro vía Resend.
- **Página `/recuperar/[token]`:** Formulario para nueva contraseña con validador de fortaleza. 4 estados: validando, inválido, formulario, éxito.
- **Server Actions:** `solicitarRecuperacionAction`, `validarTokenAction`, `restablecerContrasenaAction` — Flujo seguro end-to-end.
- **Seguridad:** No revela si el correo/celular existe (protección contra enumeración). Tokens single-use con bcrypt hash.
- **Link en Login:** El "¿Olvidaste tu contraseña?" ya apunta a `/recuperar`.
- **Versión Sincronizada:** v1.120.

---

### v1.115 - 09 de Abril de 2026 - 14:25 CST

#### Navbar con Sesión, Perfil de Usuario y Email Resend
- **NavbarPublica:** Nuevo componente cliente que muestra avatar y dropdown con opciones cuando el usuario está logueado (Mi Perfil, Dashboard, Cerrar Sesión). Botón "Acceso" cuando no lo está. Menú hamburguesa responsive.
- **AuthProvider:** SessionProvider de NextAuth agregado al layout raíz para soportar `useSession()` en toda la app.
- **Página `/perfil`:** Interfaz premium con avatar, datos personales editables, toggle "Soy Servidor SJM" con selector de sede. Al guardar se actualiza la DB.
- **Server Action `actualizarPerfilAction`:** Backend para actualizar nombre, celular, fecha nacimiento, estatus servidor y sede.
- **Resend Email Service:** `emailService.ts` con inicialización lazy para evitar crash en build. `emailTemplate.ts` con plantilla HTML corporativa SJM.
- **Email de Bienvenida:** Se envía automáticamente al registrarse (Google o credenciales).
- **Middleware:** Ruta `/perfil` protegida, `/recuperar` pública.
- **Versión Sincronizada:** v1.115.

---

### v1.110 - 09 de Abril de 2026 - 13:00 CST

#### Sistema de Autenticación y Registro Completo (Fase 1)
- **Auto-creación con Google:** El callback `signIn` ahora crea automáticamente usuarios nuevos en la DB con rol "General" al acceder con Google. Ya no muestra "Acceso Denegado".
- **Provider de Credenciales:** Nuevo provider `Credentials` en NextAuth para login por correo/contraseña y celular/contraseña con verificación bcrypt.
- **Página `/registro`:** Interfaz Glassmorphism con 3 modos de registro (Google, Correo, Celular). Incluye validador visual de fortaleza de contraseña en tiempo real.
- **Server Action `registrarUsuarioAction`:** Backend de registro con validación, hash bcrypt, detección de duplicados y asignación automática de rol.
- **Rol "General":** Nuevo rol auto-creado para usuarios que se registran por su cuenta, con acceso a portal público, inscripciones y perfil.
- **Esquema DB:** Campos `fecha_nacimiento` y `es_servidor` agregados a tabla `usuarios`. Sincronizado con Neon.
- **Dependencia:** `bcryptjs` instalado para hash de contraseñas.
- **Versión Sincronizada:** v1.110.

---

### v1.102 - 09 de Abril de 2026 - 12:00 CST

#### Build Fix: Static Prerendering
- **auth/error/page.tsx:** Se envolvió el contenido que usa `useSearchParams` en un boundary de `<Suspense />`. Esto es mandatorio en Next.js para permitir la generación estática de páginas que dependen de parámetros de búsqueda del lado del cliente.
- **Versión Sincronizada:** v1.102.

---

### v1.101 - 09 de Abril de 2026 - 11:55 CST

#### Build Fix: Missing Assets
- **AppSidebar.tsx:** Se añadió el import de `ShieldCheck` de `lucide-react` que causaba fallo de compilación.
- **Versión Sincronizada:** v1.101.

---

### v1.100 - 09 de Abril de 2026 - 11:50 CST (Hito 100)

#### Build Fix: Tenant Identity
- **TenantProvider.tsx:** Sincronización de la interfaz `TenantData` con el objeto `TENANT_DEFAULT`. Se añadió la propiedad `plan` requerida para evitar fallos de compilación en Vercel.
- **Hito:** 100 versiones de evolución continua.
- **Versión Sincronizada:** v1.100.

---

### v1.099 - 09 de Abril de 2026 - 11:10 CST

#### Build Fix: TypeScript & UI
- **auth/error/page.tsx:** Eliminación de propiedad `asChild` no compatible con el componente `Button` actual. Se refactorizó la navegación usando envoltorios `Link` estándar.
- **Versión Sincronizada:** v1.099.

---

### v1.098 - 09 de Abril de 2026 - 10:55 CST

#### Build Fix: TypeScript Typings
- **permisos.ts:** Se añadió el retorno explícito de `{ session, orgId, planClave }` en `validarAccesoPlan` para corregir errores de tipado en páginas de consulta.
- **Versión Sincronizada:** v1.098.

---

### v1.097 - 09 de Abril de 2026 - 10:45 CST

#### Build Fix: Syntax Object Close
- **permisos.ts:** Corrección de cierre de objeto `accesos` (falta de `;}`).
- **Versión Sincronizada:** v1.097.

---

### v1.096 - 09 de Abril de 2026 - 10:40 CST

#### Build Fix: Turbopack & Syntax
- **permisos.ts:** Corrección de error de sintaxis (llave de cierre faltante en `validarAccesoPlan`) que impedía la compilación en Vercel.
- **Importaciones:** Se añadieron las tablas de schema faltantes en el módulo de permisos para el RBAC granular.
- **Versión Sincronizada:** v1.096.

---

### v1.095 - 09 de Abril de 2026 - 10:15 CST

#### Fix Crítico Autenticación y Despliegue
- **Página de Error NextAuth:** Creación de `src/app/auth/error/page.tsx` para manejar errores de `AccessDenied` con UI premium, eliminando el error 404.
- **Sincronización Neon:** Ejecución de `drizzle-kit push` para homologar la existencia de `organizacion_id` en `roles_sistema`.
- **Inyección de Administradores:** Ejecución de script de reparación para autorizar correos de Sergio Aguilar as Super Admins.
- **Versión Sincronizada:** Actualización global a v1.095 en footers y documentación.

---

### v1.090 - 08 de Abril de 2026 - 16:55 CST

#### Arquitectura SaaS y Seguridad Granular (¡MANDATORIO!)
- **Triple Filtro de Seguridad:** Implementación de capas de validación en cascada:
  1. **Plan (SaaS):** Validación de módulos permitidos (`landing`, `admin`, `premium`).
  2. **Rol (RBAC):** Filtrado de acciones por permiso (`view`, `create`, `edit`, `delete`, `export`).
  3. **Organización (Multi-tenancy):** Aislamiento estricto de datos por `organizacion_id`.
- **Sidebar Parametrizado:** El menú lateral ahora es 100% dinámico. Oculta/Muestra opciones basado en el Plan de la Org y los Permisos del Rol del usuario simultáneamente.
- **Helper `validarAccesoPlan`:** Función centralizada para proteger Server Components y redirigir al Dashboard si el nivel de suscripción es insuficiente.

#### Interfaz Premium y UX
- **Login v1.080:** Rediseño con estética *Glassmorphism*, estados dinámicos para acceso por Correo/Celular e ícono de Google en SVG puro. Se añadió flujo de registro.
- **Notificaciones Premium:** Sistema `SjmToast` con diseño translúcido (60% transparencia), indicadores de estado circulares y tipografía oficial.
- **Identidad:** Configuración de Favicon oficial y metadatos SEO.

#### Módulos y Persistencia
- **Mantenimiento de Permisos:** Nueva pantalla para gestión de Roles y visualización de planes habilitada en Configuración.
- **Módulos Maestros Activados:** Servidores, Documentos, Sedes, Ministerios y Tipos de Eventos actualizados con seguridad granular y filtrado multi-tenant.
- **Configuración Real:** Migración de la vista de organización de prototipo a Server Action funcional con persistencia en PostgreSQL.

---

### v1.070 - 08 de Abril de 2026 - 12:00 CST
- **Esquema SaaS:** Evolución del modelo de base de datos para soportar Planes -> Módulos -> Funciones -> Acciones.
- **Seed Script:** Actualización del script de semilla para inicializar la jerarquía de permisos nacional.
- **TenantProvider:** Inyección de información del Plan en el contexto del cliente.

---

### v1.060 - 07 de Abril de 2026 - 16:40 CST

#### Herramientas de Desarrollo (Fase 1)
- **Workflows automatizados:** Creación de 4 workflows en `.agents/workflows/`:
  - `/build` — Compilación y verificación TypeScript
  - `/version` — Actualización de versión en 4 archivos (layout, landing, login, histórico)
  - `/deploy` — Commit y push a GitHub con auto-deploy a Vercel
  - `/database` — Migraciones Drizzle ORM a Neon PostgreSQL
- **AGENTS.md actualizado:** Referencia rápida completa del proyecto con credenciales, convenciones, checklist pre-commit y listado de workflows.
- **AG-Contexto-Proyecto.md enriquecido:** Secciones nuevas de Herramientas de Desarrollo y Estándar de Tema Claro/Oscuro.

#### Fix Tema Claro/Oscuro (Fase 4)
- **Bug Crítico resuelto:** El toggle Sol/Luna no funcionaba porque `globals.css` usaba `@media (prefers-color-scheme: dark)` en lugar del selector `.dark` que usa `next-themes`. **Corregido.**
- **Sistema de CSS Variables completo:** 12 variables de diseño (background, foreground, surface, card, muted, accents) con valores para tema claro y oscuro.
- **Componentes UI corregidos:**
  - `button.tsx` — Variantes `outline`, `secondary`, `ghost` y `link` ahora tienen `dark:` classes
  - `label.tsx` — Texto visible en dark mode (`dark:text-slate-200`)
  - `dialog.tsx` — Fondo y bordes explícitos para dark mode (`dark:bg-[#1a1b26]`, `dark:border-[#2a2b3d]`)
- **Paleta Dark Mode documentada:** Tokens estandarizados para que todo componente futuro use los mismos colores.

#### Infraestructura
- **Build:** ✅ TypeScript sin errores, 28 rutas funcionales
- **Versión sincronizada** en layout.tsx, page.tsx, login/page.tsx

---

### v1.055 - 06 de Abril de 2026 - 02:35 CST

#### Multi-Tenant Real (Fase 3)
- **Auth reescrito:** Inyección de `organizacion_id`, `sede_id`, `rol_id`, `nombre_completo` en la sesión JWT. Se declaran tipos NextAuth extendidos.
- **Helper `getUsuarioSesion()`:** Función server-side para obtener datos del usuario con redirect automático a `/login`. Variante `getUsuarioSesionOpcional()` sin redirect.  
- **Topbar con datos reales:** Nombre, correo, foto de perfil (Google) y rol del usuario logueado. Botón de logout funcional con `signOut()`.
- **Filtrado por organización:** Páginas de Sedes, Ministerios, Tipos de Eventos, Servidores y Documentos filtran datos por `organizacion_id` del usuario autenticado.

#### Export Excel (Fase 5)
- **Utilidad `generarExcel.ts`:** Generación de reportes Excel (.xlsx) con título, fecha, auto-resize de columnas y merge de headers. Usa librería `xlsx`.
- **Botón Excel en `TablaConsulta`:** Botón verde "Excel" junto al PDF en la barra de filtros. Funciona en todas las 14 pantallas de consulta.

#### Sitio Público Completo (Fase 6)
- **Landing Page rediseñada:** 10 secciones con contenido real de serjema.com.mx:
  1. Hero — "Un Don del Espíritu Santo en nuestro tiempo" con cita de Benedicto XVI
  2. Carisma — Misión, visión y filosofía SJM
  3. Ministerios (4) — Evangelización, Pastoral de la Salud, Caridad, ComunicArte
  4. Programas (5) — CreeSer, Magnificat, ELEMÁ, Agitadores de Agua, Plenitud Financiera
  5. Retiros CTA — "Evangelizarte para Sanarte" con inscripción directa
  6. Testimonios (3) — Con rating de estrellas
  7. Centros SJM (8) — Guadalajara, Toluca, Chiapas, Zacatecas, Aguascalientes, Playa del Carmen, Cancún, Cozumel
  8. FAQ (5) — Preguntas frecuentes con acordeones nativos
  9. Donativos CTA — Llamado a donar con gradient banner
  10. Contacto — Email, Instagram, Facebook del Director General
- **Página Blog** (`/blog`): 4 artículos estáticos con categorías y diseño tipo medium.
- **Página Tienda** (`/tienda`): 6 productos con precios, botones de agregar al carrito, y nota de envíos nacionales.
- **Página Donativos** (`/donativos`): 3 métodos de donación (transferencia bancaria, en línea próximamente, contacto directo), métricas de impacto, CTA con WhatsApp.
- **Navbar público sticky** con glassmorphism en todas las páginas públicas.
- **Footer completo** con 4 columnas: branding, navegación, recursos, contacto y redes sociales.

#### Infraestructura
- **28 rutas funcionales** (8 estáticas, 20 dinámicas).
- **Middleware protege 10 rutas** del intranet.
- **Build:** ✅ TypeScript sin errores, producción lista.

---

### v1.040 - 05 de Abril de 2026 - 13:05 CST
- **Implementación Masiva de Catálogos y Movimientos:** Construcción completa de 14 pantallas nuevas siguiendo el patrón ERPCubox con soporte nativo modo claro/oscuro.
- **Componente Reutilizable `TablaConsulta`:** Componente React Client genérico que incluye:
  - Filtro por búsqueda de texto (multi-campo).
  - Filtro por rango de fechas (Desde/Hasta) con campos `type="date"`.
  - Botón de exportación PDF con generación automática vía `jsPDF + autoTable`.
  - Contador de registros filtrado vs total.
  - Botón "Limpiar" filtros.
- **Componente `ModalCatalogo`:** Modal reutilizable para altas de catálogos simples con backdrop cerrado (patrón SJM).
- **Componente `generarPDF`:** Utilidad de generación de reportes PDF con header corporativo azul SJM, paginación y pie de página.
- **Catálogos Nuevos (7):**
  - `/catalogos/sedes` — Administración de Sedes
  - `/catalogos/ministerios` — Catálogo de Ministerios (Música, Liturgia, etc.)
  - `/catalogos/cargos` — Catálogo de Cargos (Coordinador, Apoyo, etc.)
  - `/catalogos/tipos-eventos` — Tipos de Eventos con indicador matrimonial
  - `/catalogos/casas-retiro` — Casas de Retiro con datos operativos completos
  - `/catalogos/clasificaciones-gasto` — Clasificaciones de Gasto
  - `/catalogos/estados` — Estados de la República
- **Movimientos y Consultas Nuevos (4):**
  - `/inscripciones` — Consulta completa de inscripciones con filtros por fecha, estatus y texto
  - `/finanzas` — Módulo financiero con KPIs resumen y tabla de gastos por evento
  - `/documentos` — Gestor Documental institucional con nivel de acceso por rol
  - `/evaluaciones` — Evaluaciones post-evento con calificaciones en estrellas
- **Refactor de Servidores:** Página refactorizada para usar `TablaConsulta` con filtros y PDF.
- **Sidebar Completo:** Reorganización con secciones Operación, Catálogos (submenú colapsable accordion), y Sistema.
- **Server Actions Completos (`catalogos.ts`):** Backend de consultas con joins para todos los catálogos y movimientos del esquema.
- **Dependencias:** `jspdf` y `jspdf-autotable` instaladas para generación de PDF del lado del cliente.
- **Build Verification:** ✅ TypeScript sin errores, build exitoso con 23 rutas funcionales.

---


### v1.010 - 05 de Abril de 2026 - 00:35 CST
- **Módulo Capital Humano (Servidores):** Se crea el Server Action `getServidores` conectando la tabla `servidores` con `usuarios` y `sedes` a través de Left Joins en Drizzle ORM.
- **Catálogo UI:** Implementación de la vista `/dashboard/servidores` utilizando arquitectura SaaS ERPCubox, renderizando el padrón general con microcomponentes condicionales de estatus ("Activo"/"Baja"). Soporte nativo para modo oscuro y claro.

### v1.008 - 05 de Abril de 2026 - 00:25 CST
- **Homologación Visual ERPCubox (Filtro Oscuro):** Reestructuración masiva del Frontend (Layout y Panel de Control) aplicando la estética, espaciado y arquitectura SaaS "Marca Blanca" del sistema base ERPCubox.
- **TopBar Horizontal:** Separación del Drawer y Logo al formato Topbar (`AppTopbar.tsx`) con selectores visuales de Branch (Sede) e iconos de sistema.
- **Sidebar UX:** Modificación de `AppSidebar` a estética `#1a1b26` con Tabs activos en color Primario (`#e11d48`).
- **Módulo de Edición Multi-Tab:** Rediseño completo de `/dashboard/configuracion` imitando el "Editar Empresa" a la perfección (General, Dominio y Acceso, Contacto). Mapeo de nuevos campos sociales y URLs.
- **Base de Datos Extendida:** Empuje en Neon de columnas funcionales SaaS estándar (`whatsapp_contacto`, `horarios_atencion`, `direccion_completa`, `facebook_url`, `instagram_url`, `youtube_url`).

### v1.006 / v1.007 - 04 de Abril de 2026 - 23:55 CST
- **Server Action Reportes:** Se crea el backend de consulta `getInscripciones` jalando datos dinámicos directos de PostgreSQL/Drizzle, descartan caché rígida estática (Next.js 15).
- **Catálogo Intranet (Eventos):** Se da vida a la sección `/dashboard/eventos` generando el Listado de Capturas mediante una Data Table analítica. Incluye parseo de fechas (`date-fns`), estatus visuales, condicionales lógicos para primer ingreso y UI React Server Components.

### v1.005 - 04 de Abril de 2026 - 23:45 CST
- **Parametrización de Organización:** Actualización del esquema `organizaciones` mediante Drizzle para incluir los campos dinámicos `color_primario` y `color_secundario`.
- **Panel de Control Configuración:** Construcción del módulo UI `/dashboard/configuracion` con soporte a modo claro/oscuro, integrando selectores de color hexadecimal (Color Pickers), URL del logotipo institucional y datos de contacto para generación de códigos QR públicos.

### v1.004 - 04 de Abril de 2026 - 22:50 CST
- **Formulario Diplomado:** Creación del componente especializado `<RegistroDiplomadoForm />` para captura del diplomado on-line, incluyendo validaciones de 99 USD.
- **Fix Dark Mode Móvil:** Resolución de problema de legibilidad en dispositivos con esquema oscuro forzado. Se adaptaron las variables base de Tailwind y se agregó soporte explícito `dark:` en Inputs y contenedores.
- **Estructura Intranet (Fase 3):** Implementación de Layout principal administrativo (`/dashboard/layout.tsx`) con **Sidebar Vertical** modular, soportando metadata de la Organización (SJM, Logos, Lemas) y navegación responsive con menú hamburguesa.
- **Actualización Reversiva DB:** Se añadieron a `solicitudes_inscripcion` los campos `pais_ciudad`, `ministerio_actual` y `compromiso_pago_99usd`. Configuración de la `organizaciones` con `logo_url`, `lema` y ligas de QRs públicos. Sincronizado a NEON.

### v1.003 - 04 de Abril de 2026 - 19:42 CST
- **Módulo de Eventos (Backend):** Conexión exitosa del formulario de registro con la base de datos Neon mediante arquitectura *Server Actions* de Next.js (`registrarSolicitudAction`).
- **Estados Visuales UI:** Implementación de Disable (Bloqueo) y estado de carga ("Guardando...") para el botón de completado de registro, previniendo dobles envíos. 

### v1.001 / v1.002 - 04 de Abril de 2026 - 19:35 CST
- **Módulo de Eventos (Frontend):** Creación de landing page dinámica de captura en `/registro/[eventoId]`.
- **Formulario SJM:** Desarrollo del componente `<RegistroForm />` con React Hook Form y Zod. Patch TS Type en inferencia.
- **UI/UX Aesthetics:** Componentes adaptados de Shadcn (Button, Input, Label, Select) con diseño premium en tonos azules institucionales (`Tailwind v4`).
- **Lógica Condicional:** Manejo del estatus de primer retiro, estado civil (Matrimonial/Cónyuge).

### v1.000 - 04 de Abril de 2026 - 19:05 CST
- **Infraestructura Core:** Inicialización de Next.js 15 (App Router) en \`sjm-platform\`.
- **Base de Datos:** Drizzle ORM configurado con cliente NEON Serverless.
- **Migración DB Exitosa:** Diseño Multi-Tenant y catálogos de Operación SJM en español empujados a Neon (17 tablas creadas: \`organizaciones\`, \`sedes\`, \`eventos\`, \`usuarios\`, \`solicitudes_inscripcion\`, etc.).
- **Preparación Auth & UI:** Instalación fundacional de \`next-auth@beta\` y dependencias de \`shadcn/ui\`.
- **Repositorio Remoto Oficial:** Código pusheado y enlazado a \`https://github.com/sergioaguilargranados-ai/SJM.git\`.
