import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Montserrat, Inter } from "next/font/google";
import background from "../../public/home_background.png";
import "./globals.css";
import { cn } from "@/lib/utils";


import Navbar from "./Navbar";
import Aside from "./Aside";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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

      <body className="min-h-screen h-screen min-w-full w-full max-w-full flex flex-col">
        <div className="fixed z-0 top-0 h-screen w-screen bg-center bg-cover" style={{backgroundImage: `url(${background.src})`}}></div>
        <Navbar />

        <main className="flex h-full w-full min-w-full max-w-full">

          <Aside />

          <div className="z-1 p-3 ml-42 flex-1 min-h-screen text-white ">
            {children}
          </div>

        </main>

      </body>

    </html>
  );
}
