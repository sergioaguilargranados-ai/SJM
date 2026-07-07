import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { usuarios, roles_sistema, organizaciones } from "./schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { enviarEmail } from "./emailService";
import { plantillaBienvenidaSJM } from "./emailTemplate";

// Extensión del tipado de sesión para incluir datos de SJM
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      // Datos SJM
      usuario_id: string;
      organizacion_id: string;
      sede_id: string | null;
      rol_id: string | null;
      rol_nombre: string | null;
      nombre_completo: string;
      es_admin_sistema: boolean;
      permisos: string[];
    };
  }
}

// ID de la Organización Nacional de SJM (fijo para el tenant principal)
const ORG_NACIONAL_ID = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";

/**
 * Obtiene o crea el rol "General" para la organización nacional.
 * Este rol se asigna a todos los usuarios nuevos que se registran por su cuenta.
 */
async function obtenerRolGeneral(): Promise<string> {
  const [rolExistente] = await db
    .select({ id: roles_sistema.id })
    .from(roles_sistema)
    .where(
      and(
        eq(roles_sistema.organizacion_id, ORG_NACIONAL_ID),
        eq(roles_sistema.nombre, "General")
      )
    );

  if (rolExistente) return rolExistente.id;

  // Crear el rol General si no existe
  const [nuevoRol] = await db
    .insert(roles_sistema)
    .values({
      organizacion_id: ORG_NACIONAL_ID,
      nombre: "General",
      es_admin_sistema: false,
    })
    .returning({ id: roles_sistema.id });

  return nuevoRol.id;
}

/**
 * Crea un nuevo usuario en la base de datos con rol General.
 */
