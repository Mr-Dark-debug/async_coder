import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AC</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Async Coder
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-200">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="pt-20">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
