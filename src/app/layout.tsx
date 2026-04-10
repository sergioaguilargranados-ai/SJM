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
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "SJM Nacional | Servidores de Jesús por María",
  description: "Plataforma de gestión e intranet de Servidores de Jesús por María",
  icons: {
    icon: [
      { url: '/logo-sjm-oficial.png', href: '/logo-sjm-oficial.png' }
    ],
    apple: '/logo-sjm-oficial.png',
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

