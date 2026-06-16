export async function fetchBackendClient<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for client component
    const response = await fetch("/api/proxy", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            endpoint,
            method,
            body
        })
    });

    const data = await response.json();
    return data;
}