export async function fetchBackendClient<T>(endpoint: string, method: string, body?: object): Promise<T>{ // Fetch backend for client component
    try {
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
    } catch (error) {
        console.error(error);
        return null as T;
    }
}