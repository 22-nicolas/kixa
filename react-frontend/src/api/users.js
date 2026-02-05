import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();

export async function validateUserData(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    
    if (response.ok) return null; 
    
    const errorData = await response.json();
    //console.log(errorData);
    return errorData;
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
    
    return response;
}