import { useToasts } from "../customHooks/CustomToastsProvider";
import { fireErrorEvent } from "../modules/ErrorEvent";


export async function apiFetch(url, options) {
    const res = await fetch(url, options);

    if (res.status === 429) {
        const reset = res.headers.get('RateLimit-Reset');
        fireErrorEvent(`You are doing that too fast. Please try again after ${reset ?? "a few"} seconds.`);
        throw new Error('Rate limited');
    }

    return res;
}