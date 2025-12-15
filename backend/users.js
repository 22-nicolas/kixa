export async function validateUserData(userData) {
    const requiredFields = [
        'first_name', 'last_name', 'country', 'city', 'zip_code', 
        'street', 'house_number', 'email', 'phone_number', 'password', 
        'repeat_password'
    ];

    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
        return { error: `Missing required fields`, missing: missingFields };
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return { error: 'Invalid email format' };
    }

    // Check if repeat password matches password
    if (userData.password !== userData.repeat_password) {
        return { error: 'Passwords do not match' };
    }

    //TODO: Validate Address with an API

    return null; // Indicates successful validation
}