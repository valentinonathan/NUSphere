export async function fetchBackendClient<T>(
    endpoint: string,
    method: string,
    body?: object
): Promise<T> {
    try {
        let response: Response;

        if (method === "GET") {
            response = await fetch(
                `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
        } else {
            response = await fetch("/api/proxy", {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endpoint,
                    method,
                    body,
                }),
            });
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(error);
        return null as T;
    }
}