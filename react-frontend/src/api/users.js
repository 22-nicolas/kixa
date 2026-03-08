import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    
    if (response.ok) return {ok: true}

    if (response.status === 500) {
        return {error: "Internal Server error"}
    }
    
    const data = await response.json();
    return data;
}

export async function loginUser(email, password) {
    const userData = {email: email, password: password}
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (response.ok) {
        const data = await response.json();
        const sessionId = data.sessionId;
        document.cookie = `sessionId=${sessionId}`;
        return {ok: true, sessionId: sessionId}
    }
    
    if (response.status === 500) {
        return {error: "Internal Server error"}
    }
    
    const data = await response.json();
    return data;
}

export async function getUserDataWithSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/users/sessions/${sessionId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        }
    });

    if(!response.ok) return

    const userData = await response.json();
    return userData;
}