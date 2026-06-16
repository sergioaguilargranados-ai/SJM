# 📜 Histórico SJM PLATFORM • v1.191 • COMPILACIÓN: 16-06-2026 02:45 AM (CDMX)

**Última actualización:** 16 de Junio de 2026 - 02:45 AM (CDMX)
**Responsable:** AntiGravity AI Assistant

---

### v1.191 - 16 de Junio de 2026 - 02:45 AM (CDMX)

#### 🚀 Optimización de Rendimiento Frontend (Fase 1 y 2)
- **Caché en Server Actions:** Implementación sistemática de `unstable_cache` de Next.js en las funciones de lectura pública (`obtenerParametrosLanding`, `obtenerSeccionesPagina`, `obtenerTestimoniosAprobados`, `obtenerAgendaRetiros`, `obtenerProductos`, `obtenerCategorias`, etc.). Esta actualización minimiza drásticamente las consultas redundantes a la base de datos de Neon/Turso, reduciendo costos a $0 y logrando tiempos de respuesta de milisegundos (ISG-like behavior).
- **Optimización de Imágenes (LCP):** Refactorización completa de etiquetas estándar HTML `<img>` por el componente ultra-optimizado `<Image />` de `next/image` en las páginas públicas de Crecimientos, Media y Tienda. Se configuraron parámetros de `fill` y `sizes` condicionales para un renderizado responsivo (max-width: 768px 100vw, 33vw) y soporte al diseño premium de la arquitectura visual.
- **Diagnóstico de Vercel DB:** Se identificó que Vercel apuntaba a una base de datos antigua (Operadora) al heredar un viejo `.env`. El usuario actualizó la variable `DATABASE_URL` y `AUTH_SECRET` en la consola de Vercel para que las consultas de producción mapeen a la DB correcta (`serjema.com`).

---

### v1.190 - 16 de Junio de 2026 - 01:14 AM (CDMX)

#### 🎨 Integración Frontend del CMS Multimedia
- **Sección Nosotros:** Conectada con Server Actions para iterar dinámicamente las secciones y previsualizar imágenes/videos usando componentes consistentes de marca blanca.
- **Páginas de Ministerios:** (Jóvenes, Matrimonios, Mundo Infantil, Sanación Interior, etc.) Actualizadas de un estado "Próximamente" estático a páginas totalmente dinámicas e integradas con el CMS, utilizando `SeccionContenido` y listando `GaleriaPublica`.
- **Galería de Fotos:** Creado el componente interactivo de grilla de fotos (`GaleriaPublica`) conectado de extremo a extremo (base de datos, almacenamiento y presentación pública).
- **Tarjetas Dinámicas:**
  - **Contáctanos:** El equipo ahora se consulta de la base de datos de responsables y muestra dinámicamente sus fotos con fallback de iniciales.
  - **Testimonios:** Añadido soporte visual de la foto del perfil del autor (cuando no es anónimo).
- **Versión de Footer:** Actualización de la versión visible en el footer (`AppFooter` y pantalla de login) a formato horario de la Ciudad de México.

---

### v1.186 - 16 de Junio de 2026 - 00:15 CST

#### ðŸ—„ï¸� MigraciÃ³n de Almacenamiento a Vercel Blob
- **AWS S3 / Cloudflare R2:** Se eliminÃ³ la dependencia de `@aws-sdk/client-s3` y la lÃ³gica de subida de archivos hacia Cloudflare R2 debido a problemas de cuenta.
- **Vercel Blob:** Se integrÃ³ `@vercel/blob` para el guardado de imÃ¡genes, emulando la arquitectura de `operadora-dev`. Se actualizÃ³ `src/lib/storage.ts` para proveer la funciÃ³n `subirArchivoR2` adaptada internamente a Vercel Blob para mantener compatibilidad hacia atrÃ¡s.
- **Entorno:** Se aÃ±adiÃ³ `BLOB_READ_WRITE_TOKEN` al archivo local `.env.local`.

---

### v1.185 - 13 de Mayo de 2026 - 18:25 CST

#### ðŸ’° MÃ³dulo de Finanzas y Control de Gastos
- **GestiÃ³n de Egresos:** Se implementÃ³ el mÃ³dulo de gastos operativos (`/finanzas`) con desglose por evento. Permite registrar facturas, recibos y conceptos de gasto con categorizaciÃ³n dinÃ¡mica.
- **AnÃ¡lisis de Rentabilidad:** Nuevo motor de cÃ¡lculo financiero que compara ingresos reales (Inscripciones pagadas) contra gastos operativos, generando indicadores de margen neto y alertas de salud financiera.
- **Interfaz Premium:** DiseÃ±o de tarjetas de resumen financiero con micro-animaciones y modales de cristalerÃ­a (glassmorphism) para el registro de datos.

---

### v1.180 - 13 de Mayo de 2026 - 18:15 CST


