import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";

export default function search() {
  return (
    <search className="flex bg-black/8 rounded-md min-w-full ">
        <input type="search" className="h-8.5 outline-none min-w-70 text-white p-1 px-2 placeholder-white/60 rounded-md" placeholder="Search"></input>
        <button className="px-2 text-white bg-black/8 rounded-r-md hover:cursor-pointer">
            <IoSearchOutline />
        </button>
    </search>
  );
}
