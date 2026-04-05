import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "SJM Platform",
  description: "Plataforma de gestión e intranet de Servidores de Jesús por María",
  icons: {
    icon: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          
          {/* Footer de Versión e Infraestructura SJM */}
          <footer className="w-full py-4 px-6 border-t border-slate-100 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] flex justify-between items-center mt-auto">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">SJM Core Infrastructure</p>
             </div>
             <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-black/20 p-1 px-2 rounded">
                Build: v1.026 - Master Production (CDMX: 05-04-26 11:26)
             </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
