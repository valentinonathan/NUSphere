"use client";

import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { useParams, usePathname } from "next/navigation";

export default function CreateButton() {
    const pathName = usePathname();
    const params = useParams();
    const isModules = pathName.startsWith("/modules");
    const moduleCode = params?.module;
    console.log(params);
    const isEvents = pathName.startsWith("/events");

    console.log(isModules);

    return (
        <Link href={isModules && moduleCode !== undefined 
                        ? `/modules/${moduleCode}/create-thread`
                        : isEvents
                            ? `/events/create`
                            : `/create-post`
                    }>
            <div className="bg-pink-500 hover:bg-pink-600 rounded-md flex justify-center text-white p-1.5 pr-2 gap-2 hover:cursor-pointer">
                <IoAdd className="text-2xl bg-white/27 rounded-sm"/>
                {
                    isModules && moduleCode !== undefined
                        ? "Create Thread"
                        : isEvents
                            ? "Create Event"
                            : "Create Post"
                }
            </div>
        </Link>
    );
}