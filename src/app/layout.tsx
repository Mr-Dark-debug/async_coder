import type { Metadata } from "next";
import { Montserrat, Roboto, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Include needed weights
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Include needed weights
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Syntaxia - Your Asynchronous Coding Assistant",
  description: "Automate your coding tasks and focus on what matters most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
