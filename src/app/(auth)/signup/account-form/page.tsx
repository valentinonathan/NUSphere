"use client";
import DropdownComponent from "@/app/(auth)/signup/account-form/dropdownComponent";
import { useState } from "react";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { useRouter } from "next/navigation";

export default function AccountForm() {
    const router = useRouter();
    type accountForm = {Nationality: string, Year: string, Faculty: string, Major: string, Residence: string};

    const [nationality, setNationality] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [faculty, setFaculty] = useState<string>("");
    const [major, setMajor] = useState<string>("");
    const [residence, setResidence] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();
        const accountForm: accountForm = {Nationality: nationality, Year: year, Faculty: faculty, Major: major, Residence: residence};

        type response = {message: string};
        const response = await fetchBackendClient<response>("/auth/signup/edit-account-details", "POST", accountForm);

        if (response.message == "Details saved") {
            setErrorMessage(response.message);
            router.push("/");
        } else {
            setErrorMessage(response.message);
        }
    }

    return (
        <div className="p-12 py-10 rounded-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
            <form className="flex flex-col gap-4">
            <h1 className="font-momo text-2xl">Complete your Profile Details</h1>
            <div className="min-w-full flex flex-col">
                <label>Nationality</label>
                <DropdownComponent setState={setNationality} name="Nationality" placeholder="Select nationality" options={["Singapore Citizen", "Singapore PR", "Chinese", "Indian", "Malaysian", "Indonesian", "South Korean", "Japanese", "Burmese", "Filipino", "Vietnamese", "European", "American", "Australian"]}/>
            </div>
            <div className="min-w-full flex flex-col">
                <label>Year</label>
                <DropdownComponent setState={setYear} name="Year" placeholder="Select year of study" options={["Undergraduate Y1", "Undergraduate Y2", "Undergraduate Y3", "Undergraduate Y4", "Exchange", "Postgraduate", "PhD"]}/>
            </div>
            <div className="min-w-full flex flex-col">
                <label>Faculty</label>
                <DropdownComponent setState={setFaculty} name="Faculty" placeholder="Select faculty" options={["Business School", "School of Computing", "Dentistry", "Design and Engineering", "Humanities and Sciences", "Law", "School of Medicine", "Music", "Public Health", "NUS College", "NUS Graduate School", "SCALE", "Public Policy"]}/>
            </div>
            <div className="min-w-full flex flex-col">
                <label>Major</label>
                <DropdownComponent setState={setMajor} name="Major" placeholder="Select major" options={["Anthropology", "Applied Mathematics", "Architecture", "Artificial Intelligence", "Biomedical Engineering", "Business Administration", "Business Analytics", "Chemical Engineering", "Chemistry", "Chinese Language", "Chinese Studies", "Civil Engineering", "Communications and New Media", "Computer Engineering", "Computer Science", "Data Science and Analytics", "Data Science and Economics", "Dentistry", "Economics", "Electrical Engineering", "Engineering Science", "English Language", "English Literature", "Environmental Studies", "Finance", "Food Science and Technology", "Geography", "Global Studies", "History", "Industrial and Systems Engineering", "Industrial Design", "Information Security", "Information Systems", "Infrastructure and Project Management", "Japanese Studies", "Landscape Architecture", "Law", "Life Sciences", "Malay Studies", "Materials Science and Engineering", "Mathematics", "Mechanical Engineering", "Medicine", "Music", "Nursing", "Pharmaceutical Science", "Pharmacy", "Philosophy", "Philosophy, Politics and Economics", "Physics", "Political Science", "Psychology", "Quantitative Finance", "Robotics and Machine Intelligence", "Social Work", "Sociology", "South Asian Studies", "Southeast Asian Studies", "Statistics", "Theatre Studies"]}/>
            </div>
            <div className="min-w-full flex flex-col">
                <label>Residence</label>
                <DropdownComponent setState={setResidence} name="Residence" placeholder="Select residence" options={["Acacia College", "Cendana College", "College of Alice & Peter Tan", "Eusoff Hall", "Elm College", "Helix House", "Kent Ridge Hall", "King Edward VII Hall", "LightHouse", "Pioneer House", "Prince George's Park Residence", "Raffles Hall", "Ridge View Residential College", "Saga College", "Sheares Hall", "Tembusu College", "Temasek Hall", "UTown Residence"]}/>
            </div>
            <button type="button" onClick={e => handleSubmit(e)} className="mt-4 min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Submit</button>
            {errorMessage}
            </form>
        </div>
    );
}