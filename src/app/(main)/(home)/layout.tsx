import background from "../../../public/home_background.png";
import "../globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import Aside from "./Aside";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="fixed z-0 top-0 h-screen w-screen bg-center bg-cover" style={{ backgroundImage: `url(${background.src})` }}></div>
    <Navbar />

    <main className="flex h-full w-full min-w-full max-w-full">

      <Aside />

      <div className="z-1 p-3 ml-42 flex-1 min-h-screen w-full text-white">
        {children}
      </div>

    </main>
    </>
  );
}

