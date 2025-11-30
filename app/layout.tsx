import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3x3 Wellness | Daily Habit Tracker",
  description: "Track your sleep, gratitude, and movement with the 3x3 Routine. Build sustainable wellness habits backed by positive psychology research.",
  keywords: ["wellness", "habit tracker", "gratitude", "sleep", "movement", "mental health", "student wellness"],
  authors: [{ name: "NYU Science of Happiness" }],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "3x3 Wellness | Daily Habit Tracker",
    description: "Simple, evidence-based daily habits for student wellness",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FDF8F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
