# 📜 Histórico SJM PLATFORM — v1.201 — COMPILACIÓN: 22-07-2026 13:05 (CDMX)

**Última actualización:** 22 de Julio de 2026 - 13:05 (CDMX)
**Responsable:** AntiGravity AI Assistant

---

### v1.201 - 22 de Julio de 2026 - 13:05 (CDMX)

#### 🚀 Nuevo Campo en Solicitud Médica
- **Checkbox: Ya tengo los estudios:** Se agregó la opción de indicar si el servidor ya cuenta con los estudios médicos correspondientes al momento de solicitar consulta médica en su inscripción a eventos (RENASE).
- **Base de Datos:** Se añadió el campo `ya_tengo_estudios_medicos` en la tabla `solicitudes_inscripcion`.
- **Panel de Control:** Se agregó la columna "Ya Tiene Estudios" a la exportación/tabla de `Asistentes Registrados`.
**Responsable:** AntiGravity AI Assistant

---

### v1.200 - 19 de Julio de 2026 - 23:11 (CDMX)

#### 🚀 Corrección de Formulario RENASE (Campos no requeridos)
- **Flexibilidad en Validación Zod:** Se corrigió un error en el que el formulario de edición de Asistentes (`RegistroRenaseClient.tsx`) marcaba campos vacíos u opcionales (que la base de datos devuelve como `null`) como erróneos. 
- **Solución implementada:** Se cambiaron todas las validaciones de campos no requeridos de `.optional()` a `.nullish()`, permitiendo así inicializar el formulario con datos preexistentes (`null`) sin que Zod bloquee el guardado de la información.
**Responsable:** AntiGravity AI Assistant

---

### v1.199 - 16 de Julio de 2026 - 17:23 (CDMX)

#### 🚀 Corrección en Flujo RENASE
- **Detección Cruzada (Inteligente):** Se modificó la heurística de registro para atrapar y bloquear cruces de datos (cuando un usuario inscribe un celular de una cuenta y correo de otra).
- **Manejo de Errores (Unique Constraints):** Se añadieron bloques `try/catch` para interceptar violaciones de llave única (`23505`) provenientes de la base de datos (Neon/Postgres) y regresar al front-end un mensaje amigable indicando que el correo o celular ya le pertenecen a otra persona.
**Responsable:** AntiGravity AI Assistant

---

### v1.198 - 16 de Julio de 2026 - 14:32 (CDMX)

#### 🚀 Módulo Operación de Evento (Asistentes)
- **Columnas de Logística y Médico:** Integración de campos detallados (itinerario de llegada, salida, asignación de cuarto, consideraciones médicas como escaleras y consultas) en la tabla `AsistentesEventoClientView.tsx`.
- **Exportación Dinámica:** Las nuevas columnas se configuran con `ocultarEnUI: true` para mantener limpio el UI, pudiendo seleccionarse mediante el selector de columnas para exportar un PDF o Excel de logística completo (con valores booleanos parseados a SÍ/NO).
- **Correcciones UI:** Ajuste de layout CSS en `TopbarClient.tsx` para evitar que el logo, el menú y las acciones se empalmen en modo escritorio.

### v1.197 - 07 de Julio de 2026 - 14:35 (CDMX)

#### 🚀 Módulos para Usuario Final e Inicio de Sesión Híbrido
- **Autenticación Híbrida:** Soporte para iniciar sesión con número de teléfono o correo electrónico, eliminando la obligatoriedad del correo en la base de datos (schema).
- **Vinculación de Cuentas:** Se implementó lógica en NextAuth (`auth.ts`) mediante cookies temporales para vincular cuentas de Google (Gmail) a usuarios existentes que se registraron por celular.
- **Módulo Mis Compras:** Creación del dashboard `/mis-compras` para usuarios finales, mostrando el historial de pedidos de la tienda online, con cruce de información de `pedidos_web` y `productos_tienda`.
- **Módulo Mi Perfil:** Se integraron campos de visualización de sesión en `/perfil` y el botón para vincular cuentas externas, reestructurando el `PerfilClientView.tsx`.
- **Asignación Automática de Roles:** El flujo de inscripción (RENASE) y creación de usuario ahora asignan roles base como "Servidor" y "Usuario Tienda" automáticamente.

---

### v1.194 - 05 de Julio de 2026 - 22:00 (CDMX)

- **ModificaciÃ³n de Base de Datos:** IncorporaciÃ³n formal del campo `fecha_inicio_servicio` al esquema de Drizzle `servidores` con su posterior migraciÃ³n (`drizzle-kit push`).
- **SincronizaciÃ³n de Flujo RENASE:** Ajuste del proceso de inscripciÃ³n RENASE (Servidores) para integrar campos faltantes (Foto, `fecha_nacimiento`, etc.) y garantizar un planchado bidireccional exacto.
- **Correcciones de CachÃ©:** ReparaciÃ³n de desincronizaciÃ³n en la descripciÃ³n de los eventos (Landing Page) retirando `revalidateTag` mal implementado en Next.js 16 y actualizando la desestructuraciÃ³n del array resultante de Drizzle.

---

### v1.193 - 30 de Junio de 2026 - 23:14 (CDMX)

#### ðŸš€ Marca Blanca, AsignaciÃ³n de Equipo y Evaluaciones PÃºblicas
- **Marca Blanca:** MÃ³dulo ConfiguraciÃ³n > Organizaciones para aislar dominios, datos y apariencia de forma multi-tenant.
- **Selector de Columnas:** ImplementaciÃ³n de visibilidad de columnas dinÃ¡mica en `TablaConsulta` y aplicaciÃ³n en exportaciones PDF y Excel.
- **AsignaciÃ³n de Equipo:** Nuevo modal con selecciÃ³n de evento, servidor, cargo y aportaciÃ³n econÃ³mica, con grabaciÃ³n en `equipo_evento`.
- **Filtros de InscripciÃ³n:** ImplementaciÃ³n de selectores dinÃ¡micos (Sede, Evento, Rango de Edad) para segmentaciÃ³n de participantes y exportaciones.
- **Evaluaciones Post-Evento:** Captura de evaluaciones de forma pÃºblica mediante validaciÃ³n de correo/celular contra la base de datos de inscripciones.

---

### v1.192 - 30 de Junio de 2026 - 12:00 AM (CDMX)

#### ðŸš€ Mejoras en GestiÃ³n Operativa y Correcciones
- **CatÃ¡logo de Servidores (Vistas Duales):** RefactorizaciÃ³n de la vista para soportar alternancia entre Formato Fichas (Tarjetas) y Formato Lista (Tabla). Soporte para visualizar detalle de servidores en Modal. Script para generar la plantilla Excel de importaciÃ³n con los nuevos campos de Base de Datos aÃ±adidos en Neon (redes sociales, detalle de retiros, etc).
- **GestiÃ³n de Eventos y Retiros (Vistas Duales):** RefactorizaciÃ³n a formato Vistas Duales para visualizaciÃ³n estandarizada de eventos con soporte para editar retiros y validaciÃ³n de seguridad a nivel frontend/backend (rol Admin) para el borrado de retiros.
- **Correcciones de CompilaciÃ³n (Sintaxis):** Solucionados errores de sintaxis en `mundo-infantil/page.tsx` y `sanacion-interior/page.tsx` donde faltaban llaves de cierre de JSX y funciones.
- **Correcciones de Dependencias:** Ajuste de dependencias internas (removido uso de `@/components/ui/scroll-area` de `ModalDetalleServidor.tsx`) y reinstalaciÃ³n de mÃ³dulo de Vercel Blob Blob local para corregir corrupciÃ³n en la cadena de compilaciÃ³n de Vercel.

---

### v1.191 - 16 de Junio de 2026 - 02:45 AM (CDMX)

