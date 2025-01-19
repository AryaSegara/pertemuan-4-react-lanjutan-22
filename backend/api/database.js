import pg from "pg";
import dotenv from "dotenv";

// Memuat file .env
dotenv.config();
const { Pool } = pg;

// Menggunakan variabel dari .env
const connection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

console.log("Connected ke database berhasil");
export default connection;


