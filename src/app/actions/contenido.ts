"use server";

import { db } from "@/lib/db";
import { 
  parametros_landing, secciones_contenido, telefonos_emergencia,
  responsables_organizacion, testimonios, preguntas_frecuentes,
  galeria_fotos, letreros_especiales, media_contenido, articulos_blog,
  agenda_retiros, tipos_eventos, sedes, casas_retiro
} from "@/lib/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============================================================
// ACCIONES DE LECTURA — Para las páginas públicas
// ============================================================

/** Obtener parámetros de landing por organización */
export async function obtenerParametrosLanding(organizacionId: string) {
  const [resultado] = await db
    .select()
    .from(parametros_landing)
    .where(eq(parametros_landing.organizacion_id, organizacionId))
    .limit(1);
  return resultado || null;
}

/** Obtener secciones de contenido por página */
export async function obtenerSeccionesPagina(organizacionId: string, paginaClave: string) {
  return db
    .select()
    .from(secciones_contenido)
    .where(
      and(
        eq(secciones_contenido.organizacion_id, organizacionId),
        eq(secciones_contenido.pagina_clave, paginaClave),
        eq(secciones_contenido.estatus, true)
      )
    )
    .orderBy(asc(secciones_contenido.orden));
}

/** Obtener testimonios aprobados */
export async function obtenerTestimoniosAprobados(organizacionId: string) {
  return db
    .select()
    .from(testimonios)
    .where(
      and(
        eq(testimonios.organizacion_id, organizacionId),
        eq(testimonios.aprobado, true)
      )
    )
    .orderBy(desc(testimonios.creado_en));
}

/** Obtener preguntas frecuentes por página */
export async function obtenerFAQ(organizacionId: string, paginaClave: string = "general") {
  return db
    .select()
    .from(preguntas_frecuentes)
    .where(
      and(
        eq(preguntas_frecuentes.organizacion_id, organizacionId),
        eq(preguntas_frecuentes.pagina_clave, paginaClave),
        eq(preguntas_frecuentes.estatus, true)
      )
    )
    .orderBy(asc(preguntas_frecuentes.orden));
}

/** Obtener galería de fotos por página */
export async function obtenerGaleria(organizacionId: string, paginaClave: string) {
  return db
    .select()
    .from(galeria_fotos)
    .where(
      and(
        eq(galeria_fotos.organizacion_id, organizacionId),
        eq(galeria_fotos.pagina_clave, paginaClave),
        eq(galeria_fotos.estatus, true)
      )
    )
    .orderBy(asc(galeria_fotos.orden));
}

/** Obtener letrero especial por página */
export async function obtenerLetrero(organizacionId: string, paginaClave: string) {
  const [resultado] = await db
    .select()
    .from(letreros_especiales)
    .where(
      and(
        eq(letreros_especiales.organizacion_id, organizacionId),
        eq(letreros_especiales.pagina_clave, paginaClave),
        eq(letreros_especiales.estatus, true)
      )
    )
    .limit(1);
  return resultado || null;
}

/** Obtener teléfonos de contacto */
export async function obtenerTelefonos(organizacionId: string, tipo?: string) {
  const condiciones = [
    eq(telefonos_emergencia.organizacion_id, organizacionId),
    eq(telefonos_emergencia.estatus, true),
  ];
  if (tipo) condiciones.push(eq(telefonos_emergencia.tipo, tipo));

  return db
    .select()
    .from(telefonos_emergencia)
    .where(and(...condiciones))
    .orderBy(asc(telefonos_emergencia.orden));
}

/** Obtener responsables de organización */
export async function obtenerResponsables(organizacionId: string) {
  return db
    .select()
    .from(responsables_organizacion)
    .where(
      and(
        eq(responsables_organizacion.organizacion_id, organizacionId),
        eq(responsables_organizacion.estatus, true)
      )
    )
    .orderBy(asc(responsables_organizacion.orden));
}

/** Obtener contenido multimedia */
export async function obtenerMedia(organizacionId: string, tipo?: string) {
  const condiciones = [
    eq(media_contenido.organizacion_id, organizacionId),
    eq(media_contenido.estatus, true),
  ];
  if (tipo) condiciones.push(eq(media_contenido.tipo, tipo));

  return db
    .select()
    .from(media_contenido)
    .where(and(...condiciones))
    .orderBy(asc(media_contenido.orden));
}

/** Obtener artículos de blog publicados */
export async function obtenerArticulosBlog(organizacionId: string, blogClave: string = "crecimientos") {
  return db
    .select()
    .from(articulos_blog)
    .where(
      and(
        eq(articulos_blog.organizacion_id, organizacionId),
        eq(articulos_blog.blog_clave, blogClave),
        eq(articulos_blog.publicado, true)
      )
    )
    .orderBy(desc(articulos_blog.fecha_publicacion));
}

