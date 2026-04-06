import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { usuarios, roles_sistema } from "./schema";
import { eq } from "drizzle-orm";

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
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Solo permitimos el acceso si el usuario existe en nuestra DB de SJM
      const [usuarioExistente] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.correo, user.email));

      if (usuarioExistente) {
        return true;
      }

      return "/auth/error?error=AccessDenied";
    },

    async jwt({ token, user, trigger }) {
      // En el primer login o cuando se refresca el token
      if (user?.email || trigger === "signIn") {
        const correo = user?.email || token.email;
        if (correo) {
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
            .where(eq(usuarios.correo, correo as string));

          if (usr) {
            token.usuario_id = usr.id;
            token.organizacion_id = usr.organizacion_id;
            token.sede_id = usr.sede_id;
            token.rol_id = usr.rol_id;
            token.nombre_completo = usr.nombre_completo;
            token.foto_url = usr.foto_perfil_url;

            // Obtener nombre del rol
            if (usr.rol_id) {
              const [rol] = await db
                .select({ nombre: roles_sistema.nombre })
                .from(roles_sistema)
                .where(eq(roles_sistema.id, usr.rol_id));
              token.rol_nombre = rol?.nombre || null;
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
});
