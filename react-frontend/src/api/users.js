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