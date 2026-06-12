import { cookies } from "next/headers";

export async function fetchBackendServer<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for server component
    try {
        const cookieStore = await cookies();
        if (method == "GET" || method == "DELETE") {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
            });
            if (!response.ok) {
                console.log("Failed to fetch")
            }
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
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
    } catch(error: unknown) {
        const err = error as Error;
        console.log(err?.message);
        return null as T;
    }   
}

