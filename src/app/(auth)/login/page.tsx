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
        <div className="z-1 flex-1 min-w-full min-h-full h-full w-full">
            <div className="absolute right-0 flex text-white items-center justify-center min-w-125 min-h-full backdrop-blur rounded-l-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
            <form name="login" method="post" className="flex flex-col gap-6">
                <h1 className="text-2xl font-semibold text-center">Login</h1>
                <div className="flex flex-col gap-2">
                    <label>Username:</label>
                    <input type="text" name="username" className="bg-white/20 p-1.5 w-80 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your username..."></input>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Password</label>
                    <input type="password" name="password" className="bg-white/20 p-1.5 w-80 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your password..."></input>
                </div>
                <p className="text-center">Do not have an account yet? <a className="underline hover:cursor-pointer">Sign Up</a></p>
                <button type="submit" className="min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Sign In</button>
            </form>
            </div>
        </div>
        </>
    );
}