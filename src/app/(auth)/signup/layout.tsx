"use client";
import background from "../../../../public/login-background.png"
import { createContext, useState } from "react"

type SignUpData = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    faculty: string;
    major: string;
    residence: string;
    nationality: string;
    degreeProgram: string;
    yearOfStudy: string;
    modules: string[];
    hobbies: string[];
    personality: string[];
    intent: string[];
}
type SignUpContextType = {
    data: SignUpData;
    setData: React.Dispatch<React.SetStateAction<SignUpData>>;
}

export const SignUpContext = createContext<SignUpContextType | null>(null);

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [data, setData] = useState()
  return (
    <>
        <div className="fixed z-0 top-0 h-screen w-screen bg-center bg-cover" style={{ backgroundImage: `url(${background.src})` }}></div>
        <div className="text-white z-1 flex justify-center items-center min-w-screen min-h-screen max-w-screen max-h-screen w-screen h-screen">
            {children}
        </div>
    </>
  );
}