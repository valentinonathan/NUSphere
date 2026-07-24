import moduledummy from "../../../../public/moduledummy.jpg"
import Link from "next/link";

export default function ModuleBox({moduleCode}: {moduleCode: string}) {
    return (
        <Link href={`/modules/${moduleCode}`}>
        <div className="w-76 shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="bg-white rounded-t-md w-full h-38">
                <img src={moduledummy.src} className="object-cover w-full h-full rounded-t-md" />
            </div>
            <h3 className="text-lg font-semibold p-1.5">{moduleCode}</h3>
        </div>
        </Link>
    );
}