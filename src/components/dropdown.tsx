"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const choices: {Faculty: string[]; Major: string[]; Residence: string[]; Year: string[]; Nationality: string[];} = {
  Faculty: ["Business School", "School of Computing", "Dentistry", "Design and Engineering", "Humanities and Sciences", "Law", "School of Medicine", "Music", "Public Health", "NUS College", "NUS Graduate School", "SCALE", "Public Policy"],
  Major: ["Anthropology", "Applied Mathematics", "Architecture", "Artificial Intelligence", "Biomedical Engineering", "Business Administration", "Business Analytics", "Chemical Engineering", "Chemistry", "Chinese Language", "Chinese Studies", "Civil Engineering", "Communications and New Media", "Computer Engineering", "Computer Science", "Data Science and Analytics", "Data Science and Economics", "Dentistry", "Economics", "Electrical Engineering", "Engineering Science", "English Language", "English Literature", "Environmental Studies", "Finance", "Food Science and Technology", "Geography", "Global Studies", "History", "Industrial and Systems Engineering", "Industrial Design", "Information Security", "Information Systems", "Infrastructure and Project Management", "Japanese Studies", "Landscape Architecture", "Law", "Life Sciences", "Malay Studies", "Materials Science and Engineering", "Mathematics", "Mechanical Engineering", "Medicine", "Music", "Nursing", "Pharmaceutical Science", "Pharmacy", "Philosophy", "Philosophy, Politics and Economics", "Physics", "Political Science", "Psychology", "Quantitative Finance", "Robotics and Machine Intelligence", "Social Work", "Sociology", "South Asian Studies", "Southeast Asian Studies", "Statistics", "Theatre Studies"],
  Residence: ["Acacia College", "Cendana College", "College of Alice & Peter Tan", "Eusoff Hall", "Elm College", "Helix House", "Kent Ridge Hall", "King Edward VII Hall", "LightHouse", "Pioneer House", "Prince George's Park Residence", "Raffles Hall", "Ridge View Residential College", "Saga College", "Sheares Hall", "Tembusu College", "Temasek Hall", "UTown Residence"],
  Year: ["Undergraduate Y1", "Undergraduate Y2", "Undergraduate Y3", "Undergraduate Y4", "Exchange", "Postgraduate", "PhD"],
  Nationality: ["Singapore Citizen", "Singapore PR", "Chinese", "Indian", "Malaysian", "Indonesian", "South Korean", "Japanese", "Burmese", "Filipino", "Vietnamese", "European", "American", "Australian"]
};

export default function Dropdown({
    identifier, options, filters, callback, isChoices
}: {
    identifier: string;
    options: string[];
    filters: string[][];
    callback: (filters: string[][]) => void;
    isChoices: boolean;
}) {

  return (
    <Select 
      onValueChange={(newValue) => {
        if (isChoices) {
          const individual = filters?.filter(f => f?.[0] == identifier)?.[0];
          individual[2] = newValue; 
          callback(filters?.map(f => f?.[0] == identifier ? individual : f, options));
        } else {
          const individual = filters?.filter(f => f?.[0] == identifier)?.[0];
          individual[1] = newValue; 
          const newOptions = options?.filter(o => o != newValue);
          callback(filters?.map(f => f?.[0] == identifier ? individual : f, options));
        }
      }}>
      <SelectTrigger className="w-full max-w-48 bg-white/35">
        <SelectValue placeholder={`Select ${isChoices ? filters?.filter(f => f?.[0] == identifier)?.[0]?.[1] : "Criteria"}`} />
      </SelectTrigger>
      <SelectContent className="bg-white/35 backdrop-blur">
        <SelectGroup>
          <SelectLabel>{isChoices ? filters?.filter(f => f?.[0] == identifier)?.[0]?.[1] : "Criteria"}</SelectLabel>
          {
            isChoices 
              ? (
                  // @ts-ignore
                  choices?.[filters?.filter(f => f?.[0] == identifier)?.[0]?.[1]]?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)
                )
              : options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}