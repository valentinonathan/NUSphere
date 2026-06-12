"use client";

import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import background from "../../../../public/login-background.png"
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [usernameWarning, setUsernameWarning] = useState<string>();
    const [passwordWarning, setPasswordWarning] = useState<string>();

    async function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();
        const username = usernameRef?.current?.value;
        const password = passwordRef?.current?.value;
        if (username != undefined && username?.length == 0) {
            return setUsernameWarning("Username field should not be empty!");
        }
        if (username != undefined && username?.length > 30) {
            return setUsernameWarning("Username must be lest than 30 words!");
        }
        if (password != undefined && password?.length == 0) {
            return setPasswordWarning("Password field should not be empty!")
        }

        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            router.push("/");
        } else {
            setErrorMessage(data?.message);
        }
    }

    return (
        <>
        <div className="fixed z-0 top-0 h-screen w-screen bg-center bg-cover" style={{ backgroundImage: `url(${background.src})` }}></div>
        <div className="absolute right-0 flex text-white items-center justify-center min-w-125 min-h-full backdrop-blur rounded-l-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
        <form name="login" method="post" className="flex flex-col gap-6">
            <h1 className="text-2xl font-momo text-center">Login</h1>
            <div className="flex flex-col gap-2">
                <label>Username</label>
                <input type="text" ref={usernameRef} name="username" className="bg-white/20 p-1.5 w-80 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your username..."></input>
                {usernameWarning}
            </div>
            <div className="flex flex-col gap-2">
                <label>Password</label>
                <input type="password" ref={passwordRef} name="password" className="bg-white/20 p-1.5 w-80 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your password..."></input>
                {passwordWarning}
            </div>
            <p className="text-center">Do not have an account yet? <Link href="/signup" className="underline hover:cursor-pointer">Sign Up</Link></p>
            <button type="submit" onClick={e => handleSubmit(e)} className="min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Sign In</button>
            {errorMessage}
        </form>
        </div>
        </>
    );
}
