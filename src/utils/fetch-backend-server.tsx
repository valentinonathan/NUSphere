import { cookies } from "next/headers";

export async function fetchBackendServer<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for server component
    const cookieStore = await cookies();
    if (method == "GET" || method == "DELETE") {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
        });
        const data = await response.json();
        return data;
    } else {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return data;
    }
}

