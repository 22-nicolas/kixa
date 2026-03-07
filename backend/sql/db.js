import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config({ path: "backend/.env" });

let connectionConfig;
if (process.env.DATABASE_URL) { // For production (Aiven, Railway, etc.)
    connectionConfig = process.env.DATABASE_URL;
} else {
    // Use individual env vars (for local)
    connectionConfig = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    };
}

const pool = mysql.createPool(connectionConfig).promise();

export default pool;