#### ðŸ›¡ï¸� Refactor de Seguridad y Multi-tenancy (Triple Filtro)
- **Esquema de Base de Datos:** Se aÃ±adieron columnas `organizacion_id` con vinculaciÃ³n mandatoria a las tablas de `servidores`, `eventos`, `casas_retiro` y `solicitudes_inscripcion`. Esto asegura la integridad del aislamiento de datos por organizaciÃ³n (Marca Blanca).
- **Filtrado Estricto en Consultas:** Se refactorizÃ³ `src/app/actions/consultas.ts` para incluir validaciÃ³n de plan (`validarAccesoPlan`) y filtrado por `orgId` en todas las funciones de lectura. 
- **EstabilizaciÃ³n de SesiÃ³n:** Se actualizÃ³ el `AppTopbar` para manejar errores de sesiÃ³n del servidor y evitar fallos de hidrataciÃ³n (React Error #418), permitiendo una navegaciÃ³n fluida incluso en estados de "Invitado".

---

### v1.171 - 27 de Abril de 2026 - 21:50 CST


#### ðŸ“Š Reportes de InscripciÃ³n PDF/Excel Mejorados
- **TablaConsulta:** Se implementÃ³ una nueva propiedad `ocultarEnUI` en la interface de columnas, la cual permite incluir campos de datos (como el correo electrÃ³nico) en los reportes de exportaciÃ³n generados en PDF y Excel, manteniendo una interfaz de usuario limpia.
- **Inscripciones:** Se agregÃ³ la columna oculta de "Correo ElectrÃ³nico" (`correo`) para que la informaciÃ³n de contacto sea extraÃ­da exitosamente en los reportes tabulares, compliendo con el requerimiento de anÃ¡lisis de datos.
- **VersiÃ³n Sincronizada:** v1.171 lista en todos los accesos.

---

### v1.170 - 13 de Abril de 2026 - 12:00 CST

#### ðŸ“± EncapsulaciÃ³n MÃ³vil (PWA) Nativa
- **Progressive Web App (PWA):** ImplementaciÃ³n de la arquitectura PWA sin dependencias externas usando `manifest.json` y `sw.js` (Service Worker en raÃ­z) para permitir instalaciÃ³n nativa en dispositivos iOS y Android.
- **Registro de Service Worker:** Nuevo componente cliente `<PwaRegister />` inyectado en el `layout.tsx` maestro para activar el cacheo local y habilitar la solicitud de instalaciÃ³n ("AÃ±adir a Pantalla de Inicio").
- **VersiÃ³n Sincronizada:** v1.170 lista para despliegue automatizado.

---

### v1.167 - 12 de Abril de 2026 - 13:47 CST

#### ðŸŽ¨ AlineaciÃ³n Visual Intranet y Landing
- **Topbar Client (Intranet):** Se reestructurÃ³ la zona del logo para utilizar los mismos parÃ¡metros y formato visual que la `CenefaNavbar` (Landing Page).
- **Branding Parametrizado:** Ahora utiliza `tenant.logo_url` con fallback automÃ¡tico al logo oficial de SJM (`/logo-sjm-oficial.png`), eliminando el cuadro de texto genÃ©rico.
- **Lema Corporativo:** Se aÃ±adiÃ³ el lema debajo del nombre de la organizaciÃ³n en el Topbar, brindando paridad total con la landing page.
- **VersiÃ³n Sincronizada:** v1.167 en footers, login, landing y documentaciÃ³n.

---

### v1.166 - 11 de Abril de 2026 - 21:10 CST

#### ðŸŽ¨ AlineaciÃ³n Visual Intranet y Landing
- **Topbar Client (Intranet):** Se reestructurÃ³ la zona del logo para utilizar los mismos parÃ¡metros y formato visual que la `CenefaNavbar` (Landing Page).
- **Perfil de Usuario:** El componente de usuario en la Intranet ahora muestra la inicial/avatar alineada a la izquierda, seguida del primer nombre y con el **rol debajo** del nombre, imitando el estilo exacto que se diseÃ±Ã³ para la landing, brindando completa paridad visual.
- **AclaraciÃ³n Color MenÃº Vertical:** El AppSidebar actualmente usa dinÃ¡micamente `tenant.color_primario`. Si el color de selecciÃ³n estÃ¡ en azul, significa que en el mÃ³dulo *ConfiguraciÃ³n*, la OrganizaciÃ³n de SJM tiene asignado este color. El cÃ³digo permanece adaptativo hacia este valor en caso de que se actualice la configuraciÃ³n institucional.
- **VersiÃ³n Sincronizada:** v1.166 en footers y documentaciÃ³n.

---

### v1.165 - 10 de Abril de 2026 - 11:08 CST

#### âœ¨ Interfaz Premium y Micro-Interacciones
- **Hero Carrusel Animado:** (`HeroCarrusel.tsx`) Carrusel con auto-advance y transiciones fluidas de fundido y escalado, con soporte para imÃ¡genes y "shimmer" (brillo animado).
- **Animaciones Globales:** ImplementaciÃ³n nativa en `globals.css` para `.btn-glow` (resplandor de botÃ³n interactivo) y `.text-gradient-animated` para tÃ­tulos importantes.
- **Scroll Reveal Experiencial:** (`ScrollReveal.tsx`) IntegraciÃ³n inteligente de Intersection Observer para animaciones en pantalla al hacer scroll (`fade-in-up`).
- **Widget de WhatsApp Flotante:** (`WhatsAppWidget.tsx`) BotÃ³n flotante pulsante que detecta automÃ¡ticamente el nÃºmero de contacto de la OrganizaciÃ³n (Tenant) para re-dirigir a un chat en vivo.
- **ResoluciÃ³n de Errores Frontend:** SoluciÃ³n de re-renderizado (`Hydration Mismatch`) causados por `next-themes` en Next.js 16.1+, soluciÃ³n al error de Favicon y mitigaciÃ³n de errores de extensiones externas de Chrome.

#### ðŸ”— ConexiÃ³n DinÃ¡mica â€” PÃ¡ginas PÃºblicas al CMS

##### Infraestructura Multi-Tenant
- **`src/lib/tenant.ts`:** Nuevo resolver de tenant que identifica la organizaciÃ³n por dominio (`dominio_tenant`) con fallback a la primera organizaciÃ³n. Incluye `obtenerOrganizacionPorId()` con join a planes para compatibilidad con TenantData.
- La Landing (`page.tsx`) fue convertida a `SSR` y resuelve todos sus componentes compartiendo propiedades de organizaciÃ³n como el logotipo cargado y contactos.

##### PÃ¡ginas PÃºblicas Conectadas (8 pÃ¡ginas â—‹ â†’ Æ’)
- **`/` (Landing Page):** Logo central dinÃ¡mico y cenefas de navegaciÃ³n que reaccionan a los datos del Tenant.
- **`/nosotros`:** Consume `secciones_contenido` (pagina_clave: "nosotros") con fallback a contenido estÃ¡tico pre-llenado.
- **`/testimonios`:** Consume `testimonios` aprobados con calificaciÃ³n, autores y anonimato.
- **`/tienda`:** Consume `productos_tienda` y `categorias_producto` con grid visual, precios, stock bajo y empty state.
- **`/crecimientos`:** Consume `articulos_blog` (blog_clave: "crecimientos") con portada, extracto y fecha de publicaciÃ³n.
- **`/media`:** Consume `media_contenido` con colores por tipo (mÃºsica/podcast/video), badges de duraciÃ³n y miniaturas.
- **`/retiros-eventos`:** Consume `agenda_retiros` con joins a tipos_eventos y sedes, tarjetas tipo calendario.
- **`/ayuda`:** Consume `preguntas_frecuentes` con expand/collapse y `telefonos_emergencia` dinÃ¡micos.

##### PatrÃ³n de DiseÃ±o
- **HÃ­brido CMS-Fallback:** Todas las pÃ¡ginas consultan primero la BD; si no hay datos, muestran contenido estÃ¡tico de respaldo (nunca una pÃ¡gina vacÃ­a).
- **Empty States:** Tienda, Blog, Media y Retiros muestran estados vacÃ­os elegantes con iconos y texto "PrÃ³ximamente".

---

### v1.160 - 10 de Abril de 2026 - 09:58 CST

#### ðŸŽ›ï¸� Admin CMS + Server Actions (Fases 3-7)

##### Server Actions Layer (2 archivos nuevos)
- **`actions/contenido.ts`:** 30+ funciones de lectura/escritura para CMS (parametros_landing, secciones, testimonios, FAQ, telÃ©fonos, responsables, galerÃ­a, letreros, media, blog, agenda).
- **`actions/tienda.ts`:** 20+ funciones para tienda online (productos, categorÃ­as, pedidos con folio auto-incremental, formas de entrega, medios de pago, descuento de stock automÃ¡tico).

##### MÃ³dulos Admin Intranet (5 nuevas pÃ¡ginas)
- **`/configuracion/contenido`:** Admin CMS con 6 tabs (Secciones por pÃ¡gina, Branding con color pickers, Testimonios con aprobar/rechazar, FAQ, TelÃ©fonos, Equipo directivo).
- **`/configuracion/tienda`:** Admin Tienda con 4 tabs (Productos con grid visual, CategorÃ­as, Pedidos con cambio de estatus, EnvÃ­os y Medios de Pago).
- **`/configuracion/blog`:** Admin Blog con publicar/despublicar, editor con blog_clave (crecimientos/formaciÃ³n/general), categorÃ­as y extractos.
- **`/configuracion/media`:** Admin Multimedia con filtro por tipo, grid visual con miniaturas, CRUD de mÃºsica/podcasts/videos con URL externo.
- **`/configuracion/agenda`:** Admin Agenda de Retiros con tarjetas tipo calendario, joins a tipos_eventos y sedes, formulario completo de programaciÃ³n.

##### Sidebar Actualizado
- Nueva secciÃ³n "Sitio Web" en el sidebar con 5 opciones CMS (Contenido, Tienda, Blog, Media, Agenda).

##### Build
- Verificado exitoso con **30 pÃ¡ginas** (25 anteriores + 5 admin nuevas), **0 errores**.


---


### v1.150 - 10 de Abril de 2026 - 04:35 CST

#### ðŸ�—ï¸� TransformaciÃ³n Landing Marca Blanca â€” Fase 1 & 2

##### Base de Datos (17 tablas nuevas)
- **`parametros_landing`:** ConfiguraciÃ³n completa del sitio por org (colores con clave, cenefa, footer degradado, carrusel, videos, WhatsApp QR, Google Maps, orden de secciones).
- **`secciones_contenido`:** CMS parametrizado para todas las pÃ¡ginas (tÃ­tulo, subtÃ­tulo, contenido, autorÃ­a, imagen, video, menÃº tarjeta, liga a funciÃ³n de permisos).
- **`telefonos_emergencia`:** TelÃ©fonos de emergencia y administraciÃ³n con WhatsApp QR.
- **`responsables_organizacion`:** Directivos con foto, cargo, mensaje de saludo.
- **`testimonios`:** Sistema de testimonios parametrizados con soporte anÃ³nimo y aprobaciÃ³n.
- **`preguntas_frecuentes`:** FAQ parametrizadas por pÃ¡gina.
- **`galeria_fotos`:** GalerÃ­a de fotos por pÃ¡gina para cintas/collages.
- **`letreros_especiales`:** Letreros parametrizados (ELEMA KIDS, ELEMÃ�, etc.) con fuente y estilo.
- **`categorias_producto`:** CategorÃ­as para tienda online.
- **`productos_tienda`:** Productos con precio, stock, SKU, imÃ¡genes.
- **`pedidos_web`:** Pedidos con datos de cliente, financieros, y entrega.
- **`detalle_pedido`:** LÃ­neas de pedido.
- **`formas_entrega`:** Formas de entrega parametrizadas.
- **`textos_medios_pago`:** Instrucciones de medios de pago.
- **`notificaciones_tienda`:** Plantillas de notificaciÃ³n de tienda.
- **`agenda_retiros`:** Calendario de retiros pÃºblicos.
- **`articulos_blog`:** ArtÃ­culos de blog (Crecimientos, FormaciÃ³n).
- **`media_contenido`:** MÃºsica, Podcasts, Videos con URLs externas.

##### Componentes Globales
- **`CenefaNavbar`:** Cenefa traslÃºcida al 70% + navbar integrada con todas las pÃ¡ginas, soporte de sesiÃ³n, menÃº mÃ³vil.
- **`FooterPublico`:** Footer alto con degradado negro a gris, parametrizado (navegaciÃ³n, recursos, contacto, redes sociales).
- **`ComponentesLanding`:** TarjetaMenuSeccion, SeccionContenido, CarruselImagenes, CintaFotosVertical, LetreroEspecial.
- **Layout `(public)`:** Layout compartido con cenefa + footer para todas las pÃ¡ginas pÃºblicas.

##### PÃ¡gina Principal RediseÃ±ada (14 secciones)
- Cenefa 70% sticky, carrusel parametrizable, bienvenida con logo grande, "No estÃ¡s solo", retiros, matrimonios, jÃ³venes, mundo infantil, testimonios, tienda, centros, donaciones, ayuda, contacto.

##### 17 PÃ¡ginas PÃºblicas
- `/nosotros` â€” 8 secciones completas con contenido pre-llenado de serjema.com.mx
- `/contactanos` â€” Formulario, tarjetas de contacto, equipo directivo, redes sociales
- `/testimonios` â€” Testimonios con CTA para agregar (anÃ³nimo)
- `/donativos` â€” Datos bancarios reales, impactos, 3 mÃ©todos de pago
- `/jovenes` â€” ELEMÃ� con letrero colorido juvenil
- `/matrimonios` â€” Plenitud Matrimonial con colores amorosos
- `/sanacion-interior` â€” Magnificat con cita bÃ­blica
- `/mundo-infantil` â€” ELEMA KIDS con colores pastel vivos, juegos, trivias, videos
- `/llama-de-amor` â€” OraciÃ³n, telÃ©fonos emergencia, placeholder agente IA
- `/centros` â€” 8 sedes pre-llenadas con links Facebook
- `/retiros-eventos` â€” Placeholder para agenda interactiva
- `/ayuda` â€” 3 categorÃ­as (Espiritual, PsicolÃ³gica, TÃ©cnica)
- `/tienda` â€” Placeholder para catÃ¡logo (modelo ERPCubox)
- `/media` â€” Tabs MÃºsica/Podcasts/Videos estilo YouTube
- `/crecimientos` â€” Blog de crecimientos
- `/formacion` â€” Blog de formaciÃ³n + E-Learning
- `/blog` â€” Blog migrado con artÃ­culos pre-llenados

##### Infraestructura
- **Middleware:** Agregadas 17 rutas pÃºblicas nuevas.
- **MigraciÃ³n:** Eliminadas las pÃ¡ginas antiguas `/blog`, `/donativos`, `/tienda` con nav/footer estÃ¡ticos propios.
- **CSS:** Animaciones de carrusel vertical, fade-in-up, scroll suave global.
- **Build:** Verificado exitosamente (25 pÃ¡ginas, 0 errores).

---

### v1.140 - 10 de Abril de 2026 - 00:55 CST

#### MÃ³dulo Completo de GestiÃ³n de Accesos (RBAC)
- **Matriz de Permisos:** Nueva interfaz en `/configuracion/permisos` que permite activar/desactivar permisos (Ver, Crear, Editar, Eliminar) por cada mÃ³dulo del sistema de forma granular.
- **GestiÃ³n de Usuarios:** Nuevo mÃ³dulo en `/configuracion/usuarios` para listar el equipo y asignar roles dinÃ¡micamente mediante un diÃ¡logo de gestiÃ³n.
- **Estructura de Sistema (Seed):** Se poblÃ³ la base de datos con la jerarquÃ­a completa de MÃ³dulos (Dashboard, Servidores, Eventos, Finanzas, etc.) para habilitar el control granular.
- **Acciones Flexibles:** ImplementaciÃ³n de `upsertRolAction`, `actualizarPermisosRolAction` y `asignarRolUsuarioAction` para una gestiÃ³n reactiva.
- **UI Components:** IntegraciÃ³n de componentes Radix (`Checkbox`, `Select`) estilizados con la identidad visual SJM (#00B4AA).
- **Consistencia:** ActualizaciÃ³n de Sidebar para incluir "Equipo y Usuarios" y sincronizaciÃ³n de versiones.

---

### v1.125 - 09 de Abril de 2026 - 17:08 CST

#### IntegraciÃ³n WhatsApp Twilio
- **whatsappService.ts:** Servicio Twilio con inicializaciÃ³n lazy (mismo patrÃ³n que Resend). Soporte para cÃ³digo de paÃ­s MÃ©xico automÃ¡tico.
- **Bienvenida WhatsApp:** Al registrarse con celular, se envÃ­a mensaje de bienvenida por WhatsApp ademÃ¡s del email.
- **RecuperaciÃ³n por WhatsApp:** Cuando solicitan recuperaciÃ³n por celular, el enlace se envÃ­a tanto por email como por WhatsApp.
- **Mensajes predefinidos:** `mensajeBienvenidaWhatsApp()` y `mensajeRecuperacionWhatsApp()` con formato markdown de WhatsApp.
- **Fix MenÃº Intranet:** Se corrigiÃ³ la visibilidad del menÃº para el tenant principal (SJM), promoviendo al usuario administrador a "Super Administrador" y activando el flag `es_admin_sistema` en los roles de gestiÃ³n. Esto restaura las opciones de navegaciÃ³n que se ocultaron tras la implementaciÃ³n del sistema RBAC granular.
- **VersiÃ³n Sincronizada:** v1.125 en Landing, Login, Registro e Intranet.

---

### v1.120 - 09 de Abril de 2026 - 14:50 CST

#### RecuperaciÃ³n de ContraseÃ±a Completa
- **Tabla `tokens_recuperacion`:** Nueva tabla para tokens de recuperaciÃ³n con expiraciÃ³n (1 hora) y uso Ãºnico. Sincronizada con Neon.
- **PÃ¡gina `/recuperar`:** Formulario para solicitar recuperaciÃ³n por correo o celular. EnvÃ­a email con enlace seguro vÃ­a Resend.
- **PÃ¡gina `/recuperar/[token]`:** Formulario para nueva contraseÃ±a con validador de fortaleza. 4 estados: validando, invÃ¡lido, formulario, Ã©xito.
- **Server Actions:** `solicitarRecuperacionAction`, `validarTokenAction`, `restablecerContrasenaAction` â€” Flujo seguro end-to-end.
- **Seguridad:** No revela si el correo/celular existe (protecciÃ³n contra enumeraciÃ³n). Tokens single-use con bcrypt hash.
- **Link en Login:** El "Â¿Olvidaste tu contraseÃ±a?" ya apunta a `/recuperar`.
- **VersiÃ³n Sincronizada:** v1.120.

---

### v1.115 - 09 de Abril de 2026 - 14:25 CST

#### Navbar con SesiÃ³n, Perfil de Usuario y Email Resend
- **NavbarPublica:** Nuevo componente cliente que muestra avatar y dropdown con opciones cuando el usuario estÃ¡ logueado (Mi Perfil, Dashboard, Cerrar SesiÃ³n). BotÃ³n "Acceso" cuando no lo estÃ¡. MenÃº hamburguesa responsive.
- **AuthProvider:** SessionProvider de NextAuth agregado al layout raÃ­z para soportar `useSession()` en toda la app.
- **PÃ¡gina `/perfil`:** Interfaz premium con avatar, datos personales editables, toggle "Soy Servidor SJM" con selector de sede. Al guardar se actualiza la DB.
- **Server Action `actualizarPerfilAction`:** Backend para actualizar nombre, celular, fecha nacimiento, estatus servidor y sede.
- **Resend Email Service:** `emailService.ts` con inicializaciÃ³n lazy para evitar crash en build. `emailTemplate.ts` con plantilla HTML corporativa SJM.
- **Email de Bienvenida:** Se envÃ­a automÃ¡ticamente al registrarse (Google o credenciales).
- **Middleware:** Ruta `/perfil` protegida, `/recuperar` pÃºblica.
- **VersiÃ³n Sincronizada:** v1.115.

---

### v1.110 - 09 de Abril de 2026 - 13:00 CST

#### Sistema de AutenticaciÃ³n y Registro Completo (Fase 1)
- **Auto-creaciÃ³n con Google:** El callback `signIn` ahora crea automÃ¡ticamente usuarios nuevos en la DB con rol "General" al acceder con Google. Ya no muestra "Acceso Denegado".
- **Provider de Credenciales:** Nuevo provider `Credentials` en NextAuth para login por correo/contraseÃ±a y celular/contraseÃ±a con verificaciÃ³n bcrypt.
- **PÃ¡gina `/registro`:** Interfaz Glassmorphism con 3 modos de registro (Google, Correo, Celular). Incluye validador visual de fortaleza de contraseÃ±a en tiempo real.
- **Server Action `registrarUsuarioAction`:** Backend de registro con validaciÃ³n, hash bcrypt, detecciÃ³n de duplicados y asignaciÃ³n automÃ¡tica de rol.
- **Rol "General":** Nuevo rol auto-creado para usuarios que se registran por su cuenta, con acceso a portal pÃºblico, inscripciones y perfil.
- **Esquema DB:** Campos `fecha_nacimiento` y `es_servidor` agregados a tabla `usuarios`. Sincronizado con Neon.
- **Dependencia:** `bcryptjs` instalado para hash de contraseÃ±as.
- **VersiÃ³n Sincronizada:** v1.110.

---

### v1.102 - 09 de Abril de 2026 - 12:00 CST

#### Build Fix: Static Prerendering
- **auth/error/page.tsx:** Se envolviÃ³ el contenido que usa `useSearchParams` en un boundary de `<Suspense />`. Esto es mandatorio en Next.js para permitir la generaciÃ³n estÃ¡tica de pÃ¡ginas que dependen de parÃ¡metros de bÃºsqueda del lado del cliente.
- **VersiÃ³n Sincronizada:** v1.102.

---

### v1.101 - 09 de Abril de 2026 - 11:55 CST

#### Build Fix: Missing Assets
- **AppSidebar.tsx:** Se aÃ±adiÃ³ el import de `ShieldCheck` de `lucide-react` que causaba fallo de compilaciÃ³n.
- **VersiÃ³n Sincronizada:** v1.101.

---

### v1.100 - 09 de Abril de 2026 - 11:50 CST (Hito 100)

#### Build Fix: Tenant Identity
- **TenantProvider.tsx:** SincronizaciÃ³n de la interfaz `TenantData` con el objeto `TENANT_DEFAULT`. Se aÃ±adiÃ³ la propiedad `plan` requerida para evitar fallos de compilaciÃ³n en Vercel.
- **Hito:** 100 versiones de evoluciÃ³n continua.
- **VersiÃ³n Sincronizada:** v1.100.

---

### v1.099 - 09 de Abril de 2026 - 11:10 CST

#### Build Fix: TypeScript & UI
- **auth/error/page.tsx:** EliminaciÃ³n de propiedad `asChild` no compatible con el componente `Button` actual. Se refactorizÃ³ la navegaciÃ³n usando envoltorios `Link` estÃ¡ndar.
- **VersiÃ³n Sincronizada:** v1.099.

---

### v1.098 - 09 de Abril de 2026 - 10:55 CST

#### Build Fix: TypeScript Typings
- **permisos.ts:** Se aÃ±adiÃ³ el retorno explÃ­cito de `{ session, orgId, planClave }` en `validarAccesoPlan` para corregir errores de tipado en pÃ¡ginas de consulta.
- **VersiÃ³n Sincronizada:** v1.098.

---

### v1.097 - 09 de Abril de 2026 - 10:45 CST

#### Build Fix: Syntax Object Close
- **permisos.ts:** CorrecciÃ³n de cierre de objeto `accesos` (falta de `;}`).
- **VersiÃ³n Sincronizada:** v1.097.

---

### v1.096 - 09 de Abril de 2026 - 10:40 CST

#### Build Fix: Turbopack & Syntax
- **permisos.ts:** CorrecciÃ³n de error de sintaxis (llave de cierre faltante en `validarAccesoPlan`) que impedÃ­a la compilaciÃ³n en Vercel.
- **Importaciones:** Se aÃ±adieron las tablas de schema faltantes en el mÃ³dulo de permisos para el RBAC granular.
- **VersiÃ³n Sincronizada:** v1.096.

---

### v1.095 - 09 de Abril de 2026 - 10:15 CST

#### Fix CrÃ­tico AutenticaciÃ³n y Despliegue
- **PÃ¡gina de Error NextAuth:** CreaciÃ³n de `src/app/auth/error/page.tsx` para manejar errores de `AccessDenied` con UI premium, eliminando el error 404.
- **SincronizaciÃ³n Neon:** EjecuciÃ³n de `drizzle-kit push` para homologar la existencia de `organizacion_id` en `roles_sistema`.
- **InyecciÃ³n de Administradores:** EjecuciÃ³n de script de reparaciÃ³n para autorizar correos de Sergio Aguilar as Super Admins.
- **VersiÃ³n Sincronizada:** ActualizaciÃ³n global a v1.095 en footers y documentaciÃ³n.

---

### v1.090 - 08 de Abril de 2026 - 16:55 CST

#### Arquitectura SaaS y Seguridad Granular (Â¡MANDATORIO!)
- **Triple Filtro de Seguridad:** ImplementaciÃ³n de capas de validaciÃ³n en cascada:
  1. **Plan (SaaS):** ValidaciÃ³n de mÃ³dulos permitidos (`landing`, `admin`, `premium`).
  2. **Rol (RBAC):** Filtrado de acciones por permiso (`view`, `create`, `edit`, `delete`, `export`).
  3. **OrganizaciÃ³n (Multi-tenancy):** Aislamiento estricto de datos por `organizacion_id`.
- **Sidebar Parametrizado:** El menÃº lateral ahora es 100% dinÃ¡mico. Oculta/Muestra opciones basado en el Plan de la Org y los Permisos del Rol del usuario simultÃ¡neamente.
- **Helper `validarAccesoPlan`:** FunciÃ³n centralizada para proteger Server Components y redirigir al Dashboard si el nivel de suscripciÃ³n es insuficiente.

#### Interfaz Premium y UX
- **Login v1.080:** RediseÃ±o con estÃ©tica *Glassmorphism*, estados dinÃ¡micos para acceso por Correo/Celular e Ã­cono de Google en SVG puro. Se aÃ±adiÃ³ flujo de registro.
- **Notificaciones Premium:** Sistema `SjmToast` con diseÃ±o translÃºcido (60% transparencia), indicadores de estado circulares y tipografÃ­a oficial.
- **Identidad:** ConfiguraciÃ³n de Favicon oficial y metadatos SEO.

#### MÃ³dulos y Persistencia
- **Mantenimiento de Permisos:** Nueva pantalla para gestiÃ³n de Roles y visualizaciÃ³n de planes habilitada en ConfiguraciÃ³n.
- **MÃ³dulos Maestros Activados:** Servidores, Documentos, Sedes, Ministerios y Tipos de Eventos actualizados con seguridad granular y filtrado multi-tenant.
- **ConfiguraciÃ³n Real:** MigraciÃ³n de la vista de organizaciÃ³n de prototipo a Server Action funcional con persistencia en PostgreSQL.

---

### v1.070 - 08 de Abril de 2026 - 12:00 CST
- **Esquema SaaS:** EvoluciÃ³n del modelo de base de datos para soportar Planes -> MÃ³dulos -> Funciones -> Acciones.
- **Seed Script:** ActualizaciÃ³n del script de semilla para inicializar la jerarquÃ­a de permisos nacional.
- **TenantProvider:** InyecciÃ³n de informaciÃ³n del Plan en el contexto del cliente.

---

### v1.060 - 07 de Abril de 2026 - 16:40 CST

#### Herramientas de Desarrollo (Fase 1)
- **Workflows automatizados:** CreaciÃ³n de 4 workflows en `.agents/workflows/`:
  - `/build` â€” CompilaciÃ³n y verificaciÃ³n TypeScript
  - `/version` â€” ActualizaciÃ³n de versiÃ³n en 4 archivos (layout, landing, login, histÃ³rico)
  - `/deploy` â€” Commit y push a GitHub con auto-deploy a Vercel
  - `/database` â€” Migraciones Drizzle ORM a Neon PostgreSQL
- **AGENTS.md actualizado:** Referencia rÃ¡pida completa del proyecto con credenciales, convenciones, checklist pre-commit y listado de workflows.
- **AG-Contexto-Proyecto.md enriquecido:** Secciones nuevas de Herramientas de Desarrollo y EstÃ¡ndar de Tema Claro/Oscuro.

#### Fix Tema Claro/Oscuro (Fase 4)
- **Bug CrÃ­tico resuelto:** El toggle Sol/Luna no funcionaba porque `globals.css` usaba `@media (prefers-color-scheme: dark)` en lugar del selector `.dark` que usa `next-themes`. **Corregido.**
- **Sistema de CSS Variables completo:** 12 variables de diseÃ±o (background, foreground, surface, card, muted, accents) con valores para tema claro y oscuro.
- **Componentes UI corregidos:**
  - `button.tsx` â€” Variantes `outline`, `secondary`, `ghost` y `link` ahora tienen `dark:` classes
  - `label.tsx` â€” Texto visible en dark mode (`dark:text-slate-200`)
  - `dialog.tsx` â€” Fondo y bordes explÃ­citos para dark mode (`dark:bg-[#1a1b26]`, `dark:border-[#2a2b3d]`)
- **Paleta Dark Mode documentada:** Tokens estandarizados para que todo componente futuro use los mismos colores.

#### Infraestructura
- **Build:** âœ… TypeScript sin errores, 28 rutas funcionales
- **VersiÃ³n sincronizada** en layout.tsx, page.tsx, login/page.tsx

---

### v1.055 - 06 de Abril de 2026 - 02:35 CST

#### Multi-Tenant Real (Fase 3)
- **Auth reescrito:** InyecciÃ³n de `organizacion_id`, `sede_id`, `rol_id`, `nombre_completo` en la sesiÃ³n JWT. Se declaran tipos NextAuth extendidos.
- **Helper `getUsuarioSesion()`:** FunciÃ³n server-side para obtener datos del usuario con redirect automÃ¡tico a `/login`. Variante `getUsuarioSesionOpcional()` sin redirect.  
- **Topbar con datos reales:** Nombre, correo, foto de perfil (Google) y rol del usuario logueado. BotÃ³n de logout funcional con `signOut()`.
- **Filtrado por organizaciÃ³n:** PÃ¡ginas de Sedes, Ministerios, Tipos de Eventos, Servidores y Documentos filtran datos por `organizacion_id` del usuario autenticado.

#### Export Excel (Fase 5)
- **Utilidad `generarExcel.ts`:** GeneraciÃ³n de reportes Excel (.xlsx) con tÃ­tulo, fecha, auto-resize de columnas y merge de headers. Usa librerÃ­a `xlsx`.
- **BotÃ³n Excel en `TablaConsulta`:** BotÃ³n verde "Excel" junto al PDF en la barra de filtros. Funciona en todas las 14 pantallas de consulta.

#### Sitio PÃºblico Completo (Fase 6)
- **Landing Page rediseÃ±ada:** 10 secciones con contenido real de serjema.com.mx:
  1. Hero â€” "Un Don del EspÃ­ritu Santo en nuestro tiempo" con cita de Benedicto XVI
  2. Carisma â€” MisiÃ³n, visiÃ³n y filosofÃ­a SJM
  3. Ministerios (4) â€” EvangelizaciÃ³n, Pastoral de la Salud, Caridad, ComunicArte
  4. Programas (5) â€” CreeSer, Magnificat, ELEMÃ�, Agitadores de Agua, Plenitud Financiera
  5. Retiros CTA â€” "Evangelizarte para Sanarte" con inscripciÃ³n directa
  6. Testimonios (3) â€” Con rating de estrellas
  7. Centros SJM (8) â€” Guadalajara, Toluca, Chiapas, Zacatecas, Aguascalientes, Playa del Carmen, CancÃºn, Cozumel
  8. FAQ (5) â€” Preguntas frecuentes con acordeones nativos
  9. Donativos CTA â€” Llamado a donar con gradient banner
  10. Contacto â€” Email, Instagram, Facebook del Director General
- **PÃ¡gina Blog** (`/blog`): 4 artÃ­culos estÃ¡ticos con categorÃ­as y diseÃ±o tipo medium.
- **PÃ¡gina Tienda** (`/tienda`): 6 productos con precios, botones de agregar al carrito, y nota de envÃ­os nacionales.
- **PÃ¡gina Donativos** (`/donativos`): 3 mÃ©todos de donaciÃ³n (transferencia bancaria, en lÃ­nea prÃ³ximamente, contacto directo), mÃ©tricas de impacto, CTA con WhatsApp.
- **Navbar pÃºblico sticky** con glassmorphism en todas las pÃ¡ginas pÃºblicas.
- **Footer completo** con 4 columnas: branding, navegaciÃ³n, recursos, contacto y redes sociales.

#### Infraestructura
- **28 rutas funcionales** (8 estÃ¡ticas, 20 dinÃ¡micas).
- **Middleware protege 10 rutas** del intranet.
- **Build:** âœ… TypeScript sin errores, producciÃ³n lista.

---

### v1.040 - 05 de Abril de 2026 - 13:05 CST
- **ImplementaciÃ³n Masiva de CatÃ¡logos y Movimientos:** ConstrucciÃ³n completa de 14 pantallas nuevas siguiendo el patrÃ³n ERPCubox con soporte nativo modo claro/oscuro.
- **Componente Reutilizable `TablaConsulta`:** Componente React Client genÃ©rico que incluye:
  - Filtro por bÃºsqueda de texto (multi-campo).
  - Filtro por rango de fechas (Desde/Hasta) con campos `type="date"`.
  - BotÃ³n de exportaciÃ³n PDF con generaciÃ³n automÃ¡tica vÃ­a `jsPDF + autoTable`.
  - Contador de registros filtrado vs total.
  - BotÃ³n "Limpiar" filtros.
- **Componente `ModalCatalogo`:** Modal reutilizable para altas de catÃ¡logos simples con backdrop cerrado (patrÃ³n SJM).
- **Componente `generarPDF`:** Utilidad de generaciÃ³n de reportes PDF con header corporativo azul SJM, paginaciÃ³n y pie de pÃ¡gina.
- **CatÃ¡logos Nuevos (7):**
  - `/catalogos/sedes` â€” AdministraciÃ³n de Sedes
  - `/catalogos/ministerios` â€” CatÃ¡logo de Ministerios (MÃºsica, Liturgia, etc.)
  - `/catalogos/cargos` â€” CatÃ¡logo de Cargos (Coordinador, Apoyo, etc.)
  - `/catalogos/tipos-eventos` â€” Tipos de Eventos con indicador matrimonial
  - `/catalogos/casas-retiro` â€” Casas de Retiro con datos operativos completos
  - `/catalogos/clasificaciones-gasto` â€” Clasificaciones de Gasto
  - `/catalogos/estados` â€” Estados de la RepÃºblica
- **Movimientos y Consultas Nuevos (4):**
  - `/inscripciones` â€” Consulta completa de inscripciones con filtros por fecha, estatus y texto
  - `/finanzas` â€” MÃ³dulo financiero con KPIs resumen y tabla de gastos por evento
  - `/documentos` â€” Gestor Documental institucional con nivel de acceso por rol
  - `/evaluaciones` â€” Evaluaciones post-evento con calificaciones en estrellas
- **Refactor de Servidores:** PÃ¡gina refactorizada para usar `TablaConsulta` con filtros y PDF.
- **Sidebar Completo:** ReorganizaciÃ³n con secciones OperaciÃ³n, CatÃ¡logos (submenÃº colapsable accordion), y Sistema.
- **Server Actions Completos (`catalogos.ts`):** Backend de consultas con joins para todos los catÃ¡logos y movimientos del esquema.
- **Dependencias:** `jspdf` y `jspdf-autotable` instaladas para generaciÃ³n de PDF del lado del cliente.
- **Build Verification:** âœ… TypeScript sin errores, build exitoso con 23 rutas funcionales.

---


### v1.010 - 05 de Abril de 2026 - 00:35 CST
- **MÃ³dulo Capital Humano (Servidores):** Se crea el Server Action `getServidores` conectando la tabla `servidores` con `usuarios` y `sedes` a travÃ©s de Left Joins en Drizzle ORM.
- **CatÃ¡logo UI:** ImplementaciÃ³n de la vista `/dashboard/servidores` utilizando arquitectura SaaS ERPCubox, renderizando el padrÃ³n general con microcomponentes condicionales de estatus ("Activo"/"Baja"). Soporte nativo para modo oscuro y claro.

### v1.008 - 05 de Abril de 2026 - 00:25 CST
- **HomologaciÃ³n Visual ERPCubox (Filtro Oscuro):** ReestructuraciÃ³n masiva del Frontend (Layout y Panel de Control) aplicando la estÃ©tica, espaciado y arquitectura SaaS "Marca Blanca" del sistema base ERPCubox.
- **TopBar Horizontal:** SeparaciÃ³n del Drawer y Logo al formato Topbar (`AppTopbar.tsx`) con selectores visuales de Branch (Sede) e iconos de sistema.
- **Sidebar UX:** ModificaciÃ³n de `AppSidebar` a estÃ©tica `#1a1b26` con Tabs activos en color Primario (`#e11d48`).
- **MÃ³dulo de EdiciÃ³n Multi-Tab:** RediseÃ±o completo de `/dashboard/configuracion` imitando el "Editar Empresa" a la perfecciÃ³n (General, Dominio y Acceso, Contacto). Mapeo de nuevos campos sociales y URLs.
- **Base de Datos Extendida:** Empuje en Neon de columnas funcionales SaaS estÃ¡ndar (`whatsapp_contacto`, `horarios_atencion`, `direccion_completa`, `facebook_url`, `instagram_url`, `youtube_url`).

### v1.006 / v1.007 - 04 de Abril de 2026 - 23:55 CST
- **Server Action Reportes:** Se crea el backend de consulta `getInscripciones` jalando datos dinÃ¡micos directos de PostgreSQL/Drizzle, descartan cachÃ© rÃ­gida estÃ¡tica (Next.js 15).
- **CatÃ¡logo Intranet (Eventos):** Se da vida a la secciÃ³n `/dashboard/eventos` generando el Listado de Capturas mediante una Data Table analÃ­tica. Incluye parseo de fechas (`date-fns`), estatus visuales, condicionales lÃ³gicos para primer ingreso y UI React Server Components.

### v1.005 - 04 de Abril de 2026 - 23:45 CST
- **ParametrizaciÃ³n de OrganizaciÃ³n:** ActualizaciÃ³n del esquema `organizaciones` mediante Drizzle para incluir los campos dinÃ¡micos `color_primario` y `color_secundario`.
- **Panel de Control ConfiguraciÃ³n:** ConstrucciÃ³n del mÃ³dulo UI `/dashboard/configuracion` con soporte a modo claro/oscuro, integrando selectores de color hexadecimal (Color Pickers), URL del logotipo institucional y datos de contacto para generaciÃ³n de cÃ³digos QR pÃºblicos.

### v1.004 - 04 de Abril de 2026 - 22:50 CST
- **Formulario Diplomado:** CreaciÃ³n del componente especializado `<RegistroDiplomadoForm />` para captura del diplomado on-line, incluyendo validaciones de 99 USD.
- **Fix Dark Mode MÃ³vil:** ResoluciÃ³n de problema de legibilidad en dispositivos con esquema oscuro forzado. Se adaptaron las variables base de Tailwind y se agregÃ³ soporte explÃ­cito `dark:` en Inputs y contenedores.
- **Estructura Intranet (Fase 3):** ImplementaciÃ³n de Layout principal administrativo (`/dashboard/layout.tsx`) con **Sidebar Vertical** modular, soportando metadata de la OrganizaciÃ³n (SJM, Logos, Lemas) y navegaciÃ³n responsive con menÃº hamburguesa.
- **ActualizaciÃ³n Reversiva DB:** Se aÃ±adieron a `solicitudes_inscripcion` los campos `pais_ciudad`, `ministerio_actual` y `compromiso_pago_99usd`. ConfiguraciÃ³n de la `organizaciones` con `logo_url`, `lema` y ligas de QRs pÃºblicos. Sincronizado a NEON.

### v1.003 - 04 de Abril de 2026 - 19:42 CST
- **MÃ³dulo de Eventos (Backend):** ConexiÃ³n exitosa del formulario de registro con la base de datos Neon mediante arquitectura *Server Actions* de Next.js (`registrarSolicitudAction`).
- **Estados Visuales UI:** ImplementaciÃ³n de Disable (Bloqueo) y estado de carga ("Guardando...") para el botÃ³n de completado de registro, previniendo dobles envÃ­os. 

### v1.001 / v1.002 - 04 de Abril de 2026 - 19:35 CST
- **MÃ³dulo de Eventos (Frontend):** CreaciÃ³n de landing page dinÃ¡mica de captura en `/registro/[eventoId]`.
- **Formulario SJM:** Desarrollo del componente `<RegistroForm />` con React Hook Form y Zod. Patch TS Type en inferencia.
- **UI/UX Aesthetics:** Componentes adaptados de Shadcn (Button, Input, Label, Select) con diseÃ±o premium en tonos azules institucionales (`Tailwind v4`).
- **LÃ³gica Condicional:** Manejo del estatus de primer retiro, estado civil (Matrimonial/CÃ³nyuge).

### v1.000 - 04 de Abril de 2026 - 19:05 CST
- **Infraestructura Core:** InicializaciÃ³n de Next.js 15 (App Router) en \`sjm-platform\`.
- **Base de Datos:** Drizzle ORM configurado con cliente NEON Serverless.
- **MigraciÃ³n DB Exitosa:** DiseÃ±o Multi-Tenant y catÃ¡logos de OperaciÃ³n SJM en espaÃ±ol empujados a Neon (17 tablas creadas: \`organizaciones\`, \`sedes\`, \`eventos\`, \`usuarios\`, \`solicitudes_inscripcion\`, etc.).
- **PreparaciÃ³n Auth & UI:** InstalaciÃ³n fundacional de \`next-auth@beta\` y dependencias de \`shadcn/ui\`.
- **Repositorio Remoto Oficial:** CÃ³digo pusheado y enlazado a \`https://github.com/sergioaguilargranados-ai/SJM.git\`.

### v1.020 - 16 de Junio de 2026
- **Soporte Multimedia CMS:** Integración de Vercel Blob para subir imágenes y actualización de base de datos para soportar imagen_url, ideo_url y oto_url en secciones, testimonios y responsables.
- **Galería de Fotos:** Nueva pestaña y CRUD implementado en el CMS para gestionar una galería de fotos multi-tenant en diferentes páginas.
