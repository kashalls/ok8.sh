// What a failed $fetch carries: the server's error body and the status text.
export interface FetchFailure {
    data?: { message?: string, statusMessage?: string }
    statusMessage?: string
}

// The server's message for a failed $fetch, or the fallback when it has none.
export function errorMessage(e: unknown, fallback: string) {
    const { data } = (e ?? {}) as FetchFailure
    return data?.message || data?.statusMessage || fallback
}
