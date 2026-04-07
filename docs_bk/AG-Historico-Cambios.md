# 📜 Histórico de Cambios - SJM Platform

**Última actualización:** 06 de Abril de 2026 - 02:35 CST
**Responsable:** AntiGravity AI Assistant

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
