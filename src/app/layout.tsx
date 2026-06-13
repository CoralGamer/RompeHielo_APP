import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "RompeHielo - Práctica de Oratoria e Improvisación",
  description: "Entrena tu oratoria de forma rápida y práctica. Sortea un tema aleatorio, habla durante 5 minutos, graba tu discurso y escúchate para mejorar. 100% privado y guardado en tu dispositivo.",
  keywords: ["oratoria", "improvisacion", "rompehielos", "hablar en publico", "grabar voz", "analisis de voz", "timer"],
  authors: [{ name: "RompeHielo Engine" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col overflow-hidden relative">
        {children}
      </body>
    </html>
  );
}
