import type { Metadata } from "next";
import { Open_Sans, Oxygen_Mono } from "next/font/google";
import "./globals.css";

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const oxygenMono = Oxygen_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-oxygen-mono",
});

export const metadata: Metadata = {
  title: "CodeSqueak",
  description: "AI Powered Code Review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
