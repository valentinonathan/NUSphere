import { Button } from "@/components/ui/button";
import AvatarWithOnline from "@/components/avatarWithOnline";
import Search from "@/components/search";
import logo from "../../../public/NUSPHERE Logo.png";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-100 p-5 min-h-17 h-17 max-h-17 flex justify-between items-center shadow-black/10 shadow-md bg-gradient-to-r from-primary/60 from-0% via-secondary/40 via-110% to-secondary/40 to-100% backdrop-blur-md">
            <div className="h-12 flex gap-3 items-center">
                <img src={logo.src} className="h-full w-auto rounded-md object-contain"></img>
                <h1 className="font-momo text-2xl text-white">NUSphere</h1>
            </div>
            <div >
                <Search />
            </div>
            <div className="flex h-11 gap-4.5 items-center">
                <a href="/login">
                    <Button className="rounded-md max-h-8.5 border-none font-roboto bg-black/30 hover:bg-black/40 backdrop-blur-3xl hover:cursor-pointer">Log In</Button>
                </a>
                <Button className="rounded-md max-h-8.5 border-none font-roboto bg-black/20 hover:bg-black/30 hover:cursor-pointer">Sign Up</Button>
                <AvatarWithOnline />
            </div>
        </header>
    );
}