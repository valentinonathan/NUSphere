"use client";

import FilterPeople from "./FilterPeople";
import { IoAdd } from "react-icons/io5";

export default function FindPeople() {
    return (
        <div className="min-w-full flex flex-col items-center gap-4 max-w-full  ">
            <h1 className="text-4xl font-momo">Discover Your People:</h1>
            <div className="min-w-full flex gap-4 flex-wrap justify-center">
                <FilterPeople />
                <FilterPeople />
                <FilterPeople />
                <FilterPeople />
                <FilterPeople />
                <div className="flex justify-center items-center min-w-20 min-h-20">
                    <IoAdd className="text-4xl text-white/80"/>
                </div>
            </div>
        </div>
    );
}