"use client";

import AvatarWithOnline from "@/components/avatarWithOnline";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import Link from "next/link";

export default function PeopleBadge({imageUrl, username, first_name, last_name, year, residence, nationality, major}: {imageUrl: string, username: string, first_name: string, last_name: string, year: string, residence: string, nationality: string, major: string}) {
    return (
        <div className="min-w-80 min-h-32 flex gap-4 p-5 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
            <Link href={`/${username}`}>
            <div className="pt-2"> 
                <AvatarWithOnline imageUrl={imageUrl} size="6"/>
            </div>
            </Link>
            <div className="flex flex-col gap-1">
                <Link href={`/${username}`}>
                <h2 className="text-lg font-semibold">{first_name} {last_name}</h2>
                </Link>
                <h3 className="text-sm">{year}</h3>
                <h3 className="text-sm">{major}</h3>
                <div className="flex gap-2 text-sm">
                    <div className="min-h-4 min-w-4 flex justify-center items-center">
                        <MdOutlineHomeWork className="text-lg" />
                    </div>
                {residence}
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="min-h-4 min-w-4 flex justify-center items-center">
                        <IoGlobeOutline className="text-lg" />
                    </div>
                    {nationality == "Singapore Citizen" || nationality == "Singapore PR" ? nationality : "International, " + nationality}
                </div>
            </div>
        </div>
    );
}