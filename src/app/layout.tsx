import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NUSphere",
  description: "One Campus, One Sphere",
  icons: {
    icon: "../../public/NUSPHERE Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", roboto.variable, "font-sans", inter.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Momo+Trust+Display&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen min-w-full w-full max-w-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

