"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import background from "../../../../public/login-background.png"
import { useRef, useState } from "react";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const firstNameRef = useRef<HTMLInputElement | null>(null);
    const lastNameRef = useRef<HTMLInputElement | null>(null);
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function isValidUsername(username: string): boolean {
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    } 
    function isValidFirstName(firstName: string): boolean {
        return /^[A-Za-z]+$/.test(firstName);
    }

    async function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();

        const firstName = firstNameRef?.current?.value as string;
        const lastName = lastNameRef?.current?.value as string;
        const username = usernameRef?.current?.value as string;
        const password = passwordRef?.current?.value as string;
        let passChecks = true;

        if (firstName.length == 0) {
            passChecks = false;
            setFirstNameError("First name field is required!");
        } else if (!isValidFirstName(firstName)) {
            passChecks = false;
            setFirstNameError("First name must not contain symbols or numbers!");
        }
        if (lastName.length > 0 && !isValidFirstName(lastName)) {
            passChecks = false;
            setLastNameError("Last name should not contain any symbols or numbers!");
        }
        if (!isValidUsername(username)) {
            passChecks = false;
            setUsernameError("Username must be 3-20 characters long and contains only letters, numbers, and underscores!");
        }
        if (password.length < 8) {
            passChecks = false;
            setPasswordError("Password must be more than 8 characters");
        }

        if (passChecks) {
            setFirstNameError("");
            setLastNameError("");
            setUsernameError("");
            setPasswordError("");

            const account = {firstName: firstName, lastName: lastName, username: username, password: password};

            type response = {
                message: string
            }
            const response = await fetchBackendClient<response>("/auth/signup/create-account", "POST", account);

            if (response?.message == "You are authorized") {
                setErrorMessage(response.message);
                router.push("/signup/account-form")
            } else {
                setErrorMessage(response.message);
            }   
        }
    }

    return (
        <div className="p-12 w-145 max-w-145 rounded-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
            <form name="signup" method="post" className="flex flex-col gap-8 items-center">
            <h1 className="text-3xl font-momo">Create Account</h1>
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <label>First Name</label>
                    <input ref={firstNameRef} type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="First name"></input>
                </div>
                <div className="flex flex-col">
                    <label>Last Name</label>
                    <input ref={lastNameRef} type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Last name"></input>
                </div>
            </div>

            {firstNameError}
            {lastNameError}
            
            <div className="min-w-full max-w-full">
                <label>Username</label>
                <input ref={usernameRef} type="text" name="username" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your username..."></input>
                {usernameError}
            </div>
            <div className="min-w-full max-w-full">
                <label>Password</label>
                <input ref={passwordRef} type="password" name="password" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your password..."></input>
                {passwordError}
            </div>
            <button type="submit" onClick={e => handleSubmit(e)} className="min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Sign Up</button>
            {errorMessage}
            </form>
        </div>
    );
}