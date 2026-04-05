import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { usuarios } from "./schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      // Solo permitimos el acceso si el usuario existe en nuestra DB de SJM
      // o podemos habilitar registro automático. Por ahora buscamos si existe.
      const [usuarioExistente] = await db.select().from(usuarios).where(eq(usuarios.correo, user.email));
      
      if (usuarioExistente) {
        return true; 
      }
      
      // Si quieres que el primer login cree al usuario (opcional):
      // return true; 
      
      return "/auth/error?error=AccessDenied";
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});
