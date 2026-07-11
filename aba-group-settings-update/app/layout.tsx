import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CartProvider } from "@/lib/cart/CartContext";
import { ProductsProvider } from "@/lib/products/ProductsContext";
import { SettingsProvider } from "@/lib/settings/SettingsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://aba-group-gamma.vercel.app"),
  title: "ABA Group — Global Business Solutions",
  description: "ABA Group — халықаралық бизнес платформасы. Электроника, үй тауарлары, автоаксессуарлар, құрылыс материалдары және басқа да өнімдер.",
  openGraph: {
    title: "ABA Group — Global Business Solutions",
    description: "ABA Group — халықаралық бизнес платформасы.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SettingsProvider>
            <ProductsProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </CartProvider>
            </ProductsProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
