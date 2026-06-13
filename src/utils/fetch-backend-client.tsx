export async function fetchBackendClient<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for client component
    if (method == "GET" || method == "DELETE") {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + endpoint, {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
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
        const data = await response.json();
        return data;
    }
}