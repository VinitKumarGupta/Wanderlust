/**
 * Centralized fetch helper for all API calls.
 * Always sends credentials (session cookie) and targets /api prefix.
 */
const BASE = "/api";

async function apiFetch(url, options = {}) {
    const res = await fetch(`${BASE}${url}`, {
        credentials: "include",
        ...options,
        headers: {
            // Only set Content-Type to JSON when we're not sending FormData
            ...(!(options.body instanceof FormData) && {
                "Content-Type": "application/json",
            }),
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong");
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export default apiFetch;