#### ðŸš€ OptimizaciÃ³n de Rendimiento Frontend (Fase 1 y 2)
- **CachÃ© en Server Actions:** ImplementaciÃ³n sistemÃ¡tica de `unstable_cache` de Next.js en las funciones de lectura pÃºblica (`obtenerParametrosLanding`, `obtenerSeccionesPagina`, `obtenerTestimoniosAprobados`, `obtenerAgendaRetiros`, `obtenerProductos`, `obtenerCategorias`, etc.). Esta actualizaciÃ³n minimiza drÃ¡sticamente las consultas redundantes a la base de datos de Neon/Turso, reduciendo costos a $0 y logrando tiempos de respuesta de milisegundos (ISG-like behavior).
- **OptimizaciÃ³n de ImÃ¡genes (LCP):** RefactorizaciÃ³n completa de etiquetas estÃ¡ndar HTML `<img>` por el componente ultra-optimizado `<Image />` de `next/image` en las pÃ¡ginas pÃºblicas de Crecimientos, Media y Tienda. Se configuraron parÃ¡metros de `fill` y `sizes` condicionales para un renderizado responsivo (max-width: 768px 100vw, 33vw) y soporte al diseÃ±o premium de la arquitectura visual.
- **DiagnÃ³stico de Vercel DB:** Se identificÃ³ que Vercel apuntaba a una base de datos antigua (Operadora) al heredar un viejo `.env`. El usuario actualizÃ³ la variable `DATABASE_URL` y `AUTH_SECRET` en la consola de Vercel para que las consultas de producciÃ³n mapeen a la DB correcta (`serjema.com`).

---

### v1.190 - 16 de Junio de 2026 - 01:14 AM (CDMX)

#### ðŸŽ¨ IntegraciÃ³n Frontend del CMS Multimedia
- **SecciÃ³n Nosotros:** Conectada con Server Actions para iterar dinÃ¡micamente las secciones y previsualizar imÃ¡genes/videos usando componentes consistentes de marca blanca.
- **PÃ¡ginas de Ministerios:** (JÃ³venes, Matrimonios, Mundo Infantil, SanaciÃ³n Interior, etc.) Actualizadas de un estado "PrÃ³ximamente" estÃ¡tico a pÃ¡ginas totalmente dinÃ¡micas e integradas con el CMS, utilizando `SeccionContenido` y listando `GaleriaPublica`.
- **GalerÃ­a de Fotos:** Creado el componente interactivo de grilla de fotos (`GaleriaPublica`) conectado de extremo a extremo (base de datos, almacenamiento y presentaciÃ³n pÃºblica).
- **Tarjetas DinÃ¡micas:**
  - **ContÃ¡ctanos:** El equipo ahora se consulta de la base de datos de responsables y muestra dinÃ¡micamente sus fotos con fallback de iniciales.
  - **Testimonios:** AÃ±adido soporte visual de la foto del perfil del autor (cuando no es anÃ³nimo).
- **VersiÃ³n de Footer:** ActualizaciÃ³n de la versiÃ³n visible en el footer (`AppFooter` y pantalla de login) a formato horario de la Ciudad de MÃ©xico.

---

### v1.186 - 16 de Junio de 2026 - 00:15 CST

#### Ã°Å¸â€”â€žÃ¯Â¸ï¿½ MigraciÃƒÂ³n de Almacenamiento a Vercel Blob
- **AWS S3 / Cloudflare R2:** Se eliminÃƒÂ³ la dependencia de `@aws-sdk/client-s3` y la lÃƒÂ³gica de subida de archivos hacia Cloudflare R2 debido a problemas de cuenta.
- **Vercel Blob:** Se integrÃƒÂ³ `@vercel/blob` para el guardado de imÃƒÂ¡genes, emulando la arquitectura de `operadora-dev`. Se actualizÃƒÂ³ `src/lib/storage.ts` para proveer la funciÃƒÂ³n `subirArchivoR2` adaptada internamente a Vercel Blob para mantener compatibilidad hacia atrÃƒÂ¡s.
- **Entorno:** Se aÃƒÂ±adiÃƒÂ³ `BLOB_READ_WRITE_TOKEN` al archivo local `.env.local`.

---

### v1.185 - 13 de Mayo de 2026 - 18:25 CST

#### Ã°Å¸â€™Â° MÃƒÂ³dulo de Finanzas y Control de Gastos
- **GestiÃƒÂ³n de Egresos:** Se implementÃƒÂ³ el mÃƒÂ³dulo de gastos operativos (`/finanzas`) con desglose por evento. Permite registrar facturas, recibos y conceptos de gasto con categorizaciÃƒÂ³n dinÃƒÂ¡mica.
- **AnÃƒÂ¡lisis de Rentabilidad:** Nuevo motor de cÃƒÂ¡lculo financiero que compara ingresos reales (Inscripciones pagadas) contra gastos operativos, generando indicadores de margen neto y alertas de salud financiera.
- **Interfaz Premium:** DiseÃƒÂ±o de tarjetas de resumen financiero con micro-animaciones y modales de cristalerÃƒÂ­a (glassmorphism) para el registro de datos.

---

### v1.180 - 13 de Mayo de 2026 - 18:15 CST


