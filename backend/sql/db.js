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
        connectTimeout: 10000,
        waitForConnections: true,
    };
}

const pool = mysql.createPool(connectionConfig).promise();

export function isDbConnectionError(err) {
  if (!err) return false;
  const dbCodes = [
    'ECONNREFUSED',
    'EACCES',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'EAI_AGAIN',
    'PROTOCOL_CONNECTION_LOST',
    'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
    'ER_CON_COUNT_ERROR',
    'ER_ACCESS_DENIED_ERROR',
    'HANDSHAKE_TIMEOUT',
    'CONNECT_TIMEOUT'
  ];
  if (dbCodes.includes(err.code)) return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('unable to connect') ||
    msg.includes('connect econnrefused') ||
    msg.includes('connect eacces') ||
    msg.includes('connection lost') ||
    msg.includes('closed the connection') ||
    msg.includes('server has gone away') ||
    msg.includes('etimedout')
  );
}

export async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
}

export async function checkPool(retryCount = 5, delayMs = 1500) {
  for (let i = 0; i < retryCount; i++) {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (err) {
      console.warn(`[Database] Connection attempt ${i + 1}/${retryCount} failed: ${err.message}`);
      if (i < retryCount - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
  return false;
}

export default pool;