async function crearUsuarioDesdeGoogle(
  email: string,
  nombre: string,
  imagen: string | null,
  googleId: string
) {
  const rolGeneralId = await obtenerRolGeneral();

  const [nuevoUsuario] = await db
    .insert(usuarios)
    .values({
      organizacion_id: ORG_NACIONAL_ID,
      correo: email,
      nombre_completo: nombre || email.split("@")[0],
      google_id: googleId,
      foto_perfil_url: imagen,
      rol_id: rolGeneralId,
    })
    .returning({ id: usuarios.id });

  return nuevoUsuario;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Correo o Celular", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identificador = credentials.email as string;
        const password = credentials.password as string;

        // Buscar por correo o celular
        let usuario;
        if (identificador.includes("@")) {
          [usuario] = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.correo, identificador));
        } else {
          // Limpiar número de celular (quitar espacios/guiones)
          const celularLimpio = identificador.replace(/[\s\-\(\)]/g, "");
          [usuario] = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.celular, celularLimpio));
        }

        if (!usuario) return null;
        if (!usuario.contrasena_hash) return null;

        // Verificar contraseña
        const esValida = await bcrypt.compare(password, usuario.contrasena_hash);
        if (!esValida) return null;

        return {
          id: usuario.id,
          email: usuario.correo,
          name: usuario.nombre_completo,
          image: usuario.foto_perfil_url,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Para Google: auto-crear si no existe o vincular si se pide
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Verificar si existe la cookie de vinculación
        const { cookies } = await import("next/headers");
        const cookieStore = cookies();
        const userIdToLink = cookieStore.get("link_google_to_user_id")?.value;

        if (userIdToLink) {
          // Vincular cuenta existente
          await db
            .update(usuarios)
            .set({ google_id: account.providerAccountId })
            .where(eq(usuarios.id, userIdToLink));
            
          // Limpiar la cookie de vinculación
          cookieStore.set("link_google_to_user_id", "", { maxAge: 0 });
          return true; // Permitir el inicio de sesión que sobreescribirá la sesión con la de google (está bien porque apuntará al mismo user)
        }

        const [usuarioExistente] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.correo, user.email));

        if (!usuarioExistente) {
          // Auto-crear el usuario con rol General
          await crearUsuarioDesdeGoogle(
            user.email,
            user.name || "",
            user.image || null,
            account.providerAccountId || ""
          );

          // Enviar email de bienvenida (no bloqueante)
          const { asunto, html } = plantillaBienvenidaSJM(user.name || user.email);
          enviarEmail({ para: user.email, asunto, html }).catch((err) =>
            console.error("Error enviando email de bienvenida (Google):", err)
          );
        } else if (!usuarioExistente.google_id && account.providerAccountId) {
          // Si el usuario existe pero no tiene google_id, vincularlo
          await db
            .update(usuarios)
            .set({
              google_id: account.providerAccountId,
              foto_perfil_url: usuarioExistente.foto_perfil_url || user.image,
            })
            .where(eq(usuarios.correo, user.email));
        }
      }

      // Para credenciales: ya se validó en authorize()
      return true;
    },

    async jwt({ token, user, trigger, account }) {
      // En el primer login o cuando se refresca el token
      if (user?.id || token.sub || trigger === "signIn") {
        const usuarioId = user?.id || token.sub;
        if (usuarioId) {
          const [usr] = await db
            .select({
              id: usuarios.id,
              organizacion_id: usuarios.organizacion_id,
              sede_id: usuarios.sede_id,
              rol_id: usuarios.rol_id,
              nombre_completo: usuarios.nombre_completo,
              foto_perfil_url: usuarios.foto_perfil_url,
            })
            .from(usuarios)
            .where(eq(usuarios.id, usuarioId as string));

          if (usr) {
            token.usuario_id = usr.id;
            token.organizacion_id = usr.organizacion_id;
            token.sede_id = usr.sede_id;
            token.rol_id = usr.rol_id;
            token.nombre_completo = usr.nombre_completo;
            token.foto_url = usr.foto_perfil_url;

            // Obtener nombre del rol y permisos
            if (usr.rol_id) {
              const [rol] = await db
                .select({ 
                  nombre: roles_sistema.nombre,
                  es_admin_sistema: roles_sistema.es_admin_sistema 
                })
                .from(roles_sistema)
                .where(eq(roles_sistema.id, usr.rol_id));
              
              token.rol_nombre = rol?.nombre || null;
              token.es_admin_sistema = rol?.es_admin_sistema || false;

              if (rol?.es_admin_sistema) {
                token.permisos = ["*"];
              } else {
                // Obtener permisos operativos granulares
                const { rol_permisos, acciones_sistema, funciones_sistema, modulos_sistema } = await import("./schema");
                
                const permisosDB = await db
                  .select({
                    modulo: modulos_sistema.clave,
                    funcion: funciones_sistema.clave,
                    accion: acciones_sistema.clave
                  })
                  .from(rol_permisos)
                  .innerJoin(acciones_sistema, eq(rol_permisos.accion_id, acciones_sistema.id))
                  .innerJoin(funciones_sistema, eq(acciones_sistema.funcion_id, funciones_sistema.id))
                  .innerJoin(modulos_sistema, eq(funciones_sistema.modulo_id, modulos_sistema.id))
                  .where(eq(rol_permisos.rol_id, usr.rol_id));

                token.permisos = permisosDB.map(p => `${p.modulo}.${p.funcion}.${p.accion}`);
              }
            } else {
              token.es_admin_sistema = false;
              token.permisos = [];
            }
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.usuario_id = (token.usuario_id as string) || "";
        session.user.organizacion_id = (token.organizacion_id as string) || "";
        session.user.sede_id = (token.sede_id as string) || null;
        session.user.rol_id = (token.rol_id as string) || null;
        session.user.rol_nombre = (token.rol_nombre as string) || null;
        session.user.nombre_completo = (token.nombre_completo as string) || session.user.name || "";
        session.user.es_admin_sistema = (token.es_admin_sistema as boolean) || false;
        session.user.permisos = (token.permisos as string[]) || [];
        if (token.foto_url) {
          session.user.image = token.foto_url as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  trustHost: true,
});

