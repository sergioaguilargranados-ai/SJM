"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Heart, BookOpen, ShoppingBag, Menu, X, User, LogIn,
  LayoutDashboard, LogOut, ChevronDown
} from "lucide-react";
import { signOut } from "next-auth/react";

/**
 * Navbar pública con estado de sesión.
 * Muestra foto/iniciales del usuario logueado o botón de "Acceso" si no lo está.
 * Click en logo → inicio. Click en avatar → perfil.
 */
export function NavbarPublica() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1015]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon.png" alt="SJM" width={40} height={40} className="drop-shadow" />
          <div className="hidden sm:block">
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight block leading-none">SJM Nacional</span>
            <span className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-medium">Servidores de Jesús por María</span>
          </div>
        </Link>

        {/* Links de navegación — Desktop */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#carisma" className="hover:text-slate-900 dark:hover:text-white transition-colors">Carisma</a>
          <a href="#ministerios" className="hover:text-slate-900 dark:hover:text-white transition-colors">Ministerios</a>
          <a href="#programas" className="hover:text-slate-900 dark:hover:text-white transition-colors">Programas</a>
          <a href="#retiros" className="hover:text-slate-900 dark:hover:text-white transition-colors">Retiros</a>
          <a href="#testimonios" className="hover:text-slate-900 dark:hover:text-white transition-colors">Testimonios</a>
          <a href="#centros" className="hover:text-slate-900 dark:hover:text-white transition-colors">Centros</a>
          <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Blog</Link>
          <Link href="/tienda" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> Tienda</Link>
          <Link href="/donativos" className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Donativos</Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Link href="/donativos" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
            <Heart className="w-3 h-3" /> Donar
          </Link>

          {isLoggedIn ? (
            /* Avatar del usuario logueado */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1b26] transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.nombre_completo || session.user.name || ""}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[#00B4AA]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00B4AA] to-[#1E3A5F] flex items-center justify-center text-white font-bold text-xs">
                    {(session.user.nombre_completo || session.user.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  {(session.user.nombre_completo || session.user.name || "").split(" ")[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown del usuario */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Info del usuario */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#2a2b3d]">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {session.user.nombre_completo || session.user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {session.user.email}
                      </p>
                      {session.user.rol_nombre && (
                        <span className="inline-block mt-1.5 text-[9px] font-black text-[#00B4AA] uppercase tracking-wider bg-[#00B4AA]/10 px-2 py-0.5 rounded-full">
                          {session.user.rol_nombre}
                        </span>
                      )}
                    </div>

                    {/* Opciones */}
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" /> Mi Perfil
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-[#2a2b3d]" />

                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Botón de login */
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
              <LogIn className="w-3.5 h-3.5" /> Acceso
            </Link>
          )}

          {/* Hamburger — Móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil expandible */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-[#0f1015] animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#carisma" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Carisma</a>
            <a href="#ministerios" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Ministerios</a>
            <a href="#programas" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Programas</a>
            <a href="#retiros" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Retiros</a>
            <a href="#testimonios" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Testimonios</a>
            <a href="#centros" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white">Centros</a>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"><BookOpen className="w-4 h-4" /> Blog</Link>
            <Link href="/tienda" onClick={() => setMenuOpen(false)} className="py-2 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Tienda</Link>
            <Link href="/donativos" onClick={() => setMenuOpen(false)} className="py-2 text-rose-600 font-bold flex items-center gap-2"><Heart className="w-4 h-4" /> Donativos</Link>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link href="/perfil" onClick={() => setMenuOpen(false)} className="py-2 flex items-center gap-2"><User className="w-4 h-4" /> Mi Perfil</Link>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="py-2 flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                  <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="py-2 text-red-500 flex items-center gap-2 text-left"><LogOut className="w-4 h-4" /> Cerrar Sesión</button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold w-full justify-center">
                  <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
