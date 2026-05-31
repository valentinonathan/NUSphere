import Dropdown from "@/components/dropdown";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function FilterPeople({identifier, options, filters, callback}: {identifier: string; options: string[]; filters: string[][]; callback: (filters: string[][], options: string[]) => void;}) {

    const choices: {Faculty: string[]; Major: string[]; Residence: string[]; Year: string[]; Nationality: string[];} = {
        Faculty: ["Business School", "School of Computing", "Dentistry", "Design and Engineering", "Humanities and Sciences", "Law", "School of Medicine", "Music", "Public Health", "NUS College", "NUS Graduate School", "SCALE", "Public Policy"],
        Major: ["Anthropology", "Applied Mathematics", "Architecture", "Artificial Intelligence", "Biomedical Engineering", "Business Administration", "Business Analytics", "Chemical Engineering", "Chemistry", "Chinese Language", "Chinese Studies", "Civil Engineering", "Communications and New Media", "Computer Engineering", "Computer Science", "Data Science and Analytics", "Data Science and Economics", "Dentistry", "Economics", "Electrical Engineering", "Engineering Science", "English Language", "English Literature", "Environmental Studies", "Finance", "Food Science and Technology", "Geography", "Global Studies", "History", "Industrial and Systems Engineering", "Industrial Design", "Information Security", "Information Systems", "Infrastructure and Project Management", "Japanese Studies", "Landscape Architecture", "Law", "Life Sciences", "Malay Studies", "Materials Science and Engineering", "Mathematics", "Mechanical Engineering", "Medicine", "Music", "Nursing", "Pharmaceutical Science", "Pharmacy", "Philosophy", "Philosophy, Politics and Economics", "Physics", "Political Science", "Psychology", "Quantitative Finance", "Robotics and Machine Intelligence", "Social Work", "Sociology", "South Asian Studies", "Southeast Asian Studies", "Statistics", "Theatre Studies"],
        Residence: ["Acacia College", "Cendana College", "College of Alice & Peter Tan", "Eusoff Hall", "Elm College", "Helix House", "Kent Ridge Hall", "King Edward VII Hall", "LightHouse", "Pioneer House", "Prince George's Park Residence", "Raffles Hall", "Ridge View Residential College", "Saga College", "Sheares Hall", "Tembusu College", "Temasek Hall", "UTown Residence"],
        Year: ["Undergraduate Y1", "Undergraduate Y2", "Undergraduate Y3", "Undergraduate Y4", "Exchange", "Postgraduate Y1", "Postgraduate Y2", "PhD"],
        Nationality: ["Singapore Citizen", "Singapore PR", "Chinese", "Indonesian", "Indian", "Malaysian", "Burmese", "Filipino", "Vietnamese", "European", "American", "Australian"]
    };

    return (
        <div className="z-0 relative">
            <div className="flex flex-col gap-4 justify-center items-center min-w-60 min-h-32 p-4 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                <Dropdown identifier={identifier} options={options} filters={filters} callback={callback} isChoices={false}/>
                <Dropdown identifier={identifier} options={options} filters={filters} callback={callback} isChoices={true} />
            </div>
            <button onClick={() => callback(filters?.filter(c => c?.[0] != identifier))}>
                <div className="z-100 absolute top-1 left-1">
                    <IoClose className="text-white/80 hover:cursor-pointer"/>
                </div>
            </button>
        </div>
    );
}