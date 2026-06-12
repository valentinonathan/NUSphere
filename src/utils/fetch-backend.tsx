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
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
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
}

export async function fetchBackendClient<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for client component
    if (method == "GET" || method == "DELETE") {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    } else {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
}