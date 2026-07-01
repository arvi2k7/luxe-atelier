import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ExitIntentPrompt } from "@/components/conversion/exit-intent-prompt";

export const metadata: Metadata = {
  title: {
    default: "Luxe Atelier",
    template: "%s — Luxe Atelier",
  },
  description: "A quiet shopfront for considered pieces. Crafted in small runs, seen best after dark.",
  openGraph: {
    siteName: "Luxe Atelier",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-vitrine font-body text-bone antialiased">
        <Header />
        <main className="pt-[72px]">{children}</main>
        <Footer />
        <ExitIntentPrompt />
      </body>
    </html>
  );
}
