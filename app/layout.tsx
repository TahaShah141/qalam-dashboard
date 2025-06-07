import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Authenticator } from "@/components/custom/Authenticator";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qalam Dashboard",
  description: "Created by Taha Shah",
  icons: {
    icon: "/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <Authenticator>
          {children}
          <Toaster />
        </Authenticator>
      </body>
    </html>
  );
}