/** Obtener agenda de retiros próximos */
export async function obtenerAgendaRetiros(organizacionId: string) {
  return db
    .select({
      id: agenda_retiros.id,
      nombre_evento: agenda_retiros.nombre_evento,
      fecha_inicio: agenda_retiros.fecha_inicio,
      fecha_fin: agenda_retiros.fecha_fin,
      hora_entrada: agenda_retiros.hora_entrada,
      hora_salida: agenda_retiros.hora_salida,
      cupo_maximo: agenda_retiros.cupo_maximo,
      costo: agenda_retiros.costo,
      descripcion: agenda_retiros.descripcion,
      estatus: agenda_retiros.estatus,
      tipo_evento: tipos_eventos.nombre,
      sede_nombre: sedes.nombre,
    })
    .from(agenda_retiros)
    .leftJoin(tipos_eventos, eq(agenda_retiros.tipo_evento_id, tipos_eventos.id))
    .leftJoin(sedes, eq(agenda_retiros.sede_id, sedes.id))
    .where(
      and(
        eq(agenda_retiros.organizacion_id, organizacionId),
      )
    )
    .orderBy(asc(agenda_retiros.fecha_inicio));
}

// ============================================================
// ACCIONES DE ESCRITURA — Para el Admin CMS
// ============================================================

/** Guardar/actualizar parámetros de landing */
export async function guardarParametrosLanding(organizacionId: string, datos: Record<string, unknown>) {
  const existente = await obtenerParametrosLanding(organizacionId);
  
  if (existente) {
    await db.update(parametros_landing)
      .set({ ...datos, actualizado_en: new Date() })
      .where(eq(parametros_landing.id, existente.id));
  } else {
    await db.insert(parametros_landing).values({
      organizacion_id: organizacionId,
      ...datos,
    });
  }
  revalidatePath("/");
  revalidatePath("/configuracion/contenido");
}

/** Crear sección de contenido */
export async function crearSeccionContenido(datos: {
  organizacion_id: string;
  pagina_clave: string;
  tipo?: string;
  orden?: number;
  titulo?: string;
  subtitulo?: string;
  contenido?: string;
  autoria?: string;
  imagen_url?: string;
  imagen_nota_pie?: string;
  video_url?: string;
  video_nota_pie?: string;
  lema_tarjeta?: string;
  imagen_tarjeta_url?: string;
}) {
  await db.insert(secciones_contenido).values(datos);
  revalidatePath("/");
  revalidatePath(`/${datos.pagina_clave}`);
}

/** Actualizar sección de contenido */
export async function actualizarSeccionContenido(id: string, datos: Record<string, unknown>) {
  await db.update(secciones_contenido)
    .set({ ...datos, actualizado_en: new Date() })
    .where(eq(secciones_contenido.id, id));
  revalidatePath("/");
}

/** Eliminar sección de contenido */
export async function eliminarSeccionContenido(id: string) {
  await db.delete(secciones_contenido).where(eq(secciones_contenido.id, id));
  revalidatePath("/");
}

/** CRUD Testimonios */
export async function crearTestimonio(datos: {
  organizacion_id: string;
  nombre_autor?: string;
  es_anonimo?: boolean;
  texto: string;
  calificacion?: number;
}) {
  await db.insert(testimonios).values(datos);
  revalidatePath("/testimonios");
}

export async function aprobarTestimonio(id: string, aprobado: boolean) {
  await db.update(testimonios).set({ aprobado }).where(eq(testimonios.id, id));
  revalidatePath("/testimonios");
}

export async function eliminarTestimonio(id: string) {
  await db.delete(testimonios).where(eq(testimonios.id, id));
  revalidatePath("/testimonios");
}

/** Obtener TODOS los testimonios (para admin, incluye no aprobados) */
export async function obtenerTodosTestimonios(organizacionId: string) {
  return db
    .select()
    .from(testimonios)
    .where(eq(testimonios.organizacion_id, organizacionId))
    .orderBy(desc(testimonios.creado_en));
}

/** CRUD FAQ */
export async function crearFAQ(datos: {
  organizacion_id: string;
  pagina_clave?: string;
  pregunta: string;
  respuesta: string;
  orden?: number;
}) {
  await db.insert(preguntas_frecuentes).values(datos);
  revalidatePath("/ayuda");
}

export async function actualizarFAQ(id: string, datos: Record<string, unknown>) {
  await db.update(preguntas_frecuentes).set(datos).where(eq(preguntas_frecuentes.id, id));
  revalidatePath("/ayuda");
}

export async function eliminarFAQ(id: string) {
  await db.delete(preguntas_frecuentes).where(eq(preguntas_frecuentes.id, id));
  revalidatePath("/ayuda");
}

/** CRUD Teléfonos */
export async function crearTelefono(datos: {
  organizacion_id: string;
  tipo?: string;
  nombre_contacto?: string;
  telefono?: string;
  whatsapp?: string;
  cargo?: string;
  horario?: string;
  orden?: number;
}) {
  await db.insert(telefonos_emergencia).values(datos);
  revalidatePath("/contactanos");
  revalidatePath("/llama-de-amor");
}

export async function actualizarTelefono(id: string, datos: Record<string, unknown>) {
  await db.update(telefonos_emergencia).set(datos).where(eq(telefonos_emergencia.id, id));
  revalidatePath("/contactanos");
}

