// app/api/login/route.ts

import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup/create-account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return Response.json(data, {
            status: response.status,
        });
    }

    const cookieStore = await cookies();

    cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({
        message: "You are authorized",
    });
}