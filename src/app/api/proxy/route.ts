// app/api/proxy/route.ts

import { cookies } from "next/headers";

export async function POST(req: Request) {
    const {
        endpoint,
        method,
        body
    } = await req.json();

    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint,
        {
            method,
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`
            },
            ...(method !== "GET" &&
                method !== "DELETE" && {
                    body: JSON.stringify(body),
                }),
        }
    );

    const data = await response.json();

    return Response.json(data, {
        status: response.status,
    });
}