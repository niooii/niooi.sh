import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Raleway } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "nioon",
  description: "A website of all time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${raleway.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
