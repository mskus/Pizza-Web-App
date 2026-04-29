import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bottegapizzeria.com"),
  title: {
    default: "Bottega Pizzeria | Authentic Italian Pizza",
    template: "%s | Bottega Pizzeria"
  },
  description:
    "Iki subeli butik Italyan pizzacisinin odun firini lezzetini ve menulerini kesfet.",
  keywords: [
    "italyan pizza",
    "butik pizzaci",
    "odun firini pizza",
    "Bottega Pizzeria"
  ],
  openGraph: {
    title: "Bottega Pizzeria",
    description:
      "Authentic Italian pizzeria deneyimini iki subede kesfedin.",
    type: "website",
    locale: "tr_TR",
    siteName: "Bottega Pizzeria"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${playfair.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
