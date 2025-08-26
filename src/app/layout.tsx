import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Async Coder - The last AI assistant you'll ever need for coding",
  description: "Open-source, end-to-end AI coding assistant with autonomous development pipeline. Debug, code, document, and review with multiple AI backends. Your choice. Your rules.",
  keywords: [
    "AI coding assistant",
    "autonomous coding", 
    "open source AI",
    "developer tools",
    "Claude Code",
    "Gemini CLI",
    "Aider",
    "code review",
    "debugging",
    "documentation"
  ],
  authors: [{ name: "Async Coder Team" }],
  creator: "Async Coder",
  publisher: "Async Coder",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Async Coder - The last AI assistant you'll ever need for coding",
    description: "Open-source, end-to-end AI coding assistant with autonomous development pipeline",
    url: "https://asynccoder.dev",
    siteName: "Async Coder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Async Coder - The last AI assistant you'll ever need for coding",
    description: "Open-source, end-to-end AI coding assistant with autonomous development pipeline",
    creator: "@asynccoder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
