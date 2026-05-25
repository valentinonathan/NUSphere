import { GoHomeFill } from "react-icons/go";
import { IoChatbubble } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { BsCalendar3EventFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

export default function Aside() {
    return (
        <aside className="fixed pt-6.5 px-6.5 min-h-full min-w-42 w-42 max-w-42 overflow-clip shadow-md bg-gradient-to-b from-primary/70 from-0% via-secondary/40 via-110% to-secondary/40 to-100%" style={{boxShadow:"10px 0 24px rgba(0,0,0,0.2)"}}>
            <nav className="flex flex-col gap-11 items-start">
                <a href="/">
                <div className="flex items-center gap-5 hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <GoHomeFill className=" text-3xl"/>
                    </div>
                    <h1 className="">Home</h1>
                </div>
                </a>
                
                <a href="/chat">
                <div className="flex items-center gap-5 justify-around hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <IoChatbubble className="text-[163%]" />
                    </div>
                    <h1 className="">Chat</h1>
                </div>
                </a>

                <a href="/people">
                <div className="flex items-center gap-5 justify-around hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <FaUserGroup className="text-[170%]" />
                    </div>
                    <h1 className="">People</h1>
                </div>
                </a>

                <div className="flex items-center gap-5 justify-around hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <BsCalendar3EventFill className="text-[158%]" />
                    </div>
                    <h1 className="">Events</h1>
                </div>

                <div className="flex items-center gap-5 justify-around hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <FaStore className="text-[168%]" />
                    </div>
                    <h1 className="">Market</h1>
                </div>

                <div className="flex items-center gap-5 justify-around hover:cursor-pointer text-white hover:text-white/60">
                    <div className="min-w-8 min-h-8 flex justify-center items-center">
                        <FaBook className="text-[163%]" />
                    </div>
                    <h1 className="">Modules</h1>
                </div>
            </nav>
        </aside>
    );
}