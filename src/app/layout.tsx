import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FitPass - Gym Membership Platform",
  description: "Access multiple gyms with one subscription. Track workouts, attend classes, and achieve your fitness goals.",
  keywords: ["gym", "fitness", "membership", "workout", "health", "exercise"],
  openGraph: {
    title: "FitPass - One Pass, Unlimited Gyms",
    description: "Join the centralized gym membership platform and access fitness centers across the city.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
