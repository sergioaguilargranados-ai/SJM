import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "SJM Nacional | Servidores de Jesús por María",
  description: "Plataforma de gestión e intranet de Servidores de Jesús por María",
  manifest: "/manifest.json",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PwaRegister />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

