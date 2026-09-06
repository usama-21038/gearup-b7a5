import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "GearUp — Rent Sports & Outdoor Gear Instantly",
    template: "%s · GearUp",
  },
  description:
    "Browse and rent sports & outdoor equipment from local providers. Book gear by the day, pay securely, and get outside.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
