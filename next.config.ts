import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Congela la estampa de tiempo exacta durante la fase de Build (Vercel Node environment)
    NEXT_PUBLIC_BUILD_TIME: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
    NEXT_PUBLIC_APP_VERSION: "v1.009",
  }
};

export default nextConfig;
