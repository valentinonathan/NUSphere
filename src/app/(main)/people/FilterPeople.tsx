import Dropdown from "@/components/dropdown";
import { IoClose } from "react-icons/io5";

export default function FilterPeople() {

    const options = ["Faculty", "Major", "Residence", "Year of Study", "Nationality"];

    return (
        <div className="z-0 relative">
            <div className="flex flex-col gap-4 justify-center items-center min-w-60 min-h-32 p-4 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                <Dropdown label="Criteria" placeholder="Select a criteria" options={options} />
                <Dropdown />
            </div>
            <div className="z-100 absolute top-1 left-1">
                <IoClose className="text-white/80"/>
            </div>
        </div>
    );
}