export async function eliminarTelefono(id: string) {
  await db.delete(telefonos_emergencia).where(eq(telefonos_emergencia.id, id));
  revalidatePath("/contactanos");
}

/** CRUD Responsables */
export async function crearResponsable(datos: {
  organizacion_id: string;
  nombre: string;
  cargo?: string;
  foto_url?: string;
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  mensaje_saludo?: string;
  orden?: number;
}) {
  await db.insert(responsables_organizacion).values(datos);
  revalidatePath("/contactanos");
}

export async function actualizarResponsable(id: string, datos: Record<string, unknown>) {
  await db.update(responsables_organizacion).set(datos).where(eq(responsables_organizacion.id, id));
  revalidatePath("/contactanos");
}

export async function eliminarResponsable(id: string) {
  await db.delete(responsables_organizacion).where(eq(responsables_organizacion.id, id));
  revalidatePath("/contactanos");
}

/** CRUD Galería */
export async function crearFotoGaleria(datos: {
  organizacion_id: string;
  pagina_clave: string;
  imagen_url: string;
  titulo?: string;
  descripcion?: string;
  orden?: number;
}) {
  await db.insert(galeria_fotos).values(datos);
  revalidatePath(`/${datos.pagina_clave}`);
}

export async function eliminarFotoGaleria(id: string) {
  await db.delete(galeria_fotos).where(eq(galeria_fotos.id, id));
  revalidatePath("/");
}

/** CRUD Letreros */
export async function crearLetrero(datos: {
  organizacion_id: string;
  pagina_clave: string;
  texto_principal: string;
  texto_subtitulo?: string;
  fuente_especial?: string;
  color_texto?: string;
  estilo?: string;
}) {
  await db.insert(letreros_especiales).values(datos);
  revalidatePath(`/${datos.pagina_clave}`);
}

export async function actualizarLetrero(id: string, datos: Record<string, unknown>) {
  await db.update(letreros_especiales).set(datos).where(eq(letreros_especiales.id, id));
  revalidatePath("/");
}

/** CRUD Media */
export async function crearMedia(datos: {
  organizacion_id: string;
  tipo: string;
  titulo: string;
  descripcion?: string;
  url_contenido: string;
  imagen_miniatura_url?: string;
  duracion?: string;
  artista_autor?: string;
  categoria?: string;
  orden?: number;
}) {
  await db.insert(media_contenido).values(datos);
  revalidatePath("/media");
}

export async function actualizarMedia(id: string, datos: Record<string, unknown>) {
  await db.update(media_contenido).set(datos).where(eq(media_contenido.id, id));
  revalidatePath("/media");
}

export async function eliminarMedia(id: string) {
  await db.delete(media_contenido).where(eq(media_contenido.id, id));
  revalidatePath("/media");
}

/** CRUD Blog */
export async function crearArticuloBlog(datos: {
  organizacion_id: string;
  blog_clave?: string;
  titulo: string;
  slug?: string;
  extracto?: string;
  contenido?: string;
  imagen_portada_url?: string;
  autor_id?: string;
  categoria?: string;
  etiquetas?: string;
  publicado?: boolean;
  fecha_publicacion?: Date;
}) {
  // Generar slug si no se proporciona
  if (!datos.slug && datos.titulo) {
    datos.slug = datos.titulo
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  await db.insert(articulos_blog).values(datos);
  revalidatePath("/crecimientos");
  revalidatePath("/formacion");
  revalidatePath("/blog");
}

export async function actualizarArticuloBlog(id: string, datos: Record<string, unknown>) {
  await db.update(articulos_blog).set(datos).where(eq(articulos_blog.id, id));
  revalidatePath("/crecimientos");
  revalidatePath("/blog");
}

export async function eliminarArticuloBlog(id: string) {
  await db.delete(articulos_blog).where(eq(articulos_blog.id, id));
  revalidatePath("/crecimientos");
  revalidatePath("/blog");
}

/** Obtener TODOS los artículos (admin) */
export async function obtenerTodosArticulos(organizacionId: string) {
  return db
    .select()
    .from(articulos_blog)
    .where(eq(articulos_blog.organizacion_id, organizacionId))
    .orderBy(desc(articulos_blog.creado_en));
}

/** CRUD Agenda de Retiros */
export async function crearRetiroAgenda(datos: {
  organizacion_id: string;
  tipo_evento_id: string;
  sede_id?: string;
  casa_retiro_id?: string;
  nombre_evento: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  hora_entrada?: string;
  hora_salida?: string;
  cupo_maximo?: number;
  costo?: string;
  descripcion?: string;
}) {
  await db.insert(agenda_retiros).values(datos);
  revalidatePath("/retiros-eventos");
}

export async function actualizarRetiroAgenda(id: string, datos: Record<string, unknown>) {
  await db.update(agenda_retiros).set(datos).where(eq(agenda_retiros.id, id));
  revalidatePath("/retiros-eventos");
}

export async function eliminarRetiroAgenda(id: string) {
  await db.delete(agenda_retiros).where(eq(agenda_retiros.id, id));
  revalidatePath("/retiros-eventos");
}
