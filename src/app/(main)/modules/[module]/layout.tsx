"use client"

import { useParams } from "next/navigation";
import bannerDummy from "../../../../../public/moduledummy.jpg"
import ModuleBox from "../ModuleBox";
import Thread from "../Thread";
import Link from "next/link";

export default function ModuleLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    const params = useParams();
    const moduleCode = params.module;
    const category = params?.category;

    return (
        <div className="relative w-full h-max" style={{minHeight:"calc(100vh - 5.25rem)"}}>
            <div className="relative w-full h-50 rounded-t-md">
                <img src={bannerDummy.src} className="w-full h-50 rounded-t-md object-cover" />
                <div className="w-full flex gap-2 absolute bottom-0 left-0 p-2 pt-4 bg-gradient-to-t from-black/50 from-0% via-black/25 via-80% to-black/0 to-100%">
                    <h1 className="font-momo text-4xl">{moduleCode}{category === undefined ? "/General" : `/${category}`}</h1>
                </div>
            </div>
            <div className="relative flex min-w-full h-full" style={{minHeight:"calc(100vh - 18rem)"}}>
                {children}
                <div className="absolute rounded-br-md right-0 flex flex-col gap-2 p-3.5 min-w-55 min-h-full bg-gradient-to-b from-primary/60 from-0% via-secondary/40 via-110% to-secondary/40 to-100%" style={{boxShadow:"10px 0 24px rgba(0,0,0,0.2)"}}>
                    <h2 className="font-semibold text-lg">Categories</h2>
                    <div className="flex flex-col gap-2 pl-4">
                        <Link href={`/modules/${moduleCode}`}>
                            <h3 className="text-md">General</h3>
                        </Link>
                        <Link href={`/modules/${moduleCode}/Lecture`}>
                            <h3 className="text-md">Lecture</h3>
                        </Link>
                        <Link href={`/modules/${moduleCode}/Tutorial`}>
                            <h3 className="text-md">Tutorial</h3>
                        </Link>
                        <Link href={`/modules/${moduleCode}/Assignment`}>
                            <h3 className="text-md">Assignment</h3>
                        </Link>
                        <Link href={`/modules/${moduleCode}/Exam`}>
                            <h3 className="text-md">Exam</h3>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}