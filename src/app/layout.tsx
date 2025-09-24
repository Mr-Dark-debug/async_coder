import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkPublishableKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Clerk publishable key is not configured. Authentication features are disabled for this build."
      );
    }
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {children}
    </ClerkProvider>
  );
}

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
    <Providers>
      <html lang="en">
        <body
          className="antialiased"
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(23 23 23)',
                border: '1px solid rgb(64 64 64)',
                color: 'white',
              },
            }}
          />
        </body>
      </html>
    </Providers>
  );
}
