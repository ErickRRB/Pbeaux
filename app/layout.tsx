import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMag | Pbeaux",
  description:
    "Nueva version from scratch de PMag con diseño editorial, posts multi-idioma y admin por bloques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
