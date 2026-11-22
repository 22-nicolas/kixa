import { fireErrorEvent } from "../modules/ErrorEvent";
import { setDbStatus } from "../modules/dbStatus";

export async function apiFetch(url, options) {
    let res;
    try {
        res = await fetch(url, options);
    } catch (networkError) {
        // Backend or database completely unreachable
        setDbStatus(false);
        throw new Error("Unable to connect to the server or database. It may be offline or starting up.");
    }

    if (res.status === 429) {
        const reset = res.headers.get('RateLimit-Reset');
        fireErrorEvent(`You are doing that too fast. Please try again after ${reset ?? "a few"} seconds.`);
        throw new Error('Rate limited');
    }

    if (res.status === 503) {
        setDbStatus(false);
    } else if (res.ok) {
        setDbStatus(true);
    }

    return res;
}
