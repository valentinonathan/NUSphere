"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import background from "../../../../public/login-background.png"

export default function SignUp() {
    return (
        <div className="p-12 rounded-md bg-gradient-to-b from-primary/50 from-0% via-primary/70 via-110% to-primary/50 to-100%">
            <form name="signup" method="post" className="flex flex-col gap-8 items-center">
            <h1 className="text-3xl font-momo">Create Account</h1>
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <label>First Name</label>
                    <input type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="First name"></input>
                </div>
                <div className="flex flex-col">
                    <label>Last Name</label>
                    <input type="text" name="username" className="max-w-60 bg-white/20 p-1.5 rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Last name"></input>
                </div>
            </div>
            <div className="min-w-full">
                <label>Username</label>
                <input type="text" name="username" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your username..."></input>
            </div>
            <div className="min-w-full">
                <label>Password</label>
                <input type="password" name="password" className="bg-white/20 p-1.5 w-full rounded-sm border-1 border-white/20 shadow-md shadow-black/5" placeholder="Type your password..."></input>
            </div>
            <button type="submit" className="min-w-full bg-secondary/70 p-2 rounded-sm border-1 border-white/20 shadow-md shadow-black/5 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Sign Up</button>
            </form>
        </div>
    );
}