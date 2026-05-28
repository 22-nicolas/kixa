import { getUserByEmail } from "../sql/users.js";

export const validateForms = {
    login: ['email', 'password'],
    register: [
        'first_name', 'last_name', 'country', 'city', 'zip_code', 
        'street', 'house_number', 'email', 'password', 
        'repeat_password'
    ],
    address: [
        'first_name', 'last_name', 'country', 'city', 'zip_code', 
        'street', 'house_number', 
    ]
}

export async function validateForm(userData, requiredFields) {
    if (!requiredFields) {
        return { error: 'Invalid validation form' };
    }

    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
        return { error: `Missing required fields`, missing: missingFields };
    }

    // Return early for address validation.
    if (requiredFields === validateForms.address) return null;

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return { error: 'Invalid email format' };
    }

    // Return early for login validation.
    if (requiredFields === validateForms.login) return null;

    // Check if email is unique
    const emailExists = await getUserByEmail(userData.email);
    if (emailExists != null) {
        return { error: 'Email already exists' };
    }

    // Check if repeat password matches password
    if (userData.password !== userData.repeat_password) {
        return { error: 'Passwords do not match' };
    }    

    return null; // Indicates successful validation
}