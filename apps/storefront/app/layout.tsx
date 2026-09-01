import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import PromoBar from "@/components/PromoBar";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const revalidate = 60;

export const metadata: Metadata = {
  title: "YEDEI — L'élégance pour toute la famille",
  description:
    "YEDEI habille hommes, femmes, enfants et bébés avec des collections élégantes pensées pour chaque génération.",
  openGraph: {
    title: "YEDEI — L'élégance pour toute la famille",
    description:
      "YEDEI habille hommes, femmes, enfants et bébés avec des collections élégantes pensées pour chaque génération.",
    images: ["/og-image.png"],
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "YEDEI — L'élégance pour toute la famille",
    description:
      "YEDEI habille hommes, femmes, enfants et bébés avec des collections élégantes pensées pour chaque génération.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <PromoBar />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
