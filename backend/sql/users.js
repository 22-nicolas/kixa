import pool from "./db.js"

export async function getUserByEmail(email) {
    const [userData] = await pool.query(`
        select *
        from users
        where email = ?   
    `, [email])

    return userData[0];
}

export async function registerUser(userData) {
    const {first_name, last_name, country, city, zip_code, street, house_number, email, phone_number, password} = userData;
    await pool.query(`
        insert into users (first_name, last_name, country, city, zip_code, street, house_number, email, phone_number, password)
        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, country, city, zip_code, street, house_number, email, phone_number, password]);
}