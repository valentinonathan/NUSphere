import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Montserrat, Inter } from "next/font/google";
import background from "../../public/home_background.png";
import "./globals.css";
import transparentLogo from "../../public/logo-transparent.png";
import logo from "../../public/NUSPHERE Logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IoChatbubble } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { BsCalendar3EventFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import AvatarWithOnline from "@/components/avatarWithOnline";
import Search from "@/components/search";
import { GoHomeFill } from "react-icons/go";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NUSphere",
  description: "One Campus, One Sphere",
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
      <body className="min-h-screen h-screen flex flex-col">
        <div className="flex flex-col flex-1 bg-center bg-cover" style={{backgroundImage: `url(${background.src})`}}>

          <header className="z-100 sticky p-5 min-h-17 h-17 max-h-17 flex justify-between items-center shadow-black/10 shadow-md bg-gradient-to-r from-primary/40 from-0% via-secondary/40 via-110% to-secondary/40 to-100% backdrop-blur-md">
            <div className="h-12 flex gap-3 items-center">
              <img src={logo.src} className="h-full w-auto rounded-md object-contain"></img>
              <h1 className="font-momo text-2xl text-white">NUSphere</h1>
            </div>
            <div >
              <Search />
            </div>
            <div className="flex h-11 gap-3 items-center">
              <Button className="rounded-md max-h-8.5 border-none font-roboto bg-black/30 hover:bg-black/40 backdrop-blur-3xl hover:cursor-pointer">Log In</Button>
              <Button className="rounded-md max-h-8.5 border-none font-roboto bg-black/20 hover:bg-black/30 hover:cursor-pointer">Sign Up</Button>
              <AvatarWithOnline />
            </div>
          </header>

          <main className="flex h-full">
            <aside className="pt-6.5 px-7.5 sticky min-h-full shadow-md bg-gradient-to-b from-primary/40 from-0% via-secondary/40 via-110% to-secondary/40 to-100% backdrop-blur-md" style={{boxShadow:"18px 0 24px rgba(0,0,0,0.1)"}}>
              <nav className="flex flex-col gap-11 items-start">
                <div className="flex items-center gap-5 hover:bg-white/30">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <GoHomeFill className="text-white/90 text-3xl"/>
                  </div>
                  <h1 className="text-white">Home</h1>
                </div>
                <div className="flex items-center gap-5 justify-around">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <IoChatbubble className="text-white/90 text-[163%]" />
                  </div>
                  <h1 className="text-white">Chat</h1>
                </div>
                <div className="flex items-center gap-5 justify-around">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <FaUserGroup className="text-white/90 text-[170%]" />
                  </div>
                  <h1 className="text-white">Find People</h1>
                </div>
                <div className="flex items-center gap-5 justify-around">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <BsCalendar3EventFill className="text-white/90 text-[158%]" />
                  </div>
                  <h1 className="text-white">Events</h1>
                </div>
                <div className="flex items-center gap-5 justify-around">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <FaStore className="text-white/90 text-[168%]" />
                  </div>
                  <h1 className="text-white">Marketplace</h1>
                </div>
                <div className="flex items-center gap-5 justify-around">
                  <div className="min-w-8 min-h-8 flex justify-center items-center">
                    <FaBook className="text-white/90 text-[163%]" />
                  </div>
                  <h1 className="text-white">Modules</h1>
                </div>
              </nav>
            </aside>
            <div>

            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
