import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "@/components/AuthGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/lib/useSettings";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Voice Expense Tracker",
  description: "Voice-first AI expense tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use suppressHydrationWarning to prevent warnings from class manipulation on html
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SettingsProvider>
            <AuthGate>{children}</AuthGate>
            <Toaster position="top-right" richColors theme="system" />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
