import pool from "./db.js"
import crypto from "crypto";


const SESSION_DURATION = 10 //10 minutes

export async function getUserById(id) {
   const [userData] = await pool.query(`
        select *
        from users
        where user_id = ?   
    `, [id])

    return userData[0]; 
}

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

export async function createSession(userId) {
    //create session id
    const sessionId = crypto.randomBytes(32).toString("hex");

    //hash session id
    const hashedSessionId =  crypto.createHash("sha256").update(sessionId).digest("hex");
    
    await pool.query(`
        insert into sessions (id, user_id, expires_at)
        values(?, ?, NOW() + INTERVAL ? MINUTE)
    `, [hashedSessionId, userId, SESSION_DURATION])

    return sessionId;
}

export async function validateSession(sessionId) {
    const sessionData = await pool.query(`
        select * from sessions
        where id = ? and expires_at > NOW()
    `, [sessionId])

    return sessionData[0][0];
}

export async function sessionsCleanup() {
    await pool.query(`
        delete from sessions
        where expires_at < NOW()
    `)
}