#### Ã°Å¸â€ºÂ¡Ã¯Â¸ï¿½ Refactor de Seguridad y Multi-tenancy (Triple Filtro)
- **Esquema de Base de Datos:** Se aÃƒÂ±adieron columnas `organizacion_id` con vinculaciÃƒÂ³n mandatoria a las tablas de `servidores`, `eventos`, `casas_retiro` y `solicitudes_inscripcion`. Esto asegura la integridad del aislamiento de datos por organizaciÃƒÂ³n (Marca Blanca).
- **Filtrado Estricto en Consultas:** Se refactorizÃƒÂ³ `src/app/actions/consultas.ts` para incluir validaciÃƒÂ³n de plan (`validarAccesoPlan`) y filtrado por `orgId` en todas las funciones de lectura. 
- **EstabilizaciÃƒÂ³n de SesiÃƒÂ³n:** Se actualizÃƒÂ³ el `AppTopbar` para manejar errores de sesiÃƒÂ³n del servidor y evitar fallos de hidrataciÃƒÂ³n (React Error #418), permitiendo una navegaciÃƒÂ³n fluida incluso en estados de "Invitado".

---

### v1.171 - 27 de Abril de 2026 - 21:50 CST


#### Ã°Å¸â€œÅ  Reportes de InscripciÃƒÂ³n PDF/Excel Mejorados
- **TablaConsulta:** Se implementÃƒÂ³ una nueva propiedad `ocultarEnUI` en la interface de columnas, la cual permite incluir campos de datos (como el correo electrÃƒÂ³nico) en los reportes de exportaciÃƒÂ³n generados en PDF y Excel, manteniendo una interfaz de usuario limpia.
- **Inscripciones:** Se agregÃƒÂ³ la columna oculta de "Correo ElectrÃƒÂ³nico" (`correo`) para que la informaciÃƒÂ³n de contacto sea extraÃƒÂ­da exitosamente en los reportes tabulares, compliendo con el requerimiento de anÃƒÂ¡lisis de datos.
- **VersiÃƒÂ³n Sincronizada:** v1.171 lista en todos los accesos.

---

### v1.170 - 13 de Abril de 2026 - 12:00 CST

#### Ã°Å¸â€œÂ± EncapsulaciÃƒÂ³n MÃƒÂ³vil (PWA) Nativa
- **Progressive Web App (PWA):** ImplementaciÃƒÂ³n de la arquitectura PWA sin dependencias externas usando `manifest.json` y `sw.js` (Service Worker en raÃƒÂ­z) para permitir instalaciÃƒÂ³n nativa en dispositivos iOS y Android.
- **Registro de Service Worker:** Nuevo componente cliente `<PwaRegister />` inyectado en el `layout.tsx` maestro para activar el cacheo local y habilitar la solicitud de instalaciÃƒÂ³n ("AÃƒÂ±adir a Pantalla de Inicio").
- **VersiÃƒÂ³n Sincronizada:** v1.170 lista para despliegue automatizado.

---

### v1.167 - 12 de Abril de 2026 - 13:47 CST

#### Ã°Å¸Å½Â¨ AlineaciÃƒÂ³n Visual Intranet y Landing
- **Topbar Client (Intranet):** Se reestructurÃƒÂ³ la zona del logo para utilizar los mismos parÃƒÂ¡metros y formato visual que la `CenefaNavbar` (Landing Page).
- **Branding Parametrizado:** Ahora utiliza `tenant.logo_url` con fallback automÃƒÂ¡tico al logo oficial de SJM (`/logo-sjm-oficial.png`), eliminando el cuadro de texto genÃƒÂ©rico.
- **Lema Corporativo:** Se aÃƒÂ±adiÃƒÂ³ el lema debajo del nombre de la organizaciÃƒÂ³n en el Topbar, brindando paridad total con la landing page.
- **VersiÃƒÂ³n Sincronizada:** v1.167 en footers, login, landing y documentaciÃƒÂ³n.

---

### v1.166 - 11 de Abril de 2026 - 21:10 CST

#### Ã°Å¸Å½Â¨ AlineaciÃƒÂ³n Visual Intranet y Landing
- **Topbar Client (Intranet):** Se reestructurÃƒÂ³ la zona del logo para utilizar los mismos parÃƒÂ¡metros y formato visual que la `CenefaNavbar` (Landing Page).
- **Perfil de Usuario:** El componente de usuario en la Intranet ahora muestra la inicial/avatar alineada a la izquierda, seguida del primer nombre y con el **rol debajo** del nombre, imitando el estilo exacto que se diseÃƒÂ±ÃƒÂ³ para la landing, brindando completa paridad visual.
- **AclaraciÃƒÂ³n Color MenÃƒÂº Vertical:** El AppSidebar actualmente usa dinÃƒÂ¡micamente `tenant.color_primario`. Si el color de selecciÃƒÂ³n estÃƒÂ¡ en azul, significa que en el mÃƒÂ³dulo *ConfiguraciÃƒÂ³n*, la OrganizaciÃƒÂ³n de SJM tiene asignado este color. El cÃƒÂ³digo permanece adaptativo hacia este valor en caso de que se actualice la configuraciÃƒÂ³n institucional.
- **VersiÃƒÂ³n Sincronizada:** v1.166 en footers y documentaciÃƒÂ³n.

---

### v1.165 - 10 de Abril de 2026 - 11:08 CST

#### Ã¢Å“Â¨ Interfaz Premium y Micro-Interacciones
- **Hero Carrusel Animado:** (`HeroCarrusel.tsx`) Carrusel con auto-advance y transiciones fluidas de fundido y escalado, con soporte para imÃƒÂ¡genes y "shimmer" (brillo animado).
- **Animaciones Globales:** ImplementaciÃƒÂ³n nativa en `globals.css` para `.btn-glow` (resplandor de botÃƒÂ³n interactivo) y `.text-gradient-animated` para tÃƒÂ­tulos importantes.
- **Scroll Reveal Experiencial:** (`ScrollReveal.tsx`) IntegraciÃƒÂ³n inteligente de Intersection Observer para animaciones en pantalla al hacer scroll (`fade-in-up`).
- **Widget de WhatsApp Flotante:** (`WhatsAppWidget.tsx`) BotÃƒÂ³n flotante pulsante que detecta automÃƒÂ¡ticamente el nÃƒÂºmero de contacto de la OrganizaciÃƒÂ³n (Tenant) para re-dirigir a un chat en vivo.
- **ResoluciÃƒÂ³n de Errores Frontend:** SoluciÃƒÂ³n de re-renderizado (`Hydration Mismatch`) causados por `next-themes` en Next.js 16.1+, soluciÃƒÂ³n al error de Favicon y mitigaciÃƒÂ³n de errores de extensiones externas de Chrome.

#### Ã°Å¸â€�â€” ConexiÃƒÂ³n DinÃƒÂ¡mica Ã¢â‚¬â€� PÃƒÂ¡ginas PÃƒÂºblicas al CMS

##### Infraestructura Multi-Tenant
- **`src/lib/tenant.ts`:** Nuevo resolver de tenant que identifica la organizaciÃƒÂ³n por dominio (`dominio_tenant`) con fallback a la primera organizaciÃƒÂ³n. Incluye `obtenerOrganizacionPorId()` con join a planes para compatibilidad con TenantData.
- La Landing (`page.tsx`) fue convertida a `SSR` y resuelve todos sus componentes compartiendo propiedades de organizaciÃƒÂ³n como el logotipo cargado y contactos.

##### PÃƒÂ¡ginas PÃƒÂºblicas Conectadas (8 pÃƒÂ¡ginas Ã¢â€”â€¹ Ã¢â€ â€™ Ã†â€™)
- **`/` (Landing Page):** Logo central dinÃƒÂ¡mico y cenefas de navegaciÃƒÂ³n que reaccionan a los datos del Tenant.
- **`/nosotros`:** Consume `secciones_contenido` (pagina_clave: "nosotros") con fallback a contenido estÃƒÂ¡tico pre-llenado.
- **`/testimonios`:** Consume `testimonios` aprobados con calificaciÃƒÂ³n, autores y anonimato.
- **`/tienda`:** Consume `productos_tienda` y `categorias_producto` con grid visual, precios, stock bajo y empty state.
- **`/crecimientos`:** Consume `articulos_blog` (blog_clave: "crecimientos") con portada, extracto y fecha de publicaciÃƒÂ³n.
- **`/media`:** Consume `media_contenido` con colores por tipo (mÃƒÂºsica/podcast/video), badges de duraciÃƒÂ³n y miniaturas.
- **`/retiros-eventos`:** Consume `agenda_retiros` con joins a tipos_eventos y sedes, tarjetas tipo calendario.
- **`/ayuda`:** Consume `preguntas_frecuentes` con expand/collapse y `telefonos_emergencia` dinÃƒÂ¡micos.

##### PatrÃƒÂ³n de DiseÃƒÂ±o
- **HÃƒÂ­brido CMS-Fallback:** Todas las pÃƒÂ¡ginas consultan primero la BD; si no hay datos, muestran contenido estÃƒÂ¡tico de respaldo (nunca una pÃƒÂ¡gina vacÃƒÂ­a).
- **Empty States:** Tienda, Blog, Media y Retiros muestran estados vacÃƒÂ­os elegantes con iconos y texto "PrÃƒÂ³ximamente".

---

### v1.160 - 10 de Abril de 2026 - 09:58 CST

#### Ã°Å¸Å½â€ºÃ¯Â¸ï¿½ Admin CMS + Server Actions (Fases 3-7)

##### Server Actions Layer (2 archivos nuevos)
- **`actions/contenido.ts`:** 30+ funciones de lectura/escritura para CMS (parametros_landing, secciones, testimonios, FAQ, telÃƒÂ©fonos, responsables, galerÃƒÂ­a, letreros, media, blog, agenda).
- **`actions/tienda.ts`:** 20+ funciones para tienda online (productos, categorÃƒÂ­as, pedidos con folio auto-incremental, formas de entrega, medios de pago, descuento de stock automÃƒÂ¡tico).

##### MÃƒÂ³dulos Admin Intranet (5 nuevas pÃƒÂ¡ginas)
- **`/configuracion/contenido`:** Admin CMS con 6 tabs (Secciones por pÃƒÂ¡gina, Branding con color pickers, Testimonios con aprobar/rechazar, FAQ, TelÃƒÂ©fonos, Equipo directivo).
- **`/configuracion/tienda`:** Admin Tienda con 4 tabs (Productos con grid visual, CategorÃƒÂ­as, Pedidos con cambio de estatus, EnvÃƒÂ­os y Medios de Pago).
- **`/configuracion/blog`:** Admin Blog con publicar/despublicar, editor con blog_clave (crecimientos/formaciÃƒÂ³n/general), categorÃƒÂ­as y extractos.
- **`/configuracion/media`:** Admin Multimedia con filtro por tipo, grid visual con miniaturas, CRUD de mÃƒÂºsica/podcasts/videos con URL externo.
- **`/configuracion/agenda`:** Admin Agenda de Retiros con tarjetas tipo calendario, joins a tipos_eventos y sedes, formulario completo de programaciÃƒÂ³n.

##### Sidebar Actualizado
- Nueva secciÃƒÂ³n "Sitio Web" en el sidebar con 5 opciones CMS (Contenido, Tienda, Blog, Media, Agenda).

##### Build
- Verificado exitoso con **30 pÃƒÂ¡ginas** (25 anteriores + 5 admin nuevas), **0 errores**.


---


### v1.150 - 10 de Abril de 2026 - 04:35 CST

#### Ã°Å¸ï¿½â€”Ã¯Â¸ï¿½ TransformaciÃƒÂ³n Landing Marca Blanca Ã¢â‚¬â€� Fase 1 & 2

##### Base de Datos (17 tablas nuevas)
- **`parametros_landing`:** ConfiguraciÃƒÂ³n completa del sitio por org (colores con clave, cenefa, footer degradado, carrusel, videos, WhatsApp QR, Google Maps, orden de secciones).
- **`secciones_contenido`:** CMS parametrizado para todas las pÃƒÂ¡ginas (tÃƒÂ­tulo, subtÃƒÂ­tulo, contenido, autorÃƒÂ­a, imagen, video, menÃƒÂº tarjeta, liga a funciÃƒÂ³n de permisos).
- **`telefonos_emergencia`:** TelÃƒÂ©fonos de emergencia y administraciÃƒÂ³n con WhatsApp QR.
- **`responsables_organizacion`:** Directivos con foto, cargo, mensaje de saludo.
- **`testimonios`:** Sistema de testimonios parametrizados con soporte anÃƒÂ³nimo y aprobaciÃƒÂ³n.
- **`preguntas_frecuentes`:** FAQ parametrizadas por pÃƒÂ¡gina.
- **`galeria_fotos`:** GalerÃƒÂ­a de fotos por pÃƒÂ¡gina para cintas/collages.
- **`letreros_especiales`:** Letreros parametrizados (ELEMA KIDS, ELEMÃƒï¿½, etc.) con fuente y estilo.
- **`categorias_producto`:** CategorÃƒÂ­as para tienda online.
- **`productos_tienda`:** Productos con precio, stock, SKU, imÃƒÂ¡genes.
- **`pedidos_web`:** Pedidos con datos de cliente, financieros, y entrega.
- **`detalle_pedido`:** LÃƒÂ­neas de pedido.
- **`formas_entrega`:** Formas de entrega parametrizadas.
- **`textos_medios_pago`:** Instrucciones de medios de pago.
- **`notificaciones_tienda`:** Plantillas de notificaciÃƒÂ³n de tienda.
- **`agenda_retiros`:** Calendario de retiros pÃƒÂºblicos.
- **`articulos_blog`:** ArtÃƒÂ­culos de blog (Crecimientos, FormaciÃƒÂ³n).
- **`media_contenido`:** MÃƒÂºsica, Podcasts, Videos con URLs externas.

##### Componentes Globales
- **`CenefaNavbar`:** Cenefa traslÃƒÂºcida al 70% + navbar integrada con todas las pÃƒÂ¡ginas, soporte de sesiÃƒÂ³n, menÃƒÂº mÃƒÂ³vil.
- **`FooterPublico`:** Footer alto con degradado negro a gris, parametrizado (navegaciÃƒÂ³n, recursos, contacto, redes sociales).
- **`ComponentesLanding`:** TarjetaMenuSeccion, SeccionContenido, CarruselImagenes, CintaFotosVertical, LetreroEspecial.
- **Layout `(public)`:** Layout compartido con cenefa + footer para todas las pÃƒÂ¡ginas pÃƒÂºblicas.

##### PÃƒÂ¡gina Principal RediseÃƒÂ±ada (14 secciones)
- Cenefa 70% sticky, carrusel parametrizable, bienvenida con logo grande, "No estÃƒÂ¡s solo", retiros, matrimonios, jÃƒÂ³venes, mundo infantil, testimonios, tienda, centros, donaciones, ayuda, contacto.

##### 17 PÃƒÂ¡ginas PÃƒÂºblicas
- `/nosotros` Ã¢â‚¬â€� 8 secciones completas con contenido pre-llenado de serjema.com.mx
- `/contactanos` Ã¢â‚¬â€� Formulario, tarjetas de contacto, equipo directivo, redes sociales
- `/testimonios` Ã¢â‚¬â€� Testimonios con CTA para agregar (anÃƒÂ³nimo)
- `/donativos` Ã¢â‚¬â€� Datos bancarios reales, impactos, 3 mÃƒÂ©todos de pago
- `/jovenes` Ã¢â‚¬â€� ELEMÃƒï¿½ con letrero colorido juvenil
- `/matrimonios` Ã¢â‚¬â€� Plenitud Matrimonial con colores amorosos
- `/sanacion-interior` Ã¢â‚¬â€� Magnificat con cita bÃƒÂ­blica
- `/mundo-infantil` Ã¢â‚¬â€� ELEMA KIDS con colores pastel vivos, juegos, trivias, videos
- `/llama-de-amor` Ã¢â‚¬â€� OraciÃƒÂ³n, telÃƒÂ©fonos emergencia, placeholder agente IA
- `/centros` Ã¢â‚¬â€� 8 sedes pre-llenadas con links Facebook
- `/retiros-eventos` Ã¢â‚¬â€� Placeholder para agenda interactiva
- `/ayuda` Ã¢â‚¬â€� 3 categorÃƒÂ­as (Espiritual, PsicolÃƒÂ³gica, TÃƒÂ©cnica)
- `/tienda` Ã¢â‚¬â€� Placeholder para catÃƒÂ¡logo (modelo ERPCubox)
- `/media` Ã¢â‚¬â€� Tabs MÃƒÂºsica/Podcasts/Videos estilo YouTube
- `/crecimientos` Ã¢â‚¬â€� Blog de crecimientos
- `/formacion` Ã¢â‚¬â€� Blog de formaciÃƒÂ³n + E-Learning
- `/blog` Ã¢â‚¬â€� Blog migrado con artÃƒÂ­culos pre-llenados

##### Infraestructura
- **Middleware:** Agregadas 17 rutas pÃƒÂºblicas nuevas.
- **MigraciÃƒÂ³n:** Eliminadas las pÃƒÂ¡ginas antiguas `/blog`, `/donativos`, `/tienda` con nav/footer estÃƒÂ¡ticos propios.
- **CSS:** Animaciones de carrusel vertical, fade-in-up, scroll suave global.
- **Build:** Verificado exitosamente (25 pÃƒÂ¡ginas, 0 errores).

---

### v1.140 - 10 de Abril de 2026 - 00:55 CST

#### MÃƒÂ³dulo Completo de GestiÃƒÂ³n de Accesos (RBAC)
- **Matriz de Permisos:** Nueva interfaz en `/configuracion/permisos` que permite activar/desactivar permisos (Ver, Crear, Editar, Eliminar) por cada mÃƒÂ³dulo del sistema de forma granular.
- **GestiÃƒÂ³n de Usuarios:** Nuevo mÃƒÂ³dulo en `/configuracion/usuarios` para listar el equipo y asignar roles dinÃƒÂ¡micamente mediante un diÃƒÂ¡logo de gestiÃƒÂ³n.
- **Estructura de Sistema (Seed):** Se poblÃƒÂ³ la base de datos con la jerarquÃƒÂ­a completa de MÃƒÂ³dulos (Dashboard, Servidores, Eventos, Finanzas, etc.) para habilitar el control granular.
- **Acciones Flexibles:** ImplementaciÃƒÂ³n de `upsertRolAction`, `actualizarPermisosRolAction` y `asignarRolUsuarioAction` para una gestiÃƒÂ³n reactiva.
- **UI Components:** IntegraciÃƒÂ³n de componentes Radix (`Checkbox`, `Select`) estilizados con la identidad visual SJM (#00B4AA).
- **Consistencia:** ActualizaciÃƒÂ³n de Sidebar para incluir "Equipo y Usuarios" y sincronizaciÃƒÂ³n de versiones.

---

### v1.125 - 09 de Abril de 2026 - 17:08 CST

#### IntegraciÃƒÂ³n WhatsApp Twilio
- **whatsappService.ts:** Servicio Twilio con inicializaciÃƒÂ³n lazy (mismo patrÃƒÂ³n que Resend). Soporte para cÃƒÂ³digo de paÃƒÂ­s MÃƒÂ©xico automÃƒÂ¡tico.
- **Bienvenida WhatsApp:** Al registrarse con celular, se envÃƒÂ­a mensaje de bienvenida por WhatsApp ademÃƒÂ¡s del email.
- **RecuperaciÃƒÂ³n por WhatsApp:** Cuando solicitan recuperaciÃƒÂ³n por celular, el enlace se envÃƒÂ­a tanto por email como por WhatsApp.
- **Mensajes predefinidos:** `mensajeBienvenidaWhatsApp()` y `mensajeRecuperacionWhatsApp()` con formato markdown de WhatsApp.
- **Fix MenÃƒÂº Intranet:** Se corrigiÃƒÂ³ la visibilidad del menÃƒÂº para el tenant principal (SJM), promoviendo al usuario administrador a "Super Administrador" y activando el flag `es_admin_sistema` en los roles de gestiÃƒÂ³n. Esto restaura las opciones de navegaciÃƒÂ³n que se ocultaron tras la implementaciÃƒÂ³n del sistema RBAC granular.
- **VersiÃƒÂ³n Sincronizada:** v1.125 en Landing, Login, Registro e Intranet.

---

### v1.120 - 09 de Abril de 2026 - 14:50 CST

#### RecuperaciÃƒÂ³n de ContraseÃƒÂ±a Completa
- **Tabla `tokens_recuperacion`:** Nueva tabla para tokens de recuperaciÃƒÂ³n con expiraciÃƒÂ³n (1 hora) y uso ÃƒÂºnico. Sincronizada con Neon.
- **PÃƒÂ¡gina `/recuperar`:** Formulario para solicitar recuperaciÃƒÂ³n por correo o celular. EnvÃƒÂ­a email con enlace seguro vÃƒÂ­a Resend.
- **PÃƒÂ¡gina `/recuperar/[token]`:** Formulario para nueva contraseÃƒÂ±a con validador de fortaleza. 4 estados: validando, invÃƒÂ¡lido, formulario, ÃƒÂ©xito.
- **Server Actions:** `solicitarRecuperacionAction`, `validarTokenAction`, `restablecerContrasenaAction` Ã¢â‚¬â€� Flujo seguro end-to-end.
- **Seguridad:** No revela si el correo/celular existe (protecciÃƒÂ³n contra enumeraciÃƒÂ³n). Tokens single-use con bcrypt hash.
- **Link en Login:** El "Ã‚Â¿Olvidaste tu contraseÃƒÂ±a?" ya apunta a `/recuperar`.
- **VersiÃƒÂ³n Sincronizada:** v1.120.

---

### v1.115 - 09 de Abril de 2026 - 14:25 CST

#### Navbar con SesiÃƒÂ³n, Perfil de Usuario y Email Resend
- **NavbarPublica:** Nuevo componente cliente que muestra avatar y dropdown con opciones cuando el usuario estÃƒÂ¡ logueado (Mi Perfil, Dashboard, Cerrar SesiÃƒÂ³n). BotÃƒÂ³n "Acceso" cuando no lo estÃƒÂ¡. MenÃƒÂº hamburguesa responsive.
- **AuthProvider:** SessionProvider de NextAuth agregado al layout raÃƒÂ­z para soportar `useSession()` en toda la app.
- **PÃƒÂ¡gina `/perfil`:** Interfaz premium con avatar, datos personales editables, toggle "Soy Servidor SJM" con selector de sede. Al guardar se actualiza la DB.
- **Server Action `actualizarPerfilAction`:** Backend para actualizar nombre, celular, fecha nacimiento, estatus servidor y sede.
- **Resend Email Service:** `emailService.ts` con inicializaciÃƒÂ³n lazy para evitar crash en build. `emailTemplate.ts` con plantilla HTML corporativa SJM.
- **Email de Bienvenida:** Se envÃƒÂ­a automÃƒÂ¡ticamente al registrarse (Google o credenciales).
- **Middleware:** Ruta `/perfil` protegida, `/recuperar` pÃƒÂºblica.
- **VersiÃƒÂ³n Sincronizada:** v1.115.

---

### v1.110 - 09 de Abril de 2026 - 13:00 CST

#### Sistema de AutenticaciÃƒÂ³n y Registro Completo (Fase 1)
- **Auto-creaciÃƒÂ³n con Google:** El callback `signIn` ahora crea automÃƒÂ¡ticamente usuarios nuevos en la DB con rol "General" al acceder con Google. Ya no muestra "Acceso Denegado".
- **Provider de Credenciales:** Nuevo provider `Credentials` en NextAuth para login por correo/contraseÃƒÂ±a y celular/contraseÃƒÂ±a con verificaciÃƒÂ³n bcrypt.
- **PÃƒÂ¡gina `/registro`:** Interfaz Glassmorphism con 3 modos de registro (Google, Correo, Celular). Incluye validador visual de fortaleza de contraseÃƒÂ±a en tiempo real.
- **Server Action `registrarUsuarioAction`:** Backend de registro con validaciÃƒÂ³n, hash bcrypt, detecciÃƒÂ³n de duplicados y asignaciÃƒÂ³n automÃƒÂ¡tica de rol.
- **Rol "General":** Nuevo rol auto-creado para usuarios que se registran por su cuenta, con acceso a portal pÃƒÂºblico, inscripciones y perfil.
- **Esquema DB:** Campos `fecha_nacimiento` y `es_servidor` agregados a tabla `usuarios`. Sincronizado con Neon.
- **Dependencia:** `bcryptjs` instalado para hash de contraseÃƒÂ±as.
- **VersiÃƒÂ³n Sincronizada:** v1.110.

---

### v1.102 - 09 de Abril de 2026 - 12:00 CST

#### Build Fix: Static Prerendering
- **auth/error/page.tsx:** Se envolviÃƒÂ³ el contenido que usa `useSearchParams` en un boundary de `<Suspense />`. Esto es mandatorio en Next.js para permitir la generaciÃƒÂ³n estÃƒÂ¡tica de pÃƒÂ¡ginas que dependen de parÃƒÂ¡metros de bÃƒÂºsqueda del lado del cliente.
- **VersiÃƒÂ³n Sincronizada:** v1.102.

---

### v1.101 - 09 de Abril de 2026 - 11:55 CST

#### Build Fix: Missing Assets
- **AppSidebar.tsx:** Se aÃƒÂ±adiÃƒÂ³ el import de `ShieldCheck` de `lucide-react` que causaba fallo de compilaciÃƒÂ³n.
- **VersiÃƒÂ³n Sincronizada:** v1.101.

---

### v1.100 - 09 de Abril de 2026 - 11:50 CST (Hito 100)

#### Build Fix: Tenant Identity
- **TenantProvider.tsx:** SincronizaciÃƒÂ³n de la interfaz `TenantData` con el objeto `TENANT_DEFAULT`. Se aÃƒÂ±adiÃƒÂ³ la propiedad `plan` requerida para evitar fallos de compilaciÃƒÂ³n en Vercel.
- **Hito:** 100 versiones de evoluciÃƒÂ³n continua.
- **VersiÃƒÂ³n Sincronizada:** v1.100.

---

### v1.099 - 09 de Abril de 2026 - 11:10 CST

#### Build Fix: TypeScript & UI
- **auth/error/page.tsx:** EliminaciÃƒÂ³n de propiedad `asChild` no compatible con el componente `Button` actual. Se refactorizÃƒÂ³ la navegaciÃƒÂ³n usando envoltorios `Link` estÃƒÂ¡ndar.
- **VersiÃƒÂ³n Sincronizada:** v1.099.

---

### v1.098 - 09 de Abril de 2026 - 10:55 CST

#### Build Fix: TypeScript Typings
- **permisos.ts:** Se aÃƒÂ±adiÃƒÂ³ el retorno explÃƒÂ­cito de `{ session, orgId, planClave }` en `validarAccesoPlan` para corregir errores de tipado en pÃƒÂ¡ginas de consulta.
- **VersiÃƒÂ³n Sincronizada:** v1.098.

---

### v1.097 - 09 de Abril de 2026 - 10:45 CST

#### Build Fix: Syntax Object Close
- **permisos.ts:** CorrecciÃƒÂ³n de cierre de objeto `accesos` (falta de `;}`).
- **VersiÃƒÂ³n Sincronizada:** v1.097.

---

### v1.096 - 09 de Abril de 2026 - 10:40 CST

#### Build Fix: Turbopack & Syntax
- **permisos.ts:** CorrecciÃƒÂ³n de error de sintaxis (llave de cierre faltante en `validarAccesoPlan`) que impedÃƒÂ­a la compilaciÃƒÂ³n en Vercel.
- **Importaciones:** Se aÃƒÂ±adieron las tablas de schema faltantes en el mÃƒÂ³dulo de permisos para el RBAC granular.
- **VersiÃƒÂ³n Sincronizada:** v1.096.

---

### v1.095 - 09 de Abril de 2026 - 10:15 CST

#### Fix CrÃƒÂ­tico AutenticaciÃƒÂ³n y Despliegue
- **PÃƒÂ¡gina de Error NextAuth:** CreaciÃƒÂ³n de `src/app/auth/error/page.tsx` para manejar errores de `AccessDenied` con UI premium, eliminando el error 404.
- **SincronizaciÃƒÂ³n Neon:** EjecuciÃƒÂ³n de `drizzle-kit push` para homologar la existencia de `organizacion_id` en `roles_sistema`.
- **InyecciÃƒÂ³n de Administradores:** EjecuciÃƒÂ³n de script de reparaciÃƒÂ³n para autorizar correos de Sergio Aguilar as Super Admins.
- **VersiÃƒÂ³n Sincronizada:** ActualizaciÃƒÂ³n global a v1.095 en footers y documentaciÃƒÂ³n.

---

### v1.090 - 08 de Abril de 2026 - 16:55 CST

#### Arquitectura SaaS y Seguridad Granular (Ã‚Â¡MANDATORIO!)
- **Triple Filtro de Seguridad:** ImplementaciÃƒÂ³n de capas de validaciÃƒÂ³n en cascada:
  1. **Plan (SaaS):** ValidaciÃƒÂ³n de mÃƒÂ³dulos permitidos (`landing`, `admin`, `premium`).
  2. **Rol (RBAC):** Filtrado de acciones por permiso (`view`, `create`, `edit`, `delete`, `export`).
  3. **OrganizaciÃƒÂ³n (Multi-tenancy):** Aislamiento estricto de datos por `organizacion_id`.
- **Sidebar Parametrizado:** El menÃƒÂº lateral ahora es 100% dinÃƒÂ¡mico. Oculta/Muestra opciones basado en el Plan de la Org y los Permisos del Rol del usuario simultÃƒÂ¡neamente.
- **Helper `validarAccesoPlan`:** FunciÃƒÂ³n centralizada para proteger Server Components y redirigir al Dashboard si el nivel de suscripciÃƒÂ³n es insuficiente.

#### Interfaz Premium y UX
- **Login v1.080:** RediseÃƒÂ±o con estÃƒÂ©tica *Glassmorphism*, estados dinÃƒÂ¡micos para acceso por Correo/Celular e ÃƒÂ­cono de Google en SVG puro. Se aÃƒÂ±adiÃƒÂ³ flujo de registro.
- **Notificaciones Premium:** Sistema `SjmToast` con diseÃƒÂ±o translÃƒÂºcido (60% transparencia), indicadores de estado circulares y tipografÃƒÂ­a oficial.
- **Identidad:** ConfiguraciÃƒÂ³n de Favicon oficial y metadatos SEO.

#### MÃƒÂ³dulos y Persistencia
- **Mantenimiento de Permisos:** Nueva pantalla para gestiÃƒÂ³n de Roles y visualizaciÃƒÂ³n de planes habilitada en ConfiguraciÃƒÂ³n.
- **MÃƒÂ³dulos Maestros Activados:** Servidores, Documentos, Sedes, Ministerios y Tipos de Eventos actualizados con seguridad granular y filtrado multi-tenant.
- **ConfiguraciÃƒÂ³n Real:** MigraciÃƒÂ³n de la vista de organizaciÃƒÂ³n de prototipo a Server Action funcional con persistencia en PostgreSQL.

---

### v1.070 - 08 de Abril de 2026 - 12:00 CST
- **Esquema SaaS:** EvoluciÃƒÂ³n del modelo de base de datos para soportar Planes -> MÃƒÂ³dulos -> Funciones -> Acciones.
- **Seed Script:** ActualizaciÃƒÂ³n del script de semilla para inicializar la jerarquÃƒÂ­a de permisos nacional.
- **TenantProvider:** InyecciÃƒÂ³n de informaciÃƒÂ³n del Plan en el contexto del cliente.

---

### v1.060 - 07 de Abril de 2026 - 16:40 CST

#### Herramientas de Desarrollo (Fase 1)
- **Workflows automatizados:** CreaciÃƒÂ³n de 4 workflows en `.agents/workflows/`:
  - `/build` Ã¢â‚¬â€� CompilaciÃƒÂ³n y verificaciÃƒÂ³n TypeScript
  - `/version` Ã¢â‚¬â€� ActualizaciÃƒÂ³n de versiÃƒÂ³n en 4 archivos (layout, landing, login, histÃƒÂ³rico)
  - `/deploy` Ã¢â‚¬â€� Commit y push a GitHub con auto-deploy a Vercel
  - `/database` Ã¢â‚¬â€� Migraciones Drizzle ORM a Neon PostgreSQL
- **AGENTS.md actualizado:** Referencia rÃƒÂ¡pida completa del proyecto con credenciales, convenciones, checklist pre-commit y listado de workflows.
- **AG-Contexto-Proyecto.md enriquecido:** Secciones nuevas de Herramientas de Desarrollo y EstÃƒÂ¡ndar de Tema Claro/Oscuro.

#### Fix Tema Claro/Oscuro (Fase 4)
- **Bug CrÃƒÂ­tico resuelto:** El toggle Sol/Luna no funcionaba porque `globals.css` usaba `@media (prefers-color-scheme: dark)` en lugar del selector `.dark` que usa `next-themes`. **Corregido.**
- **Sistema de CSS Variables completo:** 12 variables de diseÃƒÂ±o (background, foreground, surface, card, muted, accents) con valores para tema claro y oscuro.
- **Componentes UI corregidos:**
  - `button.tsx` Ã¢â‚¬â€� Variantes `outline`, `secondary`, `ghost` y `link` ahora tienen `dark:` classes
  - `label.tsx` Ã¢â‚¬â€� Texto visible en dark mode (`dark:text-slate-200`)
  - `dialog.tsx` Ã¢â‚¬â€� Fondo y bordes explÃƒÂ­citos para dark mode (`dark:bg-[#1a1b26]`, `dark:border-[#2a2b3d]`)
- **Paleta Dark Mode documentada:** Tokens estandarizados para que todo componente futuro use los mismos colores.

#### Infraestructura
- **Build:** Ã¢Å“â€¦ TypeScript sin errores, 28 rutas funcionales
- **VersiÃƒÂ³n sincronizada** en layout.tsx, page.tsx, login/page.tsx

---

### v1.055 - 06 de Abril de 2026 - 02:35 CST

#### Multi-Tenant Real (Fase 3)
- **Auth reescrito:** InyecciÃƒÂ³n de `organizacion_id`, `sede_id`, `rol_id`, `nombre_completo` en la sesiÃƒÂ³n JWT. Se declaran tipos NextAuth extendidos.
- **Helper `getUsuarioSesion()`:** FunciÃƒÂ³n server-side para obtener datos del usuario con redirect automÃƒÂ¡tico a `/login`. Variante `getUsuarioSesionOpcional()` sin redirect.  
- **Topbar con datos reales:** Nombre, correo, foto de perfil (Google) y rol del usuario logueado. BotÃƒÂ³n de logout funcional con `signOut()`.
- **Filtrado por organizaciÃƒÂ³n:** PÃƒÂ¡ginas de Sedes, Ministerios, Tipos de Eventos, Servidores y Documentos filtran datos por `organizacion_id` del usuario autenticado.

#### Export Excel (Fase 5)
- **Utilidad `generarExcel.ts`:** GeneraciÃƒÂ³n de reportes Excel (.xlsx) con tÃƒÂ­tulo, fecha, auto-resize de columnas y merge de headers. Usa librerÃƒÂ­a `xlsx`.
- **BotÃƒÂ³n Excel en `TablaConsulta`:** BotÃƒÂ³n verde "Excel" junto al PDF en la barra de filtros. Funciona en todas las 14 pantallas de consulta.

#### Sitio PÃƒÂºblico Completo (Fase 6)
- **Landing Page rediseÃƒÂ±ada:** 10 secciones con contenido real de serjema.com.mx:
  1. Hero Ã¢â‚¬â€� "Un Don del EspÃƒÂ­ritu Santo en nuestro tiempo" con cita de Benedicto XVI
  2. Carisma Ã¢â‚¬â€� MisiÃƒÂ³n, visiÃƒÂ³n y filosofÃƒÂ­a SJM
  3. Ministerios (4) Ã¢â‚¬â€� EvangelizaciÃƒÂ³n, Pastoral de la Salud, Caridad, ComunicArte
  4. Programas (5) Ã¢â‚¬â€� CreeSer, Magnificat, ELEMÃƒï¿½, Agitadores de Agua, Plenitud Financiera
  5. Retiros CTA Ã¢â‚¬â€� "Evangelizarte para Sanarte" con inscripciÃƒÂ³n directa
  6. Testimonios (3) Ã¢â‚¬â€� Con rating de estrellas
  7. Centros SJM (8) Ã¢â‚¬â€� Guadalajara, Toluca, Chiapas, Zacatecas, Aguascalientes, Playa del Carmen, CancÃƒÂºn, Cozumel
  8. FAQ (5) Ã¢â‚¬â€� Preguntas frecuentes con acordeones nativos
  9. Donativos CTA Ã¢â‚¬â€� Llamado a donar con gradient banner
  10. Contacto Ã¢â‚¬â€� Email, Instagram, Facebook del Director General
- **PÃƒÂ¡gina Blog** (`/blog`): 4 artÃƒÂ­culos estÃƒÂ¡ticos con categorÃƒÂ­as y diseÃƒÂ±o tipo medium.
- **PÃƒÂ¡gina Tienda** (`/tienda`): 6 productos con precios, botones de agregar al carrito, y nota de envÃƒÂ­os nacionales.
- **PÃƒÂ¡gina Donativos** (`/donativos`): 3 mÃƒÂ©todos de donaciÃƒÂ³n (transferencia bancaria, en lÃƒÂ­nea prÃƒÂ³ximamente, contacto directo), mÃƒÂ©tricas de impacto, CTA con WhatsApp.
- **Navbar pÃƒÂºblico sticky** con glassmorphism en todas las pÃƒÂ¡ginas pÃƒÂºblicas.
- **Footer completo** con 4 columnas: branding, navegaciÃƒÂ³n, recursos, contacto y redes sociales.

#### Infraestructura
- **28 rutas funcionales** (8 estÃƒÂ¡ticas, 20 dinÃƒÂ¡micas).
- **Middleware protege 10 rutas** del intranet.
- **Build:** Ã¢Å“â€¦ TypeScript sin errores, producciÃƒÂ³n lista.

---

### v1.040 - 05 de Abril de 2026 - 13:05 CST
- **ImplementaciÃƒÂ³n Masiva de CatÃƒÂ¡logos y Movimientos:** ConstrucciÃƒÂ³n completa de 14 pantallas nuevas siguiendo el patrÃƒÂ³n ERPCubox con soporte nativo modo claro/oscuro.
- **Componente Reutilizable `TablaConsulta`:** Componente React Client genÃƒÂ©rico que incluye:
  - Filtro por bÃƒÂºsqueda de texto (multi-campo).
  - Filtro por rango de fechas (Desde/Hasta) con campos `type="date"`.
  - BotÃƒÂ³n de exportaciÃƒÂ³n PDF con generaciÃƒÂ³n automÃƒÂ¡tica vÃƒÂ­a `jsPDF + autoTable`.
  - Contador de registros filtrado vs total.
  - BotÃƒÂ³n "Limpiar" filtros.
- **Componente `ModalCatalogo`:** Modal reutilizable para altas de catÃƒÂ¡logos simples con backdrop cerrado (patrÃƒÂ³n SJM).
- **Componente `generarPDF`:** Utilidad de generaciÃƒÂ³n de reportes PDF con header corporativo azul SJM, paginaciÃƒÂ³n y pie de pÃƒÂ¡gina.
- **CatÃƒÂ¡logos Nuevos (7):**
  - `/catalogos/sedes` Ã¢â‚¬â€� AdministraciÃƒÂ³n de Sedes
  - `/catalogos/ministerios` Ã¢â‚¬â€� CatÃƒÂ¡logo de Ministerios (MÃƒÂºsica, Liturgia, etc.)
  - `/catalogos/cargos` Ã¢â‚¬â€� CatÃƒÂ¡logo de Cargos (Coordinador, Apoyo, etc.)
  - `/catalogos/tipos-eventos` Ã¢â‚¬â€� Tipos de Eventos con indicador matrimonial
  - `/catalogos/casas-retiro` Ã¢â‚¬â€� Casas de Retiro con datos operativos completos
  - `/catalogos/clasificaciones-gasto` Ã¢â‚¬â€� Clasificaciones de Gasto
  - `/catalogos/estados` Ã¢â‚¬â€� Estados de la RepÃƒÂºblica
- **Movimientos y Consultas Nuevos (4):**
  - `/inscripciones` Ã¢â‚¬â€� Consulta completa de inscripciones con filtros por fecha, estatus y texto
  - `/finanzas` Ã¢â‚¬â€� MÃƒÂ³dulo financiero con KPIs resumen y tabla de gastos por evento
  - `/documentos` Ã¢â‚¬â€� Gestor Documental institucional con nivel de acceso por rol
  - `/evaluaciones` Ã¢â‚¬â€� Evaluaciones post-evento con calificaciones en estrellas
- **Refactor de Servidores:** PÃƒÂ¡gina refactorizada para usar `TablaConsulta` con filtros y PDF.
- **Sidebar Completo:** ReorganizaciÃƒÂ³n con secciones OperaciÃƒÂ³n, CatÃƒÂ¡logos (submenÃƒÂº colapsable accordion), y Sistema.
- **Server Actions Completos (`catalogos.ts`):** Backend de consultas con joins para todos los catÃƒÂ¡logos y movimientos del esquema.
- **Dependencias:** `jspdf` y `jspdf-autotable` instaladas para generaciÃƒÂ³n de PDF del lado del cliente.
- **Build Verification:** Ã¢Å“â€¦ TypeScript sin errores, build exitoso con 23 rutas funcionales.

---


### v1.010 - 05 de Abril de 2026 - 00:35 CST
- **MÃƒÂ³dulo Capital Humano (Servidores):** Se crea el Server Action `getServidores` conectando la tabla `servidores` con `usuarios` y `sedes` a travÃƒÂ©s de Left Joins en Drizzle ORM.
- **CatÃƒÂ¡logo UI:** ImplementaciÃƒÂ³n de la vista `/dashboard/servidores` utilizando arquitectura SaaS ERPCubox, renderizando el padrÃƒÂ³n general con microcomponentes condicionales de estatus ("Activo"/"Baja"). Soporte nativo para modo oscuro y claro.

### v1.008 - 05 de Abril de 2026 - 00:25 CST
- **HomologaciÃƒÂ³n Visual ERPCubox (Filtro Oscuro):** ReestructuraciÃƒÂ³n masiva del Frontend (Layout y Panel de Control) aplicando la estÃƒÂ©tica, espaciado y arquitectura SaaS "Marca Blanca" del sistema base ERPCubox.
- **TopBar Horizontal:** SeparaciÃƒÂ³n del Drawer y Logo al formato Topbar (`AppTopbar.tsx`) con selectores visuales de Branch (Sede) e iconos de sistema.
- **Sidebar UX:** ModificaciÃƒÂ³n de `AppSidebar` a estÃƒÂ©tica `#1a1b26` con Tabs activos en color Primario (`#e11d48`).
- **MÃƒÂ³dulo de EdiciÃƒÂ³n Multi-Tab:** RediseÃƒÂ±o completo de `/dashboard/configuracion` imitando el "Editar Empresa" a la perfecciÃƒÂ³n (General, Dominio y Acceso, Contacto). Mapeo de nuevos campos sociales y URLs.
- **Base de Datos Extendida:** Empuje en Neon de columnas funcionales SaaS estÃƒÂ¡ndar (`whatsapp_contacto`, `horarios_atencion`, `direccion_completa`, `facebook_url`, `instagram_url`, `youtube_url`).

### v1.006 / v1.007 - 04 de Abril de 2026 - 23:55 CST
- **Server Action Reportes:** Se crea el backend de consulta `getInscripciones` jalando datos dinÃƒÂ¡micos directos de PostgreSQL/Drizzle, descartan cachÃƒÂ© rÃƒÂ­gida estÃƒÂ¡tica (Next.js 15).
- **CatÃƒÂ¡logo Intranet (Eventos):** Se da vida a la secciÃƒÂ³n `/dashboard/eventos` generando el Listado de Capturas mediante una Data Table analÃƒÂ­tica. Incluye parseo de fechas (`date-fns`), estatus visuales, condicionales lÃƒÂ³gicos para primer ingreso y UI React Server Components.

### v1.005 - 04 de Abril de 2026 - 23:45 CST
- **ParametrizaciÃƒÂ³n de OrganizaciÃƒÂ³n:** ActualizaciÃƒÂ³n del esquema `organizaciones` mediante Drizzle para incluir los campos dinÃƒÂ¡micos `color_primario` y `color_secundario`.
- **Panel de Control ConfiguraciÃƒÂ³n:** ConstrucciÃƒÂ³n del mÃƒÂ³dulo UI `/dashboard/configuracion` con soporte a modo claro/oscuro, integrando selectores de color hexadecimal (Color Pickers), URL del logotipo institucional y datos de contacto para generaciÃƒÂ³n de cÃƒÂ³digos QR pÃƒÂºblicos.

### v1.004 - 04 de Abril de 2026 - 22:50 CST
- **Formulario Diplomado:** CreaciÃƒÂ³n del componente especializado `<RegistroDiplomadoForm />` para captura del diplomado on-line, incluyendo validaciones de 99 USD.
- **Fix Dark Mode MÃƒÂ³vil:** ResoluciÃƒÂ³n de problema de legibilidad en dispositivos con esquema oscuro forzado. Se adaptaron las variables base de Tailwind y se agregÃƒÂ³ soporte explÃƒÂ­cito `dark:` en Inputs y contenedores.
- **Estructura Intranet (Fase 3):** ImplementaciÃƒÂ³n de Layout principal administrativo (`/dashboard/layout.tsx`) con **Sidebar Vertical** modular, soportando metadata de la OrganizaciÃƒÂ³n (SJM, Logos, Lemas) y navegaciÃƒÂ³n responsive con menÃƒÂº hamburguesa.
- **ActualizaciÃƒÂ³n Reversiva DB:** Se aÃƒÂ±adieron a `solicitudes_inscripcion` los campos `pais_ciudad`, `ministerio_actual` y `compromiso_pago_99usd`. ConfiguraciÃƒÂ³n de la `organizaciones` con `logo_url`, `lema` y ligas de QRs pÃƒÂºblicos. Sincronizado a NEON.

### v1.003 - 04 de Abril de 2026 - 19:42 CST
- **MÃƒÂ³dulo de Eventos (Backend):** ConexiÃƒÂ³n exitosa del formulario de registro con la base de datos Neon mediante arquitectura *Server Actions* de Next.js (`registrarSolicitudAction`).
- **Estados Visuales UI:** ImplementaciÃƒÂ³n de Disable (Bloqueo) y estado de carga ("Guardando...") para el botÃƒÂ³n de completado de registro, previniendo dobles envÃƒÂ­os. 

### v1.001 / v1.002 - 04 de Abril de 2026 - 19:35 CST
- **MÃƒÂ³dulo de Eventos (Frontend):** CreaciÃƒÂ³n de landing page dinÃƒÂ¡mica de captura en `/registro/[eventoId]`.
- **Formulario SJM:** Desarrollo del componente `<RegistroForm />` con React Hook Form y Zod. Patch TS Type en inferencia.
- **UI/UX Aesthetics:** Componentes adaptados de Shadcn (Button, Input, Label, Select) con diseÃƒÂ±o premium en tonos azules institucionales (`Tailwind v4`).
- **LÃƒÂ³gica Condicional:** Manejo del estatus de primer retiro, estado civil (Matrimonial/CÃƒÂ³nyuge).

### v1.000 - 04 de Abril de 2026 - 19:05 CST
- **Infraestructura Core:** InicializaciÃƒÂ³n de Next.js 15 (App Router) en \`sjm-platform\`.
- **Base de Datos:** Drizzle ORM configurado con cliente NEON Serverless.
- **MigraciÃƒÂ³n DB Exitosa:** DiseÃƒÂ±o Multi-Tenant y catÃƒÂ¡logos de OperaciÃƒÂ³n SJM en espaÃƒÂ±ol empujados a Neon (17 tablas creadas: \`organizaciones\`, \`sedes\`, \`eventos\`, \`usuarios\`, \`solicitudes_inscripcion\`, etc.).
- **PreparaciÃƒÂ³n Auth & UI:** InstalaciÃƒÂ³n fundacional de \`next-auth@beta\` y dependencias de \`shadcn/ui\`.
- **Repositorio Remoto Oficial:** CÃƒÂ³digo pusheado y enlazado a \`https://github.com/sergioaguilargranados-ai/SJM.git\`.

### v1.020 - 16 de Junio de 2026
- **Soporte Multimedia CMS:** IntegraciÃ³n de Vercel Blob para subir imÃ¡genes y actualizaciÃ³n de base de datos para soportar imagen_url, ideo_url y oto_url en secciones, testimonios y responsables.
- **GalerÃ­a de Fotos:** Nueva pestaÃ±a y CRUD implementado en el CMS para gestionar una galerÃ­a de fotos multi-tenant en diferentes pÃ¡ginas.

### v1.021 - 07 de Julio de 2026
- **Corrección Bug Imágenes CMS:** Se solucionó el problema por el cual la subida de imágenes a Vercel Blob se quedaba colgada, pasando directamente el archivo File en lugar de un Buffer (incompatible con Edge Actions).
- **Formulario RENASE (Captura de Solicitudes):** Se agregaron los campos 'Compartir habitación con (nombre y razón)' y 'Problema físico para subir escaleras' exclusivamente para el Itinerario de Viaje de la Solicitud (RegistroRenaseClient.tsx), mapeados a solicitudes_inscripcion sin alterar el catálogo de servidores.

### v1.022 - 07 de Julio de 2026
- **Prevención de Registros Duplicados:** Se implementó una lógica de UPSERT en egistrarRenaseAction para evitar múltiples inscripciones del mismo usuario en un mismo evento.
- **Gestión de Inscripciones (Admins):** Se habilitó la columna de acciones en la pantalla de asistentes para Super Admins, permitiendo eliminar y editar registros de inscripciones rápidamente.

### v1.196 - 07 de Julio de 2026 - 11:45 (CST)
- **Control de Versiones y Documentación:** Sincronización de la versión y fecha de compilación de la plataforma en landing, login y footer del intranet según lineamientos del contexto del proyecto.
