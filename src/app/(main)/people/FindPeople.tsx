"use client";

import { useState } from "react";
import FilterPeople from "./FilterPeople";
import { IoAdd } from "react-icons/io5";

export default function FindPeople() {
    const options: string[] = ["Faculty", "Major", "Residence", "Year", "Nationality"];
    const [filters, setFilters] = useState<string[][]>([[crypto.randomUUID(), "", ""], [crypto.randomUUID(), "", ""], [crypto.randomUUID(), "", ""]]);
    function callbackFilters(filters: string[][], options: string[]): void {
        setFilters(filters);
        console.log(filters);
    }
    function addFilters() {
        setFilters(f => [...f, [crypto.randomUUID(), "", ""]]);
    }

    return (
        <div className="min-w-full flex flex-col items-center gap-4 max-w-full  ">
            <h1 className="text-4xl font-momo">Discover Your People:</h1>
            <div className="min-w-full flex gap-4 flex-wrap justify-center">
                {filters.map(f => <FilterPeople key={f[0]} identifier={f[0]} options={options} filters={filters} callback={callbackFilters} />)}
                <div className="flex justify-center items-center min-w-20 min-h-32 max-h-32">
                    <button onClick={addFilters} className="p-0 m-0">
                        <IoAdd className="text-4xl text-white/80 hover:cursor-pointer"/>
                    </button>
                </div>
            </div>
            <button type="submit" className="min-w-20 bg-pink-500 p-2 rounded-sm shadow-md shadow-black/10 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Find</button>
        </div>
    );
}