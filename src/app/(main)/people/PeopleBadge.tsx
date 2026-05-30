import AvatarWithOnline from "@/components/avatarWithOnline";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";

export default function PeopleBadge() {
    return (
        <div className="min-w-80 min-h-32 flex gap-4 p-5 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
            <div className="pt-2"> 
                <AvatarWithOnline size="6"/>
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Valentino Nathan</h2>
                <h3 className="text-sm">Undergraduate</h3>
                <h3 className="text-sm">Year 1 Computer Science</h3>
                <div className="flex gap-2 text-sm">
                    <div className="min-h-4 min-w-4 flex justify-center items-center">
                        <MdOutlineHomeWork className="text-lg" />
                    </div>
                PGPR Residences
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="min-h-4 min-w-4 flex justify-center items-center">
                        <IoGlobeOutline className="text-lg" />
                    </div>
                    International, Indonesia
                </div>
            </div>
        </div>
    );
}