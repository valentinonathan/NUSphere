"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import background from "../../../../public/login-background.png"

export default function Login() {
    return (
        <>
        <div className="fixed z-0 top-0 h-screen w-screen bg-center bg-cover" style={{ backgroundImage: `url(${background.src})` }}></div>
        <div className="text-white z-1 flex justify-center items-center min-w-screen min-h-screen max-w-screen max-h-screen w-screen h-screen">
            <div className="flex flex-col items-center gap-8 p-12 rounded-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
                <h1 className="text-3xl font-momo">Create Account</h1>
                <div className="flex gap-4">
                    <div className="">
                        <h3 className="">First Name</h3>
                        <input type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="First name"></input>
                    </div>
                    <div className="">
                        <h3 className="">Last Name</h3>
                        <input type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Last name"></input>
                    </div>
                </div>
                <div className="min-w-full">
                    <h3 className="">Username</h3>
                    <input type="text" name="username" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your username..."></input>
                </div>
                <div className="min-w-full">
                    <h3 className="">Password</h3>
                    <input type="password" name="password" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your password..."></input>
                </div>
                <button type="submit" className="min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Sign Up</button>
            </div>
        </div>
        </>
    );
}