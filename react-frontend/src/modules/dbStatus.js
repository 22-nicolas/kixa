import { getBaseApiUrl } from "./utils.js";

let isDbConnected = true;
let isBannerDismissed = false;
const listeners = [];
const reconnectedListeners = [];

export function getDbStatus() {
    return isDbConnected;
}

export function isBannerHidden() {
    return isBannerDismissed;
}

export function setBannerDismissed(dismissed) {
    isBannerDismissed = dismissed;
    notifyListeners();
}

export function setDbStatus(connected, message = "") {
    const wasDisconnected = isDbConnected === false;
    const changed = isDbConnected !== connected;
    isDbConnected = connected;

    if (changed) {
        if (!connected) {
            // Re-show banner if DB goes down again
            isBannerDismissed = false;
        }
        notifyListeners();

        // If transitioning from disconnected to connected, notify reconnected listeners
        if (wasDisconnected && connected) {
            notifyReconnectedListeners();
        }
    }
}

export function subscribeToDbStatus(fn) {
    if (!listeners.includes(fn)) {
        listeners.push(fn);
    }
}

export function unsubscribeFromDbStatus(fn) {
    const index = listeners.indexOf(fn);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
}

export function subscribeToDbReconnected(fn) {
    if (!reconnectedListeners.includes(fn)) {
        reconnectedListeners.push(fn);
    }
}

export function unsubscribeFromDbReconnected(fn) {
    const index = reconnectedListeners.indexOf(fn);
    if (index !== -1) {
        reconnectedListeners.splice(index, 1);
    }
}

function notifyListeners() {
    listeners.forEach(fn => {
        try {
            fn(isDbConnected, isBannerDismissed);
        } catch (e) {
            console.error("Error in db status listener:", e);
        }
    });
}

function notifyReconnectedListeners() {
    reconnectedListeners.forEach(fn => {
        try {
            fn();
        } catch (e) {
            console.error("Error in db reconnected listener:", e);
        }
    });
}

export async function pingDbHealth() {
    try {
        const baseUrl = getBaseApiUrl();
        const res = await fetch(`${baseUrl}/health`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" }
        });
        if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.database === "connected" || data.status === "ok") {
                setDbStatus(true);
                return true;
            }
        }
        setDbStatus(false);
        return false;
    } catch {
        setDbStatus(false);
        return false;
    }
}
