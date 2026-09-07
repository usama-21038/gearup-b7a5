import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import { ConfirmProvider } from "@/lib/confirm-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Matches the prototype's typeface (Google Fonts Inter, weights 400-800).
// next/font self-hosts the font at build time — no runtime request to
// fonts.googleapis.com and no layout shift.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GearUp — Rent Sports & Outdoor Gear Instantly",
  description: "Browse, rent, and manage sports and outdoor equipment from local providers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <ToastProvider>
            <ConfirmProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ConfirmProